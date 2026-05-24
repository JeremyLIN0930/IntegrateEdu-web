/* ============================================================
   🃏 資料驅動卡片系統 + 3D Hover Tilt (cards.js)
   ============================================================
   
   架構設計：
   1. RESOURCES[] — 物件陣列，將所有卡片資料抽離（Data-Driven）
      → 未來新增/修改資源只需編輯此陣列，不需動 HTML
   2. renderCards() — 動態生成卡片 DOM
   3. CardTiltManager — 管理 3D Tilt 互動、滾動視差、Reveal 進場
   
   真實學習資源對接：
   - 設計：Figma Learn / Canva Design School
   - 程式：freeCodeCamp / The Odin Project
   - 科學：PhET 互動實驗室 / Khan Academy Science
   - 語文：BBC Learning English / VoiceTube
   - 藝術：Google Arts & Culture / MoMA Learning
   - 升學：均一教育平台 / 學習吧 LearnMode
   
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     § 學習資源資料陣列 (Resource Data Array)
     ─────────────────────────────────────────────
     欄位說明：
     - id:            唯一識別碼（用於 DOM id）
     - category:      分類鍵值（對應篩選器 data-filter）
     - categoryLabel: 分類顯示名稱（含 Emoji）
     - title:         資源名稱
     - description:   資源描述（限 2 行）
     - resourceCount: 收錄資源數量
     - image:         封面圖路徑（團隊攝影作品）
     - imageAlt:      圖片替代文字（無障礙）
     - url:           真實外部連結（target="_blank"）
     - source:        資源來源平台名稱
     ───────────────────────────────────────────── */
  const RESOURCES = [

    // ═══════════════════════════════════════════
    // 🎨 設計類 — Design
    // ═══════════════════════════════════════════
    {
      id: 'figma-learn',
      category: 'design',
      categoryLabel: '🎨 設計',
      title: 'Figma 官方設計教學',
      description: '從介面操作到設計系統，Figma 官方提供的完整免費學習路徑，帶你踏入 UI/UX 設計領域。',
      resourceCount: 15,
      image: 'assets/images/card-design.png',
      imageAlt: '在充滿綠意的陽光工作室中專注創作的設計系學生',
      url: 'https://www.figma.com/resources/learn-design/',
      source: 'Figma',
    },
    {
      id: 'canva-school',
      category: 'design',
      categoryLabel: '🎨 設計',
      title: 'Canva 設計學院',
      description: '平面設計、簡報美學、品牌識別一站學會，Canva 免費的互動式設計課程與模板資源庫。',
      resourceCount: 12,
      image: 'assets/images/card-design.png',
      imageAlt: '設計系學生在自然光下進行視覺創作',
      url: 'https://www.canva.com/designschool/',
      source: 'Canva',
    },

    // ═══════════════════════════════════════════
    // 💻 程式類 — Code
    // ═══════════════════════════════════════════
    {
      id: 'freecodecamp',
      category: 'code',
      categoryLabel: '💻 程式',
      title: 'freeCodeCamp 免費程式學堂',
      description: '全球最大的免費程式教育平台，從 HTML/CSS 到 Python 機器學習，完整的自學路徑與認證。',
      resourceCount: 20,
      image: 'assets/images/card-programming.png',
      imageAlt: '在北歐風圖書館中用筆電寫程式的大學生',
      url: 'https://www.freecodecamp.org/learn',
      source: 'freeCodeCamp',
    },
    {
      id: 'odin-project',
      category: 'code',
      categoryLabel: '💻 程式',
      title: 'The Odin Project',
      description: '完全免費、由社群驅動的全端網頁開發課程，從零基礎到獨立建構完整專案。',
      resourceCount: 18,
      image: 'assets/images/card-programming.png',
      imageAlt: '學生在溫暖燈光下專注撰寫程式碼',
      url: 'https://www.theodinproject.com/',
      source: 'The Odin Project',
    },

    // ═══════════════════════════════════════════
    // 🔬 科學類 — Science
    // ═══════════════════════════════════════════
    {
      id: 'phet-simulations',
      category: 'science',
      categoryLabel: '🔬 科學',
      title: 'PhET 互動式虛擬實驗室',
      description: '科羅拉多大學開發的免費互動模擬實驗，涵蓋物理、化學、生物、地科，讓科學觸手可及。',
      resourceCount: 16,
      image: 'assets/images/card-science.png',
      imageAlt: '學生在窗邊透過望遠鏡探索星空的空靈場景',
      url: 'https://phet.colorado.edu/zh_TW/simulations/browse',
      source: 'PhET Colorado',
    },
    {
      id: 'khan-science',
      category: 'science',
      categoryLabel: '🔬 科學',
      title: 'Khan Academy 科學',
      description: '可汗學院的免費科學課程，從基礎物理到有機化學，搭配互動練習與完整中文字幕。',
      resourceCount: 14,
      image: 'assets/images/card-science.png',
      imageAlt: '學生充滿好奇心地觀察科學現象',
      url: 'https://www.khanacademy.org/science',
      source: 'Khan Academy',
    },

    // ═══════════════════════════════════════════
    // 📖 語文類 — Language
    // ═══════════════════════════════════════════
    {
      id: 'bbc-english',
      category: 'language',
      categoryLabel: '📖 語文',
      title: 'BBC Learning English',
      description: 'BBC 官方免費英語學習平台，從日常會話到新聞英語，道地英式發音與豐富影音教材。',
      resourceCount: 13,
      image: 'assets/images/card-language.png',
      imageAlt: '學生在明亮咖啡廳中練習英語對話',
      url: 'https://www.bbc.co.uk/learningenglish',
      source: 'BBC',
    },
    {
      id: 'voicetube',
      category: 'language',
      categoryLabel: '📖 語文',
      title: 'VoiceTube 看影片學英文',
      description: '台灣團隊打造的免費英語學習平台，透過 TED、電影片段等真實影片，自然沉浸式學習英文。',
      resourceCount: 10,
      image: 'assets/images/card-language.png',
      imageAlt: '學生沈浸在語言學習中的溫暖畫面',
      url: 'https://www.voicetube.com/',
      source: 'VoiceTube',
    },

    // ═══════════════════════════════════════════
    // 🎭 藝術類 — Art
    // ═══════════════════════════════════════════
    {
      id: 'google-arts',
      category: 'art',
      categoryLabel: '🎭 藝術',
      title: 'Google Arts & Culture',
      description: 'Google 與全球博物館合作，免費線上瀏覽數千件藝術名作與虛擬導覽，在家就能環遊世界美術館。',
      resourceCount: 11,
      image: 'assets/images/card-art.png',
      imageAlt: '學生在美術館中欣賞大型畫作的文藝場景',
      url: 'https://artsandculture.google.com/',
      source: 'Google',
    },
    {
      id: 'moma-learning',
      category: 'art',
      categoryLabel: '🎭 藝術',
      title: 'MoMA 現代藝術學習',
      description: '紐約現代藝術博物館的免費線上課程，深入了解現代與當代藝術的脈絡、技法與思潮。',
      resourceCount: 8,
      image: 'assets/images/card-art.png',
      imageAlt: '學生探索藝術展覽的沉思時刻',
      url: 'https://www.moma.org/learn/moma_learning/',
      source: 'MoMA',
    },

    // ═══════════════════════════════════════════
    // 📝 升學類 — Exam
    // ═══════════════════════════════════════════
    {
      id: 'junyiacademy',
      category: 'exam',
      categoryLabel: '📝 升學',
      title: '均一教育平台',
      description: '台灣最大的免費線上學習平台，涵蓋國中小到高中的數學、自然、社會等完整課程與練習題。',
      resourceCount: 22,
      image: 'assets/images/card-exam.png',
      imageAlt: '學生在溫暖書桌前使用線上學習平台',
      url: 'https://www.junyiacademy.org/',
      source: '均一教育',
    },
    {
      id: 'learnmode',
      category: 'exam',
      categoryLabel: '📝 升學',
      title: '學習吧 LearnMode',
      description: '信望愛基金會打造的免費數位學習平台，整合教育部教材與多元評量，助力學測指考衝刺。',
      resourceCount: 17,
      image: 'assets/images/card-exam.png',
      imageAlt: '學生認真使用平板進行線上學習',
      url: 'https://www.learnmode.net/',
      source: '學習吧',
    },
  ];


  /* ─────────────────────────────────────────────
     § 卡片 HTML 模板生成器
     ─────────────────────────────────────────────
     根據 RESOURCES 陣列動態生成卡片 DOM，
     不需手動編輯 HTML。
     ───────────────────────────────────────────── */

  /**
   * 生成單張卡片的 HTML 字串
   * @param {Object} resource - 資源物件
   * @param {number} index - 索引（用於階梯動畫延遲）
   * @returns {string} HTML 字串
   */
  function createCardHTML(resource, index) {
    // 計算 reveal 延遲 class（每列 3 張，循環 0-5）
    const delayClass = (index % 6) > 0 ? `reveal-delay-${index % 6}` : '';

    return `
      <article class="resource-card reveal ${delayClass}"
               data-category="${resource.category}"
               role="listitem"
               id="card-${resource.id}">
        <a href="${resource.url}" target="_blank" rel="noopener noreferrer"
           class="card-inner-link"
           aria-label="前往 ${resource.title}（${resource.source}）— 開啟新視窗">
          
          <div class="card-image-wrapper">
            <img class="card-image"
                 src="${resource.image}"
                 alt="${resource.imageAlt}"
                 loading="lazy"
                 decoding="async">
            <span class="card-category">${resource.categoryLabel}</span>
            <!-- 光暈追蹤層（3D Tilt 時的高光跟隨滑鼠） -->
            <div class="card-glare" aria-hidden="true"></div>
          </div>

          <div class="card-body">
            <h3 class="card-title">${resource.title}</h3>
            <p class="card-description">${resource.description}</p>
            <div class="card-footer">
              <span class="card-meta">
                <span class="card-meta-icon" aria-hidden="true">📂</span>
                ${resource.resourceCount} 個免費資源
              </span>
              <span class="card-link">
                <span class="card-source">${resource.source}</span>
                <span class="arrow" aria-hidden="true">→</span>
              </span>
            </div>
          </div>

        </a>
      </article>
    `;
  }

  /**
   * 將所有卡片渲染到 #card-grid 容器
   */
  function renderCards() {
    const grid = document.getElementById('card-grid');
    if (!grid) return;

    const html = RESOURCES.map((res, i) => createCardHTML(res, i)).join('');
    grid.innerHTML = html;
  }


  /* ─────────────────────────────────────────────
     § 3D Tilt 可調參數
     ───────────────────────────────────────────── */
  const TILT_CONFIG = {
    // 最大傾斜角度 (deg)
    MAX_TILT_DEG: 8,

    // 懸浮上移量 (px) — 反重力效果
    HOVER_LIFT_PX: 10,

    /*
       阻尼感（Damping）透過 CSS transition timing 控制：
       - hover 進入：0.15s ease-out → 快速跟手、靈敏
       - hover 離開：0.6s cubic-bezier(0.23,1,0.32,1) → Quint EaseOut
         模擬彈簧阻尼模型：快速啟動 → 緩慢減速 → 優雅停止
       
       ★ 調參指南：
       想更「彈」→ 改 TRANSITION_OUT 為 'cubic-bezier(0.34, 1.56, 0.64, 1)'
       想更「穩」→ 延長時間至 0.8s 或改用 'ease-out'
       想更「跟手」→ 縮短 TRANSITION_IN 至 0.08s
    */
    TRANSITION_IN: 'transform 0.15s ease-out, box-shadow 0.3s ease',
    TRANSITION_OUT: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease',

    // 光暈追蹤強度 (0~1)
    GLARE_OPACITY: 0.1,

    // 滾動視差速度 (0~1，圖片移動 = 卡片的 N 倍)
    PARALLAX_SPEED: 0.3,
  };


  /* ─────────────────────────────────────────────
     § CardTiltManager — 管理所有卡片的 3D Tilt
     ───────────────────────────────────────────── */
  class CardTiltManager {
    constructor() {
      this.cards = [];
      this.observer = null;
      this._init();
    }

    _init() {
      const cardElements = document.querySelectorAll('.resource-card');
      if (cardElements.length === 0) return;

      cardElements.forEach(card => {
        this._bindTiltEvents(card);
        this.cards.push(card);
      });

      this._initParallax();
      this._initRevealObserver();
    }

    /**
     * 為單張卡片綁定 3D Tilt 事件
     *
     * 數學原理：
     * 1. 取得滑鼠相對於卡片中心的 (dx, dy) 偏移
     * 2. 除以半寬/半高 → 正規化為 [-1, 1]
     * 3. 乘以最大角度 → rotateX / rotateY
     * 4. rotateY 對應水平，rotateX 對應垂直（且反向）
     */
    _bindTiltEvents(card) {
      card.addEventListener('mouseenter', () => {
        card.style.transition = TILT_CONFIG.TRANSITION_IN;
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 正規化到 [-1, 1]
        const normalizedX = (mouseX - centerX) / centerX;
        const normalizedY = (mouseY - centerY) / centerY;

        // 計算旋轉角度
        const rotateY = normalizedX * TILT_CONFIG.MAX_TILT_DEG;
        const rotateX = -normalizedY * TILT_CONFIG.MAX_TILT_DEG;

        // 套用 3D transform + 反重力上浮
        card.style.transform =
          `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-${TILT_CONFIG.HOVER_LIFT_PX}px)`;

        // Tiffany 綠微光陰影 — 隨傾斜方向偏移
        const shadowX = normalizedX * 8;
        const shadowY = normalizedY * 4 + 12;
        card.style.boxShadow =
          `${shadowX}px ${shadowY}px 40px rgba(10, 186, 181, 0.18), ` +
          `0 4px 12px rgba(0, 0, 0, 0.06)`;

        // 光暈追蹤
        const glare = card.querySelector('.card-glare');
        if (glare) {
          glare.style.background =
            `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,${TILT_CONFIG.GLARE_OPACITY}), transparent 60%)`;
          glare.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        // 慢速回彈 — 物理阻尼感的關鍵
        card.style.transition = TILT_CONFIG.TRANSITION_OUT;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        card.style.boxShadow = '';

        const glare = card.querySelector('.card-glare');
        if (glare) glare.style.opacity = '0';
      });
    }

    /** 滾動視差（圖片 vs 卡片） */
    _initParallax() {
      const visibleCards = new Set();
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visibleCards.add(entry.target);
          else visibleCards.delete(entry.target);
        });
      }, { rootMargin: '100px 0px', threshold: 0 });

      this.cards.forEach(card => this.observer.observe(card));

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            visibleCards.forEach(card => {
              const img = card.querySelector('.card-image');
              if (!img) return;
              const rect = card.getBoundingClientRect();
              const progress = (rect.top + rect.height / 2) / window.innerHeight;
              const offset = (progress - 0.5) * 30 * TILT_CONFIG.PARALLAX_SPEED;
              img.style.transform = `translateY(${offset}px)`;
            });
            ticking = false;
          });
        }
      }, { passive: true });
    }

    /** 滾動進場觀察者 (Reveal on Scroll) */
    _initRevealObserver() {
      const revealElements = document.querySelectorAll('.reveal');
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }


  /* ─────────────────────────────────────────────
     § 匯出到全域
     ───────────────────────────────────────────── */
  window.RESOURCES = RESOURCES;
  window.renderCards = renderCards;
  window.CardTiltManager = CardTiltManager;

})();
