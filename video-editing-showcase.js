/**
 * Video Editing Interactive 3D Showcase & Cinematic Video Gallery
 * Inspired by Reference Video (One SEO-optimized video can outperform 50 uploads)
 *
 * Workflow:
 * - When user clicks Video Editing card or green arrow button:
 *   Phase 1: 3D Motion Video Wall opens FIRST (#veModal[data-view-mode="3d"])
 *   Continuous 3D perspective columns stream and loop video editing works!
 * - When user clicks any video or the floating hint banner:
 *   Phase 2: Transitions over to the Grid View (#veModal[data-view-mode="grid"])
 *   where ALL 4 videos are organized: 2 Horizontal (16:9) and 2 Vertical (9:16)!
 * - When user clicks any video in either view:
 *   Phase 3: Opens Fullscreen Cinematic Video Lightbox Player with sound & controls!
 */

(function () {
  'use strict';

  // Complete Video Editing Works Catalog (2 Horizontal, 2 Vertical)
  const ALL_VIDEO_WORKS = [
    // ------------------------------------------------------------------------
    // Horizontal Videos (16:9 Widescreen)
    // ------------------------------------------------------------------------
    {
      id: 've-h1',
      file: 'RK horror video 2.0.mp4',
      title: 'RK Horror Cinema - Narrative Film Sequence 2.0',
      subtitle: 'Cinematic Narrative & Horror Grade',
      desc: 'Atmospheric cinematic pacing, tension-building rhythm, color grading, and multi-track immersive sound design.',
      category: 'Cinematic Narrative',
      format: '16:9 4K Cinema Widescreen',
      tools: ['Premiere Pro', 'DaVinci Resolve', 'Sound Design'],
      isVertical: false,
      aspect: 'horiz'
    },
    {
      id: 've-h2',
      file: 'Sequence 05.mp4',
      title: 'Commercial Sequence 05 - Dynamic Multi-Cut Montage',
      subtitle: 'Commercial Montage & Pacing',
      desc: 'High-speed commercial montage with seamless match cuts, whip pans, dynamic speed ramping, and beat sync.',
      category: 'Commercial Montage',
      format: '16:9 HD Commercial',
      tools: ['Premiere Pro', 'After Effects'],
      isVertical: false,
      aspect: 'horiz'
    },

    // ------------------------------------------------------------------------
    // Vertical Videos (9:16 Social Reels)
    // ------------------------------------------------------------------------
    {
      id: 've-v1',
      file: 'Coca-cola & Thums Up.mp4',
      title: 'Coca-Cola & Thums Up - High-Energy Commercial Reel',
      subtitle: 'Commercial Product & Viral Social Cut',
      desc: 'Rapid-fire beverage commercial reel with speed ramps, kinetic punch-ins, sound design, and product highlights.',
      category: 'Social Media Reel',
      format: '9:16 Vertical Reel',
      tools: ['Premiere Pro', 'Speed Ramping', 'Sound FX'],
      isVertical: true,
      aspect: 'vert'
    },
    {
      id: 've-v2',
      file: 'Reel - 01.mp4',
      title: 'Viral Master Reel 01 - 4K Kinetic Action Edit',
      subtitle: 'Short-Form Viral & Kinetic Cut',
      desc: 'Ultra-crisp 4K social reel engineered for maximum retention, snappy jump cuts, dynamic zoom transitions, and audio sync.',
      category: 'Viral Action Reel',
      format: '9:16 4K Ultra HD Reel',
      tools: ['Premiere Pro', 'After Effects', 'Beat Sync'],
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
    modal = document.getElementById('veModal');
    if (!modal) return;

    plane3D = document.getElementById('ve3DPlane');
    horizontalGrid = document.getElementById('veHorizontalGrid');
    verticalGrid = document.getElementById('veVerticalGrid');
    secHorizontal = document.getElementById('veSectionHorizontal');
    secVertical = document.getElementById('veSectionVertical');
    closeBtn = document.getElementById('veCloseBtn');
    floatingHint = document.getElementById('veFloatingHint');
    lightbox = document.getElementById('veVideoLightbox');
    lightboxContainer = document.getElementById('veLightboxContainer');
    lightboxVideo = document.getElementById('veLightboxVideo');
    lightboxClose = document.getElementById('veLightboxClose');
    lightboxTitle = document.getElementById('veLightboxTitle');
    lightboxSubtitle = document.getElementById('veLightboxSubtitle');
    lightboxPrev = document.getElementById('veLightboxPrev');
    lightboxNext = document.getElementById('veLightboxNext');
    btn3D = document.getElementById('veBtn3D');
    btnGrid = document.getElementById('veBtnGrid');
    filterBtns = Array.from(document.querySelectorAll('.ve-filter-btn'));

    build3DScene();
    buildGridScene();
    bindEvents();
    checkInitialHash();
  }

  // Create SVG Rotating Stamp Badge
  function createRotatingBadge(label) {
    return `
      <div class="ve-rotating-badge">
        <svg class="ve-badge-svg" viewBox="0 0 100 100" width="60" height="60">
          <defs>
            <path id="veBadgePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
          </defs>
          <text>
            <textPath href="#veBadgePath" startOffset="0%">${label}</textPath>
          </text>
        </svg>
        <div class="ve-badge-center-icon">
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
    ALL_VIDEO_WORKS.forEach((item, index) => {
      colArrays[index % numCols].push({ ...item, globalIndex: index });
    });
    // Add extra items to fill 5th column
    colArrays[4].push({ ...ALL_VIDEO_WORKS[0], globalIndex: 0 });

    colArrays.forEach((items, colIdx) => {
      const colEl = document.createElement('div');
      colEl.className = `ve-3d-col ve-col-${colIdx + 1}`;

      const trackEl = document.createElement('div');
      trackEl.className = 've-3d-track';

      // Duplicate list for seamless infinite loop
      const fullList = [...items, ...items, ...items];

      fullList.forEach((item) => {
        const card = document.createElement('div');
        card.className = `ve-3d-card aspect-${item.aspect}`;
        card.dataset.index = item.globalIndex;

        card.innerHTML = `
          ${createRotatingBadge(item.isVertical ? '✦ VIRAL REEL ✦ 9:16 ✦' : '✦ CINEMATIC ✦ 16:9 ✦')}
          <video src="video-editing-works/${encodeURIComponent(item.file)}" muted loop playsinline autoplay preload="metadata"></video>
          <div class="ve-play-overlay">
            <div class="ve-play-button-wrap">
              <div class="ve-play-pulse-ring"></div>
              <div class="ve-play-pulse-ring ve-pulse-2"></div>
              <div class="ve-play-btn" aria-label="Play Video">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div class="ve-soundwaves">
                <span class="ve-wave-bar"></span>
                <span class="ve-wave-bar"></span>
                <span class="ve-wave-bar"></span>
                <span class="ve-wave-bar"></span>
                <span class="ve-wave-bar"></span>
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
  // Phase 2: Build Complete Video Editing Grid View
  // --------------------------------------------------------------------------
  function buildGridScene() {
    // 1. Horizontal Videos (16:9)
    if (horizontalGrid) {
      horizontalGrid.innerHTML = '';
      const horizItems = ALL_VIDEO_WORKS.filter((w) => !w.isVertical);
      horizItems.forEach((item) => {
        const globalIdx = ALL_VIDEO_WORKS.findIndex((w) => w.id === item.id);
        horizontalGrid.appendChild(createGridVideoCard(item, globalIdx));
      });
    }

    // 2. Vertical Videos (9:16)
    if (verticalGrid) {
      verticalGrid.innerHTML = '';
      const vertItems = ALL_VIDEO_WORKS.filter((w) => w.isVertical);
      vertItems.forEach((item) => {
        const globalIdx = ALL_VIDEO_WORKS.findIndex((w) => w.id === item.id);
        verticalGrid.appendChild(createGridVideoCard(item, globalIdx));
      });
    }
  }

  // Pure Visual Media Card (No text underneath video, per user instruction)
  function createGridVideoCard(item, globalIdx) {
    const card = document.createElement('div');
    card.className = `ve-video-card ${item.isVertical ? 've-vertical-card' : 've-horizontal-card'}`;
    card.id = `veGridItem-${item.id}`;

    card.innerHTML = `
      ${createRotatingBadge(item.isVertical ? '✦ VIRAL REEL ✦ 9:16 ✦' : '✦ CINEMATIC ✦ 16:9 ✦')}
      <div class="ve-card-media">
        <video src="video-editing-works/${encodeURIComponent(item.file)}" muted loop playsinline preload="metadata"></video>
        <div class="ve-play-overlay">
          <div class="ve-play-button-wrap">
            <div class="ve-play-pulse-ring"></div>
            <div class="ve-play-pulse-ring ve-pulse-2"></div>
            <div class="ve-play-btn" aria-label="Play Video">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div class="ve-soundwaves">
              <span class="ve-wave-bar"></span>
              <span class="ve-wave-bar"></span>
              <span class="ve-wave-bar"></span>
              <span class="ve-wave-bar"></span>
              <span class="ve-wave-bar"></span>
            </div>
          </div>
        </div>
        <div class="ve-card-zoom-overlay">
          <span class="ve-grid-zoom-pill">
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
    // 1. Direct Click Binding for Video Editing card & green arrow button
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cardVideoEditing, #btnVideoEditingArrow, .trigger-video-editing');
      if (trigger) {
        e.preventDefault();
        window.location.hash = '#video-editing';
        openShowcase();
      }
    });

    const cardTrigger = document.getElementById('cardVideoEditing');
    if (cardTrigger) {
      cardTrigger.style.cursor = 'pointer';
      cardTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#video-editing';
        openShowcase();
      });
    }

    const arrowTrigger = document.getElementById('btnVideoEditingArrow');
    if (arrowTrigger) {
      arrowTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#video-editing';
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
      if (window.location.hash === '#video-editing') {
        openShowcase();
      } else if (modal && modal.classList.contains('active') && !window.location.hash.startsWith('#video-editing')) {
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
      const item = ALL_VIDEO_WORKS[index];
      if (item) {
        const el = document.getElementById(`veGridItem-${item.id}`);
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

    if (window.location.hash === '#video-editing') {
      history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }

  // --------------------------------------------------------------------------
  // Phase 3: Fullscreen Cinematic Video Lightbox Player
  // --------------------------------------------------------------------------
  function openLightbox(index) {
    if (!lightbox || !lightboxVideo) return;
    currentLightboxIndex = (index + ALL_VIDEO_WORKS.length) % ALL_VIDEO_WORKS.length;
    const item = ALL_VIDEO_WORKS[currentLightboxIndex];

    lightboxVideo.src = `video-editing-works/${encodeURIComponent(item.file)}`;
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
    if (window.location.hash === '#video-editing') {
      setTimeout(openShowcase, 100);
    }
  }

  // --------------------------------------------------------------------------
  // Homepage Card Video Preview (Cycles through video clips every 4 seconds)
  // --------------------------------------------------------------------------
  function initCardVideoCycler() {
    const cardVideo = document.getElementById('veCardVideo');
    if (!cardVideo) return;

    const featuredVideos = [
      'video-editing-works/RK%20horror%20video%202.0.mp4',
      'video-editing-works/Coca-cola%20%26%20Thums%20Up.mp4',
      'video-editing-works/Sequence%2005.mp4',
      'video-editing-works/Reel%20-%2001.mp4'
    ];

    let currentIdx = 0;
    setInterval(() => {
      currentIdx = (currentIdx + 1) % featuredVideos.length;
      cardVideo.src = featuredVideos[currentIdx];
      cardVideo.play().catch(() => {});
    }, 4000);
  }

  // Public APIs
  window._realOpenVideoEditingShowcase = openShowcase;
  window.openVideoEditingShowcase = openShowcase;
  window.closeVideoEditingShowcase = closeShowcase;

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
