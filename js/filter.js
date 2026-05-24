/* ============================================================
   🔍 智慧篩選器 — 沉降淡出重組機制 (filter.js)
   ============================================================
   
   核心動態邏輯：
   
   1. 退場動畫（不符合條件的卡片）：
      - 隨機向下偏移 (translateY +30~60px)
      - 微縮放 (scale 0.92)
      - 淡出 (opacity 0)
      - 過渡結束後設為 display: none
   
   2. 進場 + 重排（FLIP 動畫技術）：
      FLIP = First, Last, Invert, Play
      - First: 記錄所有卡片的當前位置
      - Last:  改變 DOM 可見性後，讀取新位置
      - Invert: 用 transform 讓卡片「看起來還在舊位置」
      - Play:   移除 transform → 瀏覽器自動 transition 到新位置
      
   3. 效能保證：
      - 僅使用 transform + opacity（GPU 合成層屬性）
      - 不觸發 layout reflow
      - 所有動畫走 requestAnimationFrame
      
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     § 可調參數
     ───────────────────────────────────────────── */
  const FILTER_CONFIG = {
    // 退場動畫時長 (ms)
    EXIT_DURATION: 400,

    // 重排動畫時長 (ms)
    FLIP_DURATION: 500,

    // 進場動畫時長 (ms)
    ENTER_DURATION: 500,

    // 退場卡片的最大向下偏移 (px)
    EXIT_TRANSLATE_Y_MIN: 20,
    EXIT_TRANSLATE_Y_MAX: 50,

    // 退場卡片的微縮放
    EXIT_SCALE: 0.92,

    // 進場動畫的起始偏移 (px)
    ENTER_TRANSLATE_Y: 30,

    // 進場卡片的階梯延遲 (ms)
    ENTER_STAGGER: 60,

    // 緩動函數
    EASE_EXIT: 'cubic-bezier(0.45, 0, 0.55, 1)',      // ease-in-out
    EASE_FLIP: 'cubic-bezier(0.23, 1, 0.32, 1)',      // spring
    EASE_ENTER: 'cubic-bezier(0.23, 1, 0.32, 1)',     // spring
  };


  /* ─────────────────────────────────────────────
     § SmartFilter Class
     ───────────────────────────────────────────── */
  class SmartFilter {
    constructor() {
      this.filterBar = document.querySelector('.filter-bar');
      this.cardGrid = document.getElementById('card-grid');
      this.cards = [];
      this.currentFilter = 'all';
      this.isAnimating = false; // 防止動畫重疊

      if (!this.filterBar || !this.cardGrid) {
        console.warn('[SmartFilter] .filter-bar or #card-grid not found');
        return;
      }

      this._init();
    }

    _init() {
      // 快取所有卡片元素
      this.cards = Array.from(this.cardGrid.querySelectorAll('.resource-card'));

      // 綁定篩選按鈕事件
      this.filterBar.addEventListener('click', (e) => {
        const tag = e.target.closest('.filter-tag');
        if (!tag || this.isAnimating) return;

        const filter = tag.dataset.filter;
        if (filter === this.currentFilter) return;

        this._setActiveTag(tag);
        this._filterCards(filter);
        this.currentFilter = filter;
      });

      // 鍵盤無障礙：Enter / Space 觸發篩選
      this.filterBar.addEventListener('keydown', (e) => {
        const tag = e.target.closest('.filter-tag');
        if (!tag) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tag.click();
        }
      });
    }

    /**
     * 更新篩選標籤的 active 狀態
     */
    _setActiveTag(activeTag) {
      this.filterBar.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
        tag.setAttribute('aria-pressed', 'false');
      });
      activeTag.classList.add('active');
      activeTag.setAttribute('aria-pressed', 'true');
    }

    /**
     * 執行篩選動畫
     * @param {string} filter - 篩選類別 ('all' 或具體分類)
     */
    _filterCards(filter) {
      this.isAnimating = true;

      // ── Step 1: 分類卡片 ──
      const toShow = [];
      const toHide = [];
      const alreadyVisible = [];

      this.cards.forEach(card => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;
        const isCurrentlyVisible = !card.classList.contains('filter-hidden');

        if (shouldShow && isCurrentlyVisible) {
          alreadyVisible.push(card);
        } else if (shouldShow && !isCurrentlyVisible) {
          toShow.push(card);
        } else if (!shouldShow && isCurrentlyVisible) {
          toHide.push(card);
        }
        // 不符合且已隱藏的 → 不動
      });

      // ── Step 2: FLIP — 記錄當前位置 (First) ──
      const firstPositions = new Map();
      alreadyVisible.forEach(card => {
        firstPositions.set(card, card.getBoundingClientRect());
      });

      // ── Step 3: 退場動畫（不符合條件的卡片） ──
      toHide.forEach(card => {
        // 隨機向下偏移
        const randomY =
          FILTER_CONFIG.EXIT_TRANSLATE_Y_MIN +
          Math.random() * (FILTER_CONFIG.EXIT_TRANSLATE_Y_MAX - FILTER_CONFIG.EXIT_TRANSLATE_Y_MIN);

        card.style.transition =
          `transform ${FILTER_CONFIG.EXIT_DURATION}ms ${FILTER_CONFIG.EASE_EXIT}, ` +
          `opacity ${FILTER_CONFIG.EXIT_DURATION * 0.7}ms ease`;
        card.style.transform = `translateY(${randomY}px) scale(${FILTER_CONFIG.EXIT_SCALE})`;
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      });

      // ── Step 4: 等退場完成後，重排 ──
      setTimeout(() => {
        // 隱藏退場完成的卡片
        toHide.forEach(card => {
          card.classList.add('filter-hidden');
          card.style.display = 'none';
          // 重置 transform（為下次進場做準備）
          card.style.transform = '';
          card.style.opacity = '';
          card.style.transition = '';
          card.style.pointerEvents = '';
        });

        // 顯示新進場的卡片（先設為不可見，等 FLIP 算完再淡入）
        toShow.forEach(card => {
          card.classList.remove('filter-hidden');
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = `translateY(${FILTER_CONFIG.ENTER_TRANSLATE_Y}px) scale(0.96)`;
        });

        // ── Step 5: FLIP — 讀取新位置 (Last) & 執行 (Invert + Play) ──
        requestAnimationFrame(() => {
          // 對已可見的卡片執行 FLIP 位移
          alreadyVisible.forEach(card => {
            const first = firstPositions.get(card);
            const last = card.getBoundingClientRect();

            // Invert: 計算位置差
            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;

            if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
              // 先瞬間移回舊位置
              card.style.transition = 'none';
              card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

              // 強制重繪
              card.offsetHeight; // eslint-disable-line no-unused-expressions

              // Play: 過渡到新位置
              card.style.transition =
                `transform ${FILTER_CONFIG.FLIP_DURATION}ms ${FILTER_CONFIG.EASE_FLIP}`;
              card.style.transform = '';
            }
          });

          // 新進場卡片：帶階梯延遲的淡入動畫
          toShow.forEach((card, index) => {
            const delay = index * FILTER_CONFIG.ENTER_STAGGER;
            
            setTimeout(() => {
              card.style.transition =
                `transform ${FILTER_CONFIG.ENTER_DURATION}ms ${FILTER_CONFIG.EASE_ENTER}, ` +
                `opacity ${FILTER_CONFIG.ENTER_DURATION * 0.6}ms ease`;
              card.style.transform = '';
              card.style.opacity = '1';
            }, delay);
          });

          // 動畫完成後清除鎖定
          const totalDuration = Math.max(
            FILTER_CONFIG.FLIP_DURATION,
            FILTER_CONFIG.ENTER_DURATION + toShow.length * FILTER_CONFIG.ENTER_STAGGER
          );
          
          setTimeout(() => {
            // 清除所有內聯 transition
            this.cards.forEach(card => {
              card.style.transition = '';
              card.style.transform = '';
            });
            this.isAnimating = false;
          }, totalDuration + 100);
        });

      }, FILTER_CONFIG.EXIT_DURATION);
    }
  }


  /* ─────────────────────────────────────────────
     § 匯出到全域
     ───────────────────────────────────────────── */
  window.SmartFilter = SmartFilter;

})();
