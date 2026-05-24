/* ============================================================
   🌌 Canvas 2D 反重力粒子系統 (particles.js)
   ============================================================
   
   核心演算法：
   1. 粒子類別 (Particle) — 封裝位置、速度、大小、顏色等屬性
   2. 反重力漂浮 — 每幀粒子以基礎速度向上漂移 + 正弦橫向擺動
   3. 滾動視差增量 — 監聽 scroll 事件，計算 scrollDelta，
      驅動粒子向上加速（滾動越快 → 粒子飛越快 → 反重力感強化）
   4. 速度衰減 — 停止滾動後，scrollDelta 指數衰減歸零，
      粒子平滑回到原始漂浮速度（物理阻尼感）
   5. 瀏覽器 Resize — 重新設定 canvas 尺寸，重新分佈粒子
   6. 效能保護 — requestAnimationFrame + visibilitychange 暫停
   
   色彩規範：
   - Tiffany 綠 rgba(10, 186, 181, α)
   - 珊瑚色   rgba(255, 107, 107, α)
   - 混合比例約 7:3（以綠為主基調）
   
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     § 可調參數 (Tunable Parameters)
     ───────────────────────────────────────────── */
  const CONFIG = {
    // 粒子數量（100~200 之間，取中值偏上）
    PARTICLE_COUNT: 150,

    // 粒子大小範圍 (px)
    SIZE_MIN: 1.5,
    SIZE_MAX: 5,

    // 基礎向上漂浮速度 (px/frame)
    // 負值 = 向上；越大的粒子移動越慢（物理直覺：質量重）
    BASE_SPEED_MIN: -0.15,
    BASE_SPEED_MAX: -0.6,

    // 水平擺動幅度 (px)
    WOBBLE_AMPLITUDE: 0.4,
    // 擺動頻率 (rad/frame)
    WOBBLE_FREQ_MIN: 0.008,
    WOBBLE_FREQ_MAX: 0.025,

    // 滾動視差係數 (scroll delta 乘數)
    // 值越大 → 滾動時粒子向上衝越快
    SCROLL_PARALLAX_FACTOR: 0.15,

    // 滾動增量衰減係數 (每幀乘以此值)
    // 0.92 → 停止滾動後約 25 幀(~0.4s) 回到靜態
    SCROLL_DECAY: 0.92,

    // 粒子透明度範圍
    OPACITY_MIN: 0.08,
    OPACITY_MAX: 0.45,

    // Tiffany 綠粒子佔比 (0~1)
    TIFFANY_RATIO: 0.7,

    // Tiffany 綠色值
    COLOR_TIFFANY: { r: 10, g: 186, b: 181 },
    // 珊瑚色值
    COLOR_CORAL: { r: 255, g: 107, b: 107 },
  };


  /* ─────────────────────────────────────────────
     § 粒子類別 (Particle Class)
     ─────────────────────────────────────────────
     每個粒子是一個獨立的物理實體，擁有：
     - 位置 (x, y)
     - 基礎向上速度 (baseSpeedY)
     - 當前速度 (speedY) — 受 scroll 影響後的即時速度
     - 水平微速度 (speedX)
     - 擺動相位 (wobblePhase) — 正弦橫向飄移
     - 大小 (size)
     - 透明度 (opacity)
     - 顏色 (color)
     ───────────────────────────────────────────── */
  class Particle {
    /**
     * @param {number} canvasW - Canvas 寬度
     * @param {number} canvasH - Canvas 高度
     */
    constructor(canvasW, canvasH) {
      this.reset(canvasW, canvasH, true);
    }

    /**
     * 重置粒子狀態（初始化或回收時呼叫）
     * @param {number} canvasW
     * @param {number} canvasH
     * @param {boolean} randomY - true: 隨機分佈全畫面；false: 從底部重生
     */
    reset(canvasW, canvasH, randomY = false) {
      this.x = Math.random() * canvasW;
      this.y = randomY
        ? Math.random() * canvasH
        : canvasH + Math.random() * 40; // 從底部外側重生

      // 大小：1.5 ~ 5 px
      this.size = CONFIG.SIZE_MIN + Math.random() * (CONFIG.SIZE_MAX - CONFIG.SIZE_MIN);

      // 基礎向上速度（負值 = 向上）
      // 大粒子速度較慢，小粒子速度較快（模擬質量差異）
      const sizeRatio = (this.size - CONFIG.SIZE_MIN) / (CONFIG.SIZE_MAX - CONFIG.SIZE_MIN);
      this.baseSpeedY = CONFIG.BASE_SPEED_MAX + sizeRatio * (CONFIG.BASE_SPEED_MIN - CONFIG.BASE_SPEED_MAX);
      this.speedY = this.baseSpeedY;

      // 微小水平漂移
      this.speedX = (Math.random() - 0.5) * 0.15;

      // 正弦擺動
      this.wobblePhase = Math.random() * Math.PI * 2;
      this.wobbleFreq = CONFIG.WOBBLE_FREQ_MIN +
        Math.random() * (CONFIG.WOBBLE_FREQ_MAX - CONFIG.WOBBLE_FREQ_MIN);

      // 透明度
      this.opacity = CONFIG.OPACITY_MIN +
        Math.random() * (CONFIG.OPACITY_MAX - CONFIG.OPACITY_MIN);

      // 顏色（7:3 Tiffany:Coral）
      const isTiffany = Math.random() < CONFIG.TIFFANY_RATIO;
      this.color = isTiffany ? CONFIG.COLOR_TIFFANY : CONFIG.COLOR_CORAL;
    }

    /**
     * 更新粒子位置（每幀呼叫）
     * @param {number} canvasW
     * @param {number} canvasH
     * @param {number} scrollDelta - 當前滾動增量（正值 = 使用者向下滾動）
     */
    update(canvasW, canvasH, scrollDelta) {
      /*
         滾動視差：
         scrollDelta > 0 (向下滾動) → 粒子額外向上加速
         乘以 size → 大粒子被「推」得更快（前景感）
         小粒子移動少（背景感）→ 製造深度視差
      */
      const parallaxBoost = scrollDelta * this.size * CONFIG.SCROLL_PARALLAX_FACTOR;

      // Y 軸更新：基礎速度 + 視差加速
      this.y += this.speedY - parallaxBoost;

      // X 軸更新：微漂移 + 正弦擺動
      this.wobblePhase += this.wobbleFreq;
      this.x += this.speedX + Math.sin(this.wobblePhase) * CONFIG.WOBBLE_AMPLITUDE;

      // ── 邊界回收 ──
      // 超出頂部 → 從底部重生
      if (this.y < -this.size * 2) {
        this.reset(canvasW, canvasH, false);
      }
      // 超出底部（罕見，但可能因反向滾動）
      if (this.y > canvasH + this.size * 2) {
        this.y = -this.size * 2;
        this.x = Math.random() * canvasW;
      }
      // 水平循環
      if (this.x < -this.size * 2) {
        this.x = canvasW + this.size;
      } else if (this.x > canvasW + this.size * 2) {
        this.x = -this.size;
      }
    }

    /**
     * 繪製粒子到 Canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      const { r, g, b } = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
      ctx.fill();
    }
  }


  /* ─────────────────────────────────────────────
     § 粒子系統管理器 (ParticleSystem)
     ─────────────────────────────────────────────
     負責：
     - 初始化 canvas
     - 管理粒子陣列
     - 驅動動畫迴圈
     - 處理 scroll / resize / visibility 事件
     ───────────────────────────────────────────── */
  class ParticleSystem {
    constructor() {
      this.canvas = document.getElementById('particle-canvas');
      if (!this.canvas) {
        console.warn('[ParticleSystem] #particle-canvas not found');
        return;
      }

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.scrollDelta = 0;         // 當前幀的滾動增量
      this.lastScrollY = 0;         // 上一次 scroll 位置
      this.isRunning = true;        // 動畫是否運行
      this.animationId = null;      // rAF ID

      // 偵測 prefers-reduced-motion
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this._init();
    }

    _init() {
      // 設定 Canvas 尺寸（DPI 感知）
      this._resize();

      // 建立粒子
      this._createParticles();

      // 綁定事件
      this._bindEvents();

      // 啟動動畫（除非使用者偏好減少動態）
      if (!this.reducedMotion) {
        this._animate();
      }
    }

    /**
     * 設定 Canvas 尺寸
     * 使用 devicePixelRatio 確保 Retina 螢幕清晰
     */
    _resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';

      this.ctx.scale(dpr, dpr);

      this.width = w;
      this.height = h;
    }

    /**
     * 建立粒子陣列
     */
    _createParticles() {
      this.particles = [];
      for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        this.particles.push(new Particle(this.width, this.height));
      }
    }

    /**
     * 綁定所有事件監聽器
     */
    _bindEvents() {
      // ── Scroll 事件（節流處理） ──
      let scrollTicking = false;
      window.addEventListener('scroll', () => {
        if (!scrollTicking) {
          scrollTicking = true;
          requestAnimationFrame(() => {
            const currentScrollY = window.pageYOffset || window.scrollY;
            /*
               滾動增量計算：
               delta = 當前位置 - 上次位置
               正值 → 向下滾動 → 粒子應向上加速（反重力回饋）
            */
            this.scrollDelta = (currentScrollY - this.lastScrollY);
            this.lastScrollY = currentScrollY;
            scrollTicking = false;
          });
        }
      }, { passive: true });

      // ── Resize 事件（防抖處理） ──
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this._resize();
          // Resize 時重新分佈粒子，避免聚集在舊邊界
          this.particles.forEach(p => {
            // 等比例映射到新畫布
            p.x = (p.x / this.width) * this.width;
            if (p.y > this.height) p.y = Math.random() * this.height;
          });
        }, 200);
      });

      // ── 頁面可見性 ──
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.isRunning = false;
          if (this.animationId) {
            cancelAnimationFrame(this.animationId);
          }
        } else {
          this.isRunning = true;
          this.lastScrollY = window.pageYOffset || window.scrollY;
          this._animate();
        }
      });

      // ── Reduced motion 媒體查詢監聽 ──
      window.matchMedia('(prefers-reduced-motion: reduce)')
        .addEventListener('change', (e) => {
          this.reducedMotion = e.matches;
          if (this.reducedMotion) {
            this.isRunning = false;
            if (this.animationId) cancelAnimationFrame(this.animationId);
            this.ctx.clearRect(0, 0, this.width, this.height);
          } else {
            this.isRunning = true;
            this._animate();
          }
        });
    }

    /**
     * 主動畫迴圈（requestAnimationFrame 驅動）
     */
    _animate() {
      if (!this.isRunning) return;

      const ctx = this.ctx;

      // 清除畫布
      ctx.clearRect(0, 0, this.width, this.height);

      // 更新並繪製所有粒子
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update(this.width, this.height, this.scrollDelta);
        this.particles[i].draw(ctx);
      }

      /*
         滾動增量衰減：
         每幀乘以 SCROLL_DECAY (0.92)
         效果：停止滾動後，粒子在約 25 幀（~0.4 秒）內
         平滑回歸到原始漂浮速度。
         
         衰減公式：scrollDelta(t) = scrollDelta(0) × DECAY^t
         當 DECAY=0.92 時：
         - 10 幀後：殘留 43% → 粒子仍有明顯額外速度
         - 20 幀後：殘留 19% → 速度幾乎歸零
         - 30 幀後：殘留  8% → 優雅收尾
      */
      this.scrollDelta *= CONFIG.SCROLL_DECAY;

      // 極小值歸零（避免浮點累積）
      if (Math.abs(this.scrollDelta) < 0.01) {
        this.scrollDelta = 0;
      }

      this.animationId = requestAnimationFrame(() => this._animate());
    }
  }

  /* ─────────────────────────────────────────────
     § 匯出到全域
     ───────────────────────────────────────────── */
  window.ParticleSystem = ParticleSystem;

})();
