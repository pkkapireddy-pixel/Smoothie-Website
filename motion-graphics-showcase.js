/**
 * Motion Graphics Interactive 3D Showcase & Video Grid
 * Inspired by Reference Video (One SEO-optimized video can outperform 50 uploads)
 *
 * Workflow:
 * - When user clicks Motion Graphics card or green arrow button:
 *   Phase 1: 3D Motion Video Animation Wall opens FIRST (#mgModal[data-view-mode="3d"])
 *   Columns of motion graphics works continuously stream and loop in 3D perspective!
 * - When user clicks any video or the floating hint banner:
 *   Phase 2: Transitions over to the Grid View (#mgModal[data-view-mode="grid"])
 *   where ALL videos are visible: 2 Horizontal, 2 Vertical + 8 Practice Works!
 * - When user clicks any video in either view:
 *   Phase 3: Opens Fullscreen Cinematic Video Lightbox Player with sound & controls!
 */

(function () {
  'use strict';

  // All Motion Graphics Works Catalog
  const ALL_MOTION_WORKS = [
    // 2 Featured Horizontal Videos (16:9)
    {
      id: 'h1',
      file: 'Parallax 3D.mp4',
      title: '3D Multi-Layer Depth Parallax',
      desc: 'Multi-plane Z-axis camera drift, depth map displacement, and atmospheric particle simulation.',
      category: '3D Parallax & Environment',
      format: '16:9 Widescreen',
      tools: ['After Effects', 'Photoshop', 'Cinema 4D'],
      isVertical: false,
      featured: 'horizontal'
    },
    {
      id: 'h2',
      file: '3d.mp4',
      title: '3D Kinetic Visual & VFX Simulation',
      desc: 'High-energy 3D kinetic typography, rigid body dynamics, and fluid transition design.',
      category: 'Commercial 3D Motion',
      format: '16:9 UHD',
      tools: ['After Effects', 'Cinema 4D', 'Premiere Pro'],
      isVertical: false,
      featured: 'horizontal'
    },

    // Featured Vertical Video (9:16 Social Reel)
    {
      id: 'v1',
      file: '3D Stablilze Motion.mp4',
      title: '3D Camera Stabilization & Motion Tracking',
      desc: 'Advanced planar point tracking, real-time camera stabilizer, and anchored physical 3D text.',
      category: 'Vertical Reel / VFX Tracking',
      format: '9:16 Vertical Reel',
      tools: ['After Effects', 'Mocha Pro', 'Premiere Pro'],
      isVertical: true,
      featured: 'vertical'
    },

    // 8 Additional Practice Projects
    {
      id: 'a1',
      file: 'Map Flight.mp4',
      title: 'Interactive 3D Map Flight Route',
      desc: '3D globe vector projection and geospatial camera navigation.',
      category: '3D Cartography',
      format: '16:9 HD',
      tools: ['After Effects', 'GeoLayers'],
      isVertical: false,
      featured: 'more'
    },
    {
      id: 'a2',
      file: 'Eraser.mp4',
      title: 'Kinetic Masking & Eraser Reveal',
      desc: 'Creative stroke matte transition and dynamic shape wipe.',
      category: 'Motion VFX',
      format: '16:9 HD',
      tools: ['After Effects'],
      isVertical: false,
      featured: 'more'
    },
    {
      id: 'a3',
      file: 'Day - 6  Practice 2.0.mp4',
      title: 'Dynamic Broadcast Identity 2.0',
      desc: 'Broadcast lower thirds, dynamic kinetic badges, and color grading.',
      category: 'Broadcast Design',
      format: '16:9 4K',
      tools: ['After Effects', 'Premiere Pro'],
      isVertical: false,
      featured: 'more'
    },
    {
      id: 'a4',
      file: 'Day - 10  Practice 2D.mp4',
      title: '2D Shape Morphing & Kinetic Splash',
      desc: 'Vector liquid splash simulation and organic path morphing.',
      category: '2D Motion Design',
      format: '16:9 HD',
      tools: ['After Effects', 'Illustrator'],
      isVertical: false,
      featured: 'more'
    },
    {
      id: 'a5',
      file: 'Day - 10  Practice 3D.mp4',
      title: '3D Abstract Geometric Loop I',
      desc: 'Infinite procedural wireframe kaleidoscope in 3D perspective.',
      category: '3D Abstract',
      format: '16:9 HD',
      tools: ['Cinema 4D', 'After Effects'],
      isVertical: false,
      featured: 'more'
    },
    {
      id: 'a6',
      file: 'Day - 10  Practice 3D_1.mp4',
      title: '3D Abstract Geometric Loop II',
      desc: 'Kinetic geometry rotation with reflective metallic shaders.',
      category: '3D Abstract',
      format: '16:9 HD',
      tools: ['Cinema 4D', 'After Effects'],
      isVertical: false,
      featured: 'more'
    },
    {
      id: 'a7',
      file: 'Day - 13  Practice.mp4',
      title: 'Cinematic Title Sequence & Volumetric Lighting',
      desc: 'Atmospheric light rays, 3D text bevel extrusion, and particle haze.',
      category: 'Title Sequence',
      format: '16:9 4K',
      tools: ['After Effects', 'Optical Flares'],
      isVertical: false,
      featured: 'more'
    },
    {
      id: 'a8',
      file: 'Day - 7.2.1  Practice.mp4',
      title: 'Kinetic Soundwave & Audio Reactive Visualizer',
      desc: 'Frequency spectrum audio amplitude displacement and neon pulse.',
      category: 'Audio Reactive',
      format: '16:9 HD',
      tools: ['After Effects'],
      isVertical: false,
      featured: 'more'
    }
  ];

  // DOM Elements
  let modal = null;
  let plane3D = null;
  let horizontalGrid = null;
  let verticalGrid = null;
  let additionalGrid = null;
  let closeBtn = null;
  let floatingHint = null;
  let lightbox = null;
  let lightboxPlayerWrap = null;
  let lightboxVideo = null;
  let lightboxClose = null;
  let lightboxTitle = null;
  let lightboxTools = null;
  let btn3D = null;
  let btnGrid = null;

  function init() {
    modal = document.getElementById('mgModal');
    if (!modal) return;

    plane3D = document.getElementById('mg3DPlane');
    horizontalGrid = document.getElementById('mgHorizontalGrid');
    verticalGrid = document.getElementById('mgVerticalGrid');
    additionalGrid = document.getElementById('mgAdditionalGrid');
    closeBtn = document.getElementById('mgCloseBtn');
    floatingHint = document.getElementById('mgFloatingHint');
    lightbox = document.getElementById('mgVideoLightbox');
    lightboxPlayerWrap = document.getElementById('mgLightboxPlayerWrap');
    lightboxVideo = document.getElementById('mgLightboxVideo');
    lightboxClose = document.getElementById('mgLightboxClose');
    lightboxTitle = document.getElementById('mgLightboxTitle');
    lightboxTools = document.getElementById('mgLightboxTools');
    btn3D = document.getElementById('mgBtn3D');
    btnGrid = document.getElementById('mgBtnGrid');

    build3DScene();
    buildGridScene();
    bindEvents();
    checkInitialHash();
  }

  // Create SVG Rotating Stamp Badge
  function createRotatingBadge(label) {
    return `
      <div class="mg-rotating-badge">
        <svg class="mg-badge-svg" viewBox="0 0 100 100" width="66" height="66">
          <defs>
            <path id="mgBadgePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
          </defs>
          <text>
            <textPath href="#mgBadgePath" startOffset="0%">${label}</textPath>
          </text>
        </svg>
        <div class="mg-badge-center-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Phase 1: Build 3D Motion Video Wall
  // --------------------------------------------------------------------------
  function build3DScene() {
    if (!plane3D) return;
    plane3D.innerHTML = '';

    const numCols = 5;
    const colArrays = Array.from({ length: numCols }, () => []);

    // Distribute all 12 works across 5 columns
    ALL_MOTION_WORKS.forEach((item, index) => {
      colArrays[index % numCols].push({ ...item, origIndex: index });
    });

    colArrays.forEach((items, colIdx) => {
      const colEl = document.createElement('div');
      colEl.className = `mg-3d-col mg-col-${colIdx + 1}`;

      const trackEl = document.createElement('div');
      trackEl.className = 'mg-3d-track';

      // Duplicate list twice for seamless infinite loop
      const fullList = [...items, ...items];

      fullList.forEach((item) => {
        const card = document.createElement('div');
        card.className = `mg-3d-card ${item.isVertical ? 'aspect-vert' : 'aspect-horiz'}`;
        card.dataset.index = item.origIndex;

        card.innerHTML = `
          ${createRotatingBadge('✦ MOTION DESIGN ✦ 3D VFX ✦')}
          <video src="motion-graphics-works/${encodeURIComponent(item.file)}" muted loop playsinline autoplay preload="metadata"></video>
          <div class="mg-play-overlay">
            <div class="mg-play-button-wrap">
              <div class="mg-play-pulse-ring"></div>
              <div class="mg-play-pulse-ring mg-pulse-2"></div>
              <div class="mg-play-btn" aria-label="Play Motion Graphics Video">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div class="mg-soundwaves">
                <span class="mg-wave-bar"></span>
                <span class="mg-wave-bar"></span>
                <span class="mg-wave-bar"></span>
                <span class="mg-wave-bar"></span>
                <span class="mg-wave-bar"></span>
              </div>
            </div>
          </div>
        `;

        // Clicking any video in the 3D animation transitions over into the grid
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          switchToGridAndOpen(item);
        });

        trackEl.appendChild(card);
      });

      colEl.appendChild(trackEl);
      plane3D.appendChild(colEl);
    });
  }

  // --------------------------------------------------------------------------
  // Phase 2: Build Complete Video Grid View (2 Horizontal, 2 Vertical + More)
  // --------------------------------------------------------------------------
  function buildGridScene() {
    // 1. Featured 2 Horizontal Videos
    if (horizontalGrid) {
      horizontalGrid.innerHTML = '';
      const horizWorks = ALL_MOTION_WORKS.filter((w) => w.featured === 'horizontal');
      horizWorks.forEach((item) => {
        const card = createGridVideoCard(item);
        horizontalGrid.appendChild(card);
      });
    }

    // 2. Featured 2 Vertical Videos
    if (verticalGrid) {
      verticalGrid.innerHTML = '';
      const vertWorks = ALL_MOTION_WORKS.filter((w) => w.featured === 'vertical');
      vertWorks.forEach((item) => {
        const card = createGridVideoCard(item);
        verticalGrid.appendChild(card);
      });
    }

    // 3. Additional Practice Projects
    if (additionalGrid) {
      additionalGrid.innerHTML = '';
      const moreWorks = ALL_MOTION_WORKS.filter((w) => w.featured === 'more');
      moreWorks.forEach((item) => {
        const card = createGridVideoCard(item);
        additionalGrid.appendChild(card);
      });
    }
  }

  function createGridVideoCard(item) {
    const card = document.createElement('div');
    card.className = `mg-video-card ${item.isVertical ? 'mg-vertical-card' : 'mg-horizontal-card'}`;
    card.id = `mgGridItem-${item.id}`;

    card.innerHTML = `
      ${createRotatingBadge(item.isVertical ? '✦ VIRAL REEL ✦ KINETIC ✦' : '✦ 3D MOTION ✦ VFX ✦')}
      <div class="mg-card-media">
        <video src="motion-graphics-works/${encodeURIComponent(item.file)}" muted loop playsinline preload="metadata"></video>
        <div class="mg-play-overlay">
          <div class="mg-play-button-wrap">
            <div class="mg-play-pulse-ring"></div>
            <div class="mg-play-pulse-ring mg-pulse-2"></div>
            <div class="mg-play-btn" aria-label="Play Video">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div class="mg-soundwaves">
              <span class="mg-wave-bar"></span>
              <span class="mg-wave-bar"></span>
              <span class="mg-wave-bar"></span>
              <span class="mg-wave-bar"></span>
              <span class="mg-wave-bar"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="mg-card-info">
        <div class="mg-card-top-tags">
          <span class="mg-card-tag">${item.category}</span>
          <span class="mg-card-format-pill">${item.format}</span>
        </div>
        <h4 class="mg-card-title">${item.title}</h4>
        <p class="mg-card-desc">${item.desc}</p>
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

    // Click to open cinematic video lightbox
    card.addEventListener('click', () => {
      openVideoLightbox(item);
    });

    return card;
  }

  function bindEvents() {
    // 1. Direct Click Binding for Motion Graphics card & green arrow button
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cardMotionGraphics, #btnMotionGraphicsArrow, .trigger-motion-graphics');
      if (trigger) {
        e.preventDefault();
        window.location.hash = '#motion-graphics';
        openShowcase();
      }
    });

    const cardTrigger = document.getElementById('cardMotionGraphics');
    if (cardTrigger) {
      cardTrigger.style.cursor = 'pointer';
      cardTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#motion-graphics';
        openShowcase();
      });
    }

    const arrowTrigger = document.getElementById('btnMotionGraphicsArrow');
    if (arrowTrigger) {
      arrowTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#motion-graphics';
        openShowcase();
      });
    }

    // 2. Close Showcase
    if (closeBtn) {
      closeBtn.addEventListener('click', closeShowcase);
    }

    // 3. Floating Interactive Hint: Click to open Video Grid View
    if (floatingHint) {
      floatingHint.addEventListener('click', () => {
        setMode('grid');
      });
    }

    // 4. Mode Switcher (3D Motion Wall vs Video Grid View)
    if (btn3D) {
      btn3D.addEventListener('click', () => setMode('3d'));
    }
    if (btnGrid) {
      btnGrid.addEventListener('click', () => setMode('grid'));
    }

    // 5. Lightbox Close
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeVideoLightbox);
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeVideoLightbox();
        }
      });
    }

    // 6. Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (lightbox && lightbox.classList.contains('active')) {
          closeVideoLightbox();
        } else if (modal && modal.classList.contains('active')) {
          closeShowcase();
        }
      }
    });

    // 7. Window Hash Change Listener
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#motion-graphics') {
        openShowcase();
      } else if (modal && modal.classList.contains('active') && window.location.hash !== '#motion-graphics') {
        closeShowcase();
      }
    });
  }

  function setMode(mode) {
    if (!modal) return;
    modal.dataset.viewMode = mode;

    if (btn3D) btn3D.classList.toggle('active', mode === '3d');
    if (btnGrid) btnGrid.classList.toggle('active', mode === 'grid');

    // Pause/Resume video streams based on active view mode
    if (mode === '3d') {
      const vids3D = modal.querySelectorAll('.mg-3d-scene video');
      vids3D.forEach((v) => v.play().catch(() => {}));
    } else {
      const vids3D = modal.querySelectorAll('.mg-3d-scene video');
      vids3D.forEach((v) => v.pause());
    }
  }

  function switchToGridAndOpen(item) {
    setMode('grid');
    // Scroll to the card in grid view
    setTimeout(() => {
      const el = document.getElementById(`mgGridItem-${item.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Open full video lightbox
      openVideoLightbox(item);
    }, 150);
  }

  function openShowcase() {
    if (!modal) return;
    setMode('3d'); // Always open 3D Motion Animation FIRST!
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Start video previews in 3D wall
    const vids3D = modal.querySelectorAll('.mg-3d-scene video');
    vids3D.forEach((v) => {
      v.play().catch(() => {});
    });
  }

  function closeShowcase() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Pause all preview videos
    const allVideos = modal.querySelectorAll('video');
    allVideos.forEach((v) => {
      v.pause();
    });

    closeVideoLightbox();

    if (window.location.hash === '#motion-graphics') {
      history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }

  // Open Fullscreen Cinematic Video Lightbox Player
  function openVideoLightbox(item) {
    if (!lightbox || !lightboxVideo) return;

    lightboxVideo.src = `motion-graphics-works/${encodeURIComponent(item.file)}`;
    lightboxVideo.controls = true;
    lightboxVideo.autoplay = true;

    if (lightboxTitle) {
      lightboxTitle.textContent = item.title;
    }

    if (lightboxTools) {
      const tools = item.tools || ['After Effects', 'Premiere Pro'];
      lightboxTools.innerHTML = tools.map((t) => `<span class="mg-tool-pill">${t}</span>`).join('');
    }

    if (lightboxPlayerWrap) {
      if (item.isVertical) {
        lightboxPlayerWrap.classList.add('vertical-aspect');
      } else {
        lightboxPlayerWrap.classList.remove('vertical-aspect');
      }
    }

    lightbox.classList.add('active');
    lightboxVideo.play().catch(() => {});
  }

  function closeVideoLightbox() {
    if (!lightbox || !lightboxVideo) return;
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.src = '';
  }

  function checkInitialHash() {
    if (window.location.hash === '#motion-graphics') {
      setTimeout(openShowcase, 100);
    }
  }

  // Public API
  window._realOpenMotionGraphics = openShowcase;
  window.openMotionGraphicsShowcase = openShowcase;
  window.closeMotionGraphicsShowcase = closeShowcase;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
