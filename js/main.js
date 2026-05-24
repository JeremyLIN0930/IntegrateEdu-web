/* ============================================================
   🚀 主程式進入點 (main.js)
   ============================================================
   
   負責：
   1. 初始化所有模組（Particles, Cards, Filter）
   2. 導航列滾動偵測（毛玻璃背景切換）
   3. 行動裝置選單切換
   4. 平滑滾動錨點連結
   
   載入順序：
   particles.js → cards.js → filter.js → main.js
   
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     § DOMContentLoaded — 入口
     ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {

    // ── 1. 初始化粒子系統 ──
    if (typeof window.ParticleSystem !== 'undefined') {
      new ParticleSystem();
    }

    // ── 2. 動態渲染卡片（Data-Driven） ──
    // 必須在 CardTiltManager 和 SmartFilter 之前執行，
    // 因為它們需要卡片 DOM 已經存在。
    if (typeof window.renderCards === 'function') {
      renderCards();
    }

    // ── 3. 初始化卡片 3D Tilt 互動 ──
    if (typeof window.CardTiltManager !== 'undefined') {
      new CardTiltManager();
    }

    // ── 4. 初始化智慧篩選器 ──
    if (typeof window.SmartFilter !== 'undefined') {
      new SmartFilter();
    }

    // ── 4. 導航列滾動偵測 ──
    initNavScroll();

    // ── 5. 行動裝置選單 ──
    initMobileMenu();

    // ── 6. 平滑滾動 ──
    initSmoothScroll();

    // ── 7. 頁尾年份 ──
    updateCopyrightYear();
  });


  /* ─────────────────────────────────────────────
     § 導航列滾動偵測
     ─────────────────────────────────────────────
     滾動超過 50px 時，加上 .scrolled 類別
     觸發毛玻璃背景效果
     ───────────────────────────────────────────── */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let navTicking = false;

    function updateNav() {
      const scrolled = window.scrollY > 50;
      nav.classList.toggle('scrolled', scrolled);
    }

    // 初始檢查
    updateNav();

    window.addEventListener('scroll', () => {
      if (!navTicking) {
        navTicking = true;
        requestAnimationFrame(() => {
          updateNav();
          navTicking = false;
        });
      }
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
     § 行動裝置選單
     ───────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('active');

      // 無障礙：更新 aria 狀態
      const isOpen = navLinks.classList.contains('active');
      toggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // 點擊導航連結後自動關閉選單
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // 點擊外部關閉
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ─────────────────────────────────────────────
     § 平滑滾動（錨點連結）
     ───────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const navHeight = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-height')
        ) || 72;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }


  /* ─────────────────────────────────────────────
     § 頁尾年份自動更新
     ───────────────────────────────────────────── */
  function updateCopyrightYear() {
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

})();
