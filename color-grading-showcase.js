/**
 * Color Grading Interactive 3D Showcase & Cinematic Video Gallery
 * Inspired by Reference Video (One SEO-optimized video can outperform 50 uploads)
 *
 * Workflow:
 * - When user clicks Color Grading card or green arrow button:
 *   Phase 1: 3D Motion Video Wall opens FIRST (#cgModal[data-view-mode="3d"])
 *   Continuous 3D perspective columns stream and loop color grading works!
 * - When user clicks any video or the floating hint banner:
 *   Phase 2: Transitions over to the Grid View (#cgModal[data-view-mode="grid"])
 *   where ALL 7 master color grades are organized: 6 Cinematic (16:9) and 1 Vertical (9:16)!
 * - When user clicks any video in either view:
 *   Phase 3: Opens Fullscreen Cinematic Video Lightbox Player with sound & controls!
 */

(function () {
  'use strict';

  // Complete Color Grading Works Catalog (6 Horizontal, 1 Vertical)
  const ALL_COLOR_WORKS = [
    // ------------------------------------------------------------------------
    // Horizontal Videos (16:9 Widescreen Cinema)
    // ------------------------------------------------------------------------
    {
      id: 'cg-h1',
      file: 'Timeline 1.mp4',
      title: 'Cinematic Film Emulation - Master Timeline 01',
      subtitle: 'Film Look & Dynamic Range',
      desc: 'Authentic 35mm film stock emulation, balanced skin highlights, deep shadow roll-off, and subtle organic halation.',
      category: 'Film Emulation',
      format: '16:9 Cinema Full HD',
      tools: ['DaVinci Resolve', 'Kodak 2383 LUT', 'Film Grain'],
      isVertical: false,
      aspect: 'horiz'
    },
    {
      id: 'cg-h2',
      file: 'Timeline 2.mp4',
      title: 'Moody Teal & Orange Contrast - Master Timeline 02',
      subtitle: 'Teal & Orange Grade',
      desc: 'Hollywood complementary color separation, rich cyan skies, and warm skin tone isolation using secondary qualifiers.',
      category: 'Teal & Orange',
      format: '16:9 Cinema Full HD',
      tools: ['DaVinci Resolve', 'Curves & Vectorscope'],
      isVertical: false,
      aspect: 'horiz'
    },
    {
      id: 'cg-h3',
      file: 'Timeline 3.mp4',
      title: 'Atmospheric Shadow & Low-Key Tone - Master Timeline 03',
      subtitle: 'Low-Key Dramatic Grade',
      desc: 'Controlled low-light exposure with rich velvety blacks, subtle desaturation, and high-tension shadow details.',
      category: 'Dramatic Low-Key',
      format: '16:9 Cinema Full HD',
      tools: ['DaVinci Resolve', 'Lift/Gamma/Gain'],
      isVertical: false,
      aspect: 'horiz'
    },
    {
      id: 'cg-h4',
      file: 'Timeline 4.mp4',
      title: 'Natural Golden Hour Warmth - Master Timeline 04',
      subtitle: 'Golden Hour / Warm Daylight',
      desc: 'Soft golden sunlight simulation, amber midtone glow, and gentle contrast curve preserving natural foliage greens.',
      category: 'Golden Hour Warmth',
      format: '16:9 Cinema Full HD',
      tools: ['DaVinci Resolve', 'Warm Balancing'],
      isVertical: false,
      aspect: 'horiz'
    },
    {
      id: 'cg-h5',
      file: 'Timeline 5.mp4',
      title: 'Cyberpunk Neon & Rich Saturation - Master Timeline 05',
      subtitle: 'Neon Stylized Grade',
      desc: 'Vibrant electric pink, ultraviolet, and cyan split-toning with boosted chromatic contrast in night cityscapes.',
      category: 'Stylized Neon',
      format: '16:9 Cinema Full HD',
      tools: ['DaVinci Resolve', 'HSL Qualifier'],
      isVertical: false,
      aspect: 'horiz'
    },
    {
      id: 'cg-h6',
      file: 'Timeline 6.mp4',
      title: 'Commercial High-Key Clarity - Master Timeline 06',
      subtitle: 'Commercial Clean Grade',
      desc: 'Bright pristine commercial look with clean white point balance, high-fidelity brand colors, and razor-sharp clarity.',
      category: 'Commercial High-Key',
      format: '16:9 Cinema Full HD',
      tools: ['DaVinci Resolve', 'HDR Grading Palette'],
      isVertical: false,
      aspect: 'horiz'
    },

    // ------------------------------------------------------------------------
    // Vertical Video (9:16 Social Reel)
    // ------------------------------------------------------------------------
    {
      id: 'cg-v1',
      file: 'DaVinci_Resolve Test VT.mp4',
      title: 'DaVinci Resolve - Cinematic Portrait & Skin Tone Grade',
      subtitle: 'Vertical Reel / Skin Tone Mastery',
      desc: 'Advanced facial tracking, skin tone qualifier isolation, natural tone curve, and cinematic portrait lighting enhancement.',
      category: 'Portrait Color Reel',
      format: '9:16 Vertical Reel',
      tools: ['DaVinci Resolve', 'Color Wheels', 'Skin Masking'],
      isVertical: true,
      aspect: 'vert'
    }
  ];

  // DOM Elements
  let modal = null;
  let plane3D = null;
  let horizontalGrid = null;
  let verticalGrid = null;
  let secHorizontal = null;
  let secVertical = null;
  let closeBtn = null;
  let floatingHint = null;
  let lightbox = null;
  let lightboxContainer = null;
  let lightboxVideo = null;
  let lightboxClose = null;
  let lightboxTitle = null;
  let lightboxSubtitle = null;
  let lightboxPrev = null;
  let lightboxNext = null;
  let btn3D = null;
  let btnGrid = null;
  let filterBtns = [];

  let currentLightboxIndex = 0;

  function init() {
    modal = document.getElementById('cgModal');
    if (!modal) return;

    plane3D = document.getElementById('cg3DPlane');
    horizontalGrid = document.getElementById('cgHorizontalGrid');
    verticalGrid = document.getElementById('cgVerticalGrid');
    secHorizontal = document.getElementById('cgSectionHorizontal');
    secVertical = document.getElementById('cgSectionVertical');
    closeBtn = document.getElementById('cgCloseBtn');
    floatingHint = document.getElementById('cgFloatingHint');
    lightbox = document.getElementById('cgVideoLightbox');
    lightboxContainer = document.getElementById('cgLightboxContainer');
    lightboxVideo = document.getElementById('cgLightboxVideo');
    lightboxClose = document.getElementById('cgLightboxClose');
    lightboxTitle = document.getElementById('cgLightboxTitle');
    lightboxSubtitle = document.getElementById('cgLightboxSubtitle');
    lightboxPrev = document.getElementById('cgLightboxPrev');
    lightboxNext = document.getElementById('cgLightboxNext');
    btn3D = document.getElementById('cgBtn3D');
    btnGrid = document.getElementById('cgBtnGrid');
    filterBtns = Array.from(document.querySelectorAll('.cg-filter-btn'));

    build3DScene();
    buildGridScene();
    bindEvents();
    checkInitialHash();
  }

  // Create SVG Rotating Stamp Badge
  function createRotatingBadge(label) {
    return `
      <div class="cg-rotating-badge">
        <svg class="cg-badge-svg" viewBox="0 0 100 100" width="60" height="60">
          <defs>
            <path id="cgBadgePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
          </defs>
          <text>
            <textPath href="#cgBadgePath" startOffset="0%">${label}</textPath>
          </text>
        </svg>
        <div class="cg-badge-center-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Phase 1: Build 3D Motion Video Wall (Continuous Looping Columns)
  // --------------------------------------------------------------------------
  function build3DScene() {
    if (!plane3D) return;
    plane3D.innerHTML = '';

    const numCols = 5;
    const colArrays = Array.from({ length: numCols }, () => []);

    // Distribute works across 5 columns
    ALL_COLOR_WORKS.forEach((item, index) => {
      colArrays[index % numCols].push({ ...item, globalIndex: index });
    });

    colArrays.forEach((items, colIdx) => {
      const colEl = document.createElement('div');
      colEl.className = `cg-3d-col cg-col-${colIdx + 1}`;

      const trackEl = document.createElement('div');
      trackEl.className = 'cg-3d-track';

      // Duplicate list for seamless infinite loop
      const fullList = [...items, ...items, ...items];

      fullList.forEach((item) => {
        const card = document.createElement('div');
        card.className = `cg-3d-card aspect-${item.aspect}`;
        card.dataset.index = item.globalIndex;

        card.innerHTML = `
          ${createRotatingBadge(item.isVertical ? '✦ COLOR REEL ✦ 9:16 ✦' : '✦ DAVINCI ✦ 16:9 ✦')}
          <video src="color-grading-works/${encodeURIComponent(item.file)}" muted loop playsinline autoplay preload="metadata"></video>
          <div class="cg-play-overlay">
            <div class="cg-play-button-wrap">
              <div class="cg-play-pulse-ring"></div>
              <div class="cg-play-pulse-ring cg-pulse-2"></div>
              <div class="cg-play-btn" aria-label="Play Video">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div class="cg-soundwaves">
                <span class="cg-wave-bar"></span>
                <span class="cg-wave-bar"></span>
                <span class="cg-wave-bar"></span>
                <span class="cg-wave-bar"></span>
                <span class="cg-wave-bar"></span>
              </div>
            </div>
          </div>
        `;

        // Clicking any video in 3D wall transitions over into Grid View & opens player
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          switchToGridAndOpen(item.globalIndex);
        });

        trackEl.appendChild(card);
      });

      colEl.appendChild(trackEl);
      plane3D.appendChild(colEl);
    });
  }

  // --------------------------------------------------------------------------
  // Phase 2: Build Complete Color Grading Grid View
  // --------------------------------------------------------------------------
  function buildGridScene() {
    // 1. Horizontal Videos (16:9)
    if (horizontalGrid) {
      horizontalGrid.innerHTML = '';
      const horizItems = ALL_COLOR_WORKS.filter((w) => !w.isVertical);
      horizItems.forEach((item) => {
        const globalIdx = ALL_COLOR_WORKS.findIndex((w) => w.id === item.id);
        horizontalGrid.appendChild(createGridVideoCard(item, globalIdx));
      });
    }

    // 2. Vertical Video (9:16)
    if (verticalGrid) {
      verticalGrid.innerHTML = '';
      const vertItems = ALL_COLOR_WORKS.filter((w) => w.isVertical);
      vertItems.forEach((item) => {
        const globalIdx = ALL_COLOR_WORKS.findIndex((w) => w.id === item.id);
        verticalGrid.appendChild(createGridVideoCard(item, globalIdx));
      });
    }
  }

  // Pure Visual Media Card (No text underneath video, per user instruction)
  function createGridVideoCard(item, globalIdx) {
    const card = document.createElement('div');
    card.className = `cg-video-card ${item.isVertical ? 'cg-vertical-card' : 'cg-horizontal-card'}`;
    card.id = `cgGridItem-${item.id}`;

    card.innerHTML = `
      ${createRotatingBadge(item.isVertical ? '✦ COLOR REEL ✦ 9:16 ✦' : '✦ DAVINCI ✦ 16:9 ✦')}
      <div class="cg-card-media">
        <video src="color-grading-works/${encodeURIComponent(item.file)}" muted loop playsinline preload="metadata"></video>
        <div class="cg-play-overlay">
          <div class="cg-play-button-wrap">
            <div class="cg-play-pulse-ring"></div>
            <div class="cg-play-pulse-ring cg-pulse-2"></div>
            <div class="cg-play-btn" aria-label="Play Video">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div class="cg-soundwaves">
              <span class="cg-wave-bar"></span>
              <span class="cg-wave-bar"></span>
              <span class="cg-wave-bar"></span>
              <span class="cg-wave-bar"></span>
              <span class="cg-wave-bar"></span>
            </div>
          </div>
        </div>
        <div class="cg-card-zoom-overlay">
          <span class="cg-grid-zoom-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Watch Fullscreen
          </span>
        </div>
      </div>
    `;

    // Preview playback on hover
    const vid = card.querySelector('video');
    card.addEventListener('mouseenter', () => {
      if (vid) vid.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
      }
    });

    card.addEventListener('click', () => {
      openLightbox(globalIdx);
    });

    return card;
  }

  function bindEvents() {
    // 1. Direct Click Binding for Color Grading card & green arrow button
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cardColorGrading, #btnColorGradingArrow, .trigger-color-grading');
      if (trigger) {
        e.preventDefault();
        window.location.hash = '#color-grading';
        openShowcase();
      }
    });

    const cardTrigger = document.getElementById('cardColorGrading');
    if (cardTrigger) {
      cardTrigger.style.cursor = 'pointer';
      cardTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#color-grading';
        openShowcase();
      });
    }

    const arrowTrigger = document.getElementById('btnColorGradingArrow');
    if (arrowTrigger) {
      arrowTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#color-grading';
        openShowcase();
      });
    }

    // 2. Close Showcase
    if (closeBtn) {
      closeBtn.addEventListener('click', closeShowcase);
    }

    // 3. Floating Interactive Hint: Click to open Grid View
    if (floatingHint) {
      floatingHint.addEventListener('click', () => {
        setMode('grid');
      });
    }

    // 4. Mode Switcher (3D Motion Wall vs Grid View)
    if (btn3D) {
      btn3D.addEventListener('click', () => setMode('3d'));
    }
    if (btnGrid) {
      btnGrid.addEventListener('click', () => setMode('grid'));
    }

    // 5. Section Filter Buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        if (filter === 'all') {
          if (secHorizontal) secHorizontal.style.display = '';
          if (secVertical) secVertical.style.display = '';
        } else if (filter === 'horiz') {
          if (secHorizontal) secHorizontal.style.display = '';
          if (secVertical) secVertical.style.display = 'none';
        } else if (filter === 'vert') {
          if (secHorizontal) secHorizontal.style.display = 'none';
          if (secVertical) secVertical.style.display = '';
        }
      });
    });

    // 6. Lightbox Controls
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
      });
    }

    // 7. Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === ' ' && lightboxVideo) {
          e.preventDefault();
          if (lightboxVideo.paused) lightboxVideo.play();
          else lightboxVideo.pause();
        }
      } else if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') closeShowcase();
      }
    });

    // 8. Hash Change Listener
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#color-grading') {
        openShowcase();
      } else if (modal && modal.classList.contains('active') && !window.location.hash.startsWith('#color-grading')) {
        closeShowcase();
      }
    });
  }

  function setMode(mode) {
    if (!modal) return;
    modal.dataset.viewMode = mode;

    if (btn3D) btn3D.classList.toggle('active', mode === '3d');
    if (btnGrid) btnGrid.classList.toggle('active', mode === 'grid');
  }

  function switchToGridAndOpen(index) {
    setMode('grid');
    setTimeout(() => {
      const item = ALL_COLOR_WORKS[index];
      if (item) {
        const el = document.getElementById(`cgGridItem-${item.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      openLightbox(index);
    }, 150);
  }

  function openShowcase() {
    if (!modal) return;
    setMode('3d'); // Always open 3D Motion Video Wall FIRST!
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeShowcase() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    closeLightbox();

    if (window.location.hash === '#color-grading') {
      history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }

  // --------------------------------------------------------------------------
  // Phase 3: Fullscreen Cinematic Video Lightbox Player
  // --------------------------------------------------------------------------
  function openLightbox(index) {
    if (!lightbox || !lightboxVideo) return;
    currentLightboxIndex = (index + ALL_COLOR_WORKS.length) % ALL_COLOR_WORKS.length;
    const item = ALL_COLOR_WORKS[currentLightboxIndex];

    lightboxVideo.src = `color-grading-works/${encodeURIComponent(item.file)}`;
    lightboxVideo.load();
    lightboxVideo.play().catch(() => {});

    if (lightboxContainer) {
      lightboxContainer.classList.toggle('is-vertical', !!item.isVertical);
    }

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxSubtitle) {
      lightboxSubtitle.textContent = `${item.format} - ${item.category}`;
    }

    lightbox.classList.add('active');
  }

  function closeLightbox() {
    if (!lightbox || !lightboxVideo) return;
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    lightboxVideo.src = '';
  }

  function navigateLightbox(dir) {
    openLightbox(currentLightboxIndex + dir);
  }

  function checkInitialHash() {
    if (window.location.hash === '#color-grading') {
      setTimeout(openShowcase, 100);
    }
  }

  // --------------------------------------------------------------------------
  // Homepage Card Video Preview (Cycles through color grading clips every 4 seconds)
  // --------------------------------------------------------------------------
  function initCardVideoCycler() {
    const cardVideo = document.getElementById('cgCardVideo');
    if (!cardVideo) return;

    const featuredVideos = [
      'color-grading-works/Timeline%201.mp4',
      'color-grading-works/Timeline%202.mp4',
      'color-grading-works/Timeline%204.mp4',
      'color-grading-works/DaVinci_Resolve%20Test%20VT.mp4'
    ];

    let currentIdx = 0;
    setInterval(() => {
      currentIdx = (currentIdx + 1) % featuredVideos.length;
      cardVideo.src = featuredVideos[currentIdx];
      cardVideo.play().catch(() => {});
    }, 4000);
  }

  // Public APIs
  window._realOpenColorGradingShowcase = openShowcase;
  window.openColorGradingShowcase = openShowcase;
  window.closeColorGradingShowcase = closeShowcase;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initCardVideoCycler();
    });
  } else {
    init();
    initCardVideoCycler();
  }
})();
