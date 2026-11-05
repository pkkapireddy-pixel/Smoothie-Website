/**
 * Logo Designs Interactive 3D Showcase & Brand Identity Gallery
 * Inspired by Reference Video (One SEO-optimized video can outperform 50 uploads)
 *
 * Workflow:
 * - When user clicks Logo Designs card or green arrow button:
 *   Phase 1: 3D Motion Logo Wall opens FIRST (#ldModal[data-view-mode="3d"])
 *   Columns of logo designs continuously stream and loop in 3D perspective!
 * - When user clicks any logo or the floating hint banner:
 *   Phase 2: Transitions over to the Grid View (#ldModal[data-view-mode="grid"])
 *   where ALL logos are organized across Personal Brand, Triguna, and Video Flux!
 * - When user clicks any logo in either view:
 *   Phase 3: Opens High-Resolution Lightbox Viewer with zoom, info, and prev/next navigation!
 */

(function () {
  'use strict';

  // Complete Logo Designs Catalog (36 Works across 3 Brand Identity Projects)
  const ALL_LOGO_WORKS = [
    // ------------------------------------------------------------------------
    // Brand Project 1: Personal Brand Identity 2.0 (My Logo)
    // ------------------------------------------------------------------------
    {
      id: 'ml-p1',
      file: 'My Logo/My Logo - 2.o Presentation -01.jpg',
      title: 'Personal Brand Identity - Concept & Overview',
      desc: 'Master identity introduction exploring monogram concept, visual values, and primary mark structure.',
      category: 'Brand Identity',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Overview',
      aspect: 'wide'
    },
    {
      id: 'ml-p2',
      file: 'My Logo/My Logo - 2.o Presentation _Artboard 2.jpg',
      title: 'Golden Ratio & Geometric Grid Construction',
      desc: 'Mathematical bezier curve alignment, geometric balance, and proportional grid architecture.',
      category: 'Grid & Geometry',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Grid System',
      aspect: 'wide'
    },
    {
      id: 'ml-p3',
      file: 'My Logo/My Logo - 2.o Presentation _Artboard 3.jpg',
      title: 'Color Palette & Chromatic Contrast Hierarchy',
      desc: 'Vibrant lime-olive primary and secondary palette specifications with RGB, CMYK, and HEX codes.',
      category: 'Color Theory',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Color System',
      aspect: 'wide'
    },
    {
      id: 'ml-p4',
      file: 'My Logo/My Logo - 2.o Presentation _Artboard 4.jpg',
      title: 'Typography Anatomy & Modern Lettering System',
      desc: 'Primary brand typeface pairings, kerning metrics, and modern geometric letterform hierarchy.',
      category: 'Typography',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Typography',
      aspect: 'wide'
    },
    {
      id: 'ml-p5',
      file: 'My Logo/My Logo - 2.o Presentation _Artboard 5.jpg',
      title: 'Symbolic Meaning & Monogram Decomposition',
      desc: 'Deconstruction of core geometric shapes representing visual storytelling, motion, and precision.',
      category: 'Iconography',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Symbolism',
      aspect: 'wide'
    },
    {
      id: 'ml-p6',
      file: 'My Logo/My Logo - 2.o Presentation _Artboard 6.jpg',
      title: 'High-Contrast Monochromatic & Negative Space',
      desc: 'Black and white inverse contrast testing ensuring maximum clarity on light and dark backgrounds.',
      category: 'Contrast System',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Monochrome',
      aspect: 'wide'
    },
    {
      id: 'ml-p7',
      file: 'My Logo/My Logo - 2.o Presentation _Artboard 7.jpg',
      title: 'Brand Clear Space & Scaling Standards',
      desc: 'Minimum exclusion zones, responsive icon scaling, and digital favicon display specifications.',
      category: 'Brand Guidelines',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Clear Space',
      aspect: 'wide'
    },
    {
      id: 'ml-p8',
      file: 'My Logo/My Logo - 2.o Presentation _Artboard 8.jpg',
      title: 'Complete Corporate Stationery Suite',
      desc: 'Applied corporate identity across business cards, envelopes, digital letterheads, and brand stamps.',
      category: 'Corporate Stationery',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Stationery',
      aspect: 'wide'
    },
    {
      id: 'ml-m1',
      file: 'My Logo/Branding Identity MockUp Vol16.png',
      title: 'Luxury Stationery & Identity Mockup Suite',
      desc: 'Photorealistic stationery mockup showcasing gold foil business cards, textured paper, and folders.',
      category: 'Premium Mockup',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Mockup',
      aspect: 'wide'
    },
    {
      id: 'ml-m2',
      file: 'My Logo/Poster Artwork in a Modern Loft MockUp.png',
      title: 'Architectural Modern Loft Poster Mockup',
      desc: 'Minimalist industrial gallery interior highlighting large-format framed brand poster artwork.',
      category: 'Environmental Mockup',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Interior',
      aspect: 'wide'
    },
    {
      id: 'ml-m3',
      file: 'My Logo/Stack Business Card Mock-Up.png',
      title: 'Minimalist Stack Business Card Mockup',
      desc: 'Close-up perspective depth mockup featuring tactile edge-painted business cards.',
      category: 'Print Mockup',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Business Cards',
      aspect: 'wide'
    },
    {
      id: 'ml-m4',
      file: 'My Logo/Snapback Cap PSD MockUp.png',
      title: 'Embroidered Streetwear Snapback Cap Mockup',
      desc: 'Realistic 3D fabric embroidery apparel mockup with precision stitch detailing.',
      category: 'Apparel Merchandise',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Merchandise',
      aspect: 'wide'
    },
    {
      id: 'ml-m5',
      file: 'My Logo/Mug PSD MockUp 3.png',
      title: 'Ceramic Matte Coffee Mug Mockup A',
      desc: 'Product packaging presentation featuring matte black ceramic coffee mug with lime emblem.',
      category: 'Product Mockup',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Product',
      aspect: 'wide'
    },
    {
      id: 'ml-m6',
      file: 'My Logo/Mug PSD MockUp 3.1.png',
      title: 'Ceramic Gloss Coffee Mug Mockup B',
      desc: 'Alternative angled product mockup displaying glossy ceramic surface reflections.',
      category: 'Product Mockup',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Product',
      aspect: 'square'
    },
    {
      id: 'ml-v1',
      file: 'My Logo/My Logo 2.0.1.png',
      title: 'Master Vector Emblem (Primary Color Lockup)',
      desc: 'High-resolution vector master mark rendered in dynamic lime green gradient.',
      category: 'Core Vector Mark',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Master Emblem',
      aspect: 'square'
    },
    {
      id: 'ml-v2',
      file: 'My Logo/My Logo BW 2.0.jpg',
      title: 'Monochrome Black & White Master Mark',
      desc: 'Pure high-contrast monochrome version engineered for single-color print and engraving.',
      category: 'Core Vector Mark',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Monochrome',
      aspect: 'square'
    },
    {
      id: 'ml-v3',
      file: 'My Logo/my Logo Watermark 2.png',
      title: 'Digital Watermark & Signature Stamp',
      desc: 'Transparent PNG watermark stamp for video overlays and photo credits.',
      category: 'Digital Watermark',
      project: 'my-logo',
      projectName: 'Personal Brand',
      tag: 'Watermark',
      aspect: 'square'
    },

    // ------------------------------------------------------------------------
    // Brand Project 2: Triguna Logo Design
    // ------------------------------------------------------------------------
    {
      id: 'tg-1',
      file: 'Triguna logo/Triguna logo -1.png',
      title: 'Triguna Corporate Emblem & Wordmark (Primary)',
      desc: 'Complete horizontal lockup featuring geometric triad emblem and clean modern typography.',
      category: 'Corporate Identity',
      project: 'triguna',
      projectName: 'Triguna Logo',
      tag: 'Primary Lockup',
      aspect: 'wide'
    },
    {
      id: 'tg-2',
      file: 'Triguna logo/Triguna logo -2.png',
      title: 'Triguna Emblem on Dark Slate Canvas',
      desc: 'Dark-mode high-contrast presentation emphasizing gold-accented geometry.',
      category: 'Dark Mode Identity',
      project: 'triguna',
      projectName: 'Triguna Logo',
      tag: 'Dark Mode',
      aspect: 'wide'
    },
    {
      id: 'tg-3',
      file: 'Triguna logo/Triguna logo -3.png',
      title: 'Triguna Minimalist Vector Icon Geometry',
      desc: 'Standalone geometric symbol showcasing interlocking triangular visual harmony.',
      category: 'Vector Symbol',
      project: 'triguna',
      projectName: 'Triguna Logo',
      tag: 'Icon Geometry',
      aspect: 'wide'
    },
    {
      id: 'tg-4',
      file: 'Triguna logo/Triguna logo -4.png',
      title: 'Triguna Horizontal Logo & Typography Lockup',
      desc: 'Balanced corporate layout engineered for web headers and business stationery.',
      category: 'Corporate Lockup',
      project: 'triguna',
      projectName: 'Triguna Logo',
      tag: 'Horizontal',
      aspect: 'wide'
    },
    {
      id: 'tg-5',
      file: 'Triguna logo/Triguna logo -5.png',
      title: 'Triguna Premium Obsidian Inverted Presentation',
      desc: 'Obsidian monochrome luxury variant designed for dark UI interfaces.',
      category: 'Luxury Inversion',
      project: 'triguna',
      projectName: 'Triguna Logo',
      tag: 'Obsidian',
      aspect: 'wide'
    },
    {
      id: 'tg-6',
      file: 'Triguna logo/Triguna logo -6.png',
      title: 'Triguna Signature Colorway & Golden Accent',
      desc: 'Dynamic colorway exploration pairing deep charcoal slate with warm gold highlight.',
      category: 'Color Exploration',
      project: 'triguna',
      projectName: 'Triguna Logo',
      tag: 'Colorway',
      aspect: 'wide'
    },
    {
      id: 'tg-7',
      file: 'Triguna logo/Triguna logo -7.png',
      title: 'Triguna Extended Identity Mockup Presentation I',
      desc: 'Full-scale brand application mockup showing corporate collaterals and signage.',
      category: 'Brand Application',
      project: 'triguna',
      projectName: 'Triguna Logo',
      tag: 'Signage',
      aspect: 'wide'
    },
    {
      id: 'tg-8',
      file: 'Triguna logo/Triguna logo -8.png',
      title: 'Triguna Extended Identity Mockup Presentation II',
      desc: 'Architectural corporate facade 3D mockup with embossed brushed metal finish.',
      category: 'Architectural Mockup',
      project: 'triguna',
      projectName: 'Triguna Logo',
      tag: 'Embossed Metal',
      aspect: 'wide'
    },

    // ------------------------------------------------------------------------
    // Brand Project 3: Video Flux Design System
    // ------------------------------------------------------------------------
    {
      id: 'vf-1',
      file: 'Video flux logo/Video flux logo presentation 01.jpg',
      title: 'Video Flux Dynamic Brand Identity Hero Presentation',
      desc: 'Master presentation showcasing kinetic video play icon geometry and fluid gradient waves.',
      category: 'Brand Identity Hero',
      project: 'video-flux',
      projectName: 'Video Flux Design System',
      tag: 'Hero Showcase',
      aspect: 'square'
    },
    {
      id: 'vf-2',
      file: 'Video flux logo/Video flux logo presentation 02.jpg',
      title: 'Video Flux Geometric Motion & Grid Architecture',
      desc: 'Vector grid layout illustrating optical flow dynamics, angle curves, and proportion math.',
      category: 'Motion Grid System',
      project: 'video-flux',
      projectName: 'Video Flux Design System',
      tag: 'Grid System',
      aspect: 'square'
    },
    {
      id: 'vf-3',
      file: 'Video flux logo/Video flux logo presentation 03.jpg',
      title: 'Video Flux Color Palette & Dark UI Lockup',
      desc: 'Electric neon gradient palette designed specifically for video production and streaming interfaces.',
      category: 'Color & UI System',
      project: 'video-flux',
      projectName: 'Video Flux Design System',
      tag: 'Digital UI',
      aspect: 'square'
    },
    {
      id: 'vf-4',
      file: 'Video flux logo/Video flux logo presentation 04.jpg',
      title: 'Video Flux Comprehensive Commercial Brand System',
      desc: 'Full commercial ecosystem application including motion graphics overlays and studio badges.',
      category: 'Commercial Brand Suite',
      project: 'video-flux',
      projectName: 'Video Flux Design System',
      tag: 'Commercial Suite',
      aspect: 'square'
    }
  ];

  // DOM Elements
  let modal = null;
  let plane3D = null;
  let sectionMyLogo = null;
  let sectionTriguna = null;
  let sectionVideoFlux = null;
  let closeBtn = null;
  let floatingHint = null;
  let lightbox = null;
  let lightboxImg = null;
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
    modal = document.getElementById('ldModal');
    if (!modal) return;

    plane3D = document.getElementById('ld3DPlane');
    sectionMyLogo = document.getElementById('ldGridMyLogo');
    sectionTriguna = document.getElementById('ldGridTriguna');
    sectionVideoFlux = document.getElementById('ldGridVideoFlux');
    closeBtn = document.getElementById('ldCloseBtn');
    floatingHint = document.getElementById('ldFloatingHint');
    lightbox = document.getElementById('ldLightbox');
    lightboxImg = document.getElementById('ldLightboxImg');
    lightboxClose = document.getElementById('ldLightboxClose');
    lightboxTitle = document.getElementById('ldLightboxTitle');
    lightboxSubtitle = document.getElementById('ldLightboxSubtitle');
    lightboxPrev = document.getElementById('ldLightboxPrev');
    lightboxNext = document.getElementById('ldLightboxNext');
    btn3D = document.getElementById('ldBtn3D');
    btnGrid = document.getElementById('ldBtnGrid');
    filterBtns = Array.from(document.querySelectorAll('.ld-filter-btn'));

    build3DScene();
    buildGridScene();
    bindEvents();
    checkInitialHash();
  }

  // Create SVG Rotating Stamp Badge
  function createRotatingBadge(label) {
    return `
      <div class="ld-rotating-badge">
        <svg class="ld-badge-svg" viewBox="0 0 100 100" width="60" height="60">
          <defs>
            <path id="ldBadgePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
          </defs>
          <text>
            <textPath href="#ldBadgePath" startOffset="0%">${label}</textPath>
          </text>
        </svg>
        <div class="ld-badge-center-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Phase 1: Build 3D Motion Logo Wall (Continuous Looping Columns)
  // --------------------------------------------------------------------------
  function build3DScene() {
    if (!plane3D) return;
    plane3D.innerHTML = '';

    const numCols = 5;
    const colArrays = Array.from({ length: numCols }, () => []);

    // Distribute works across 5 columns
    ALL_LOGO_WORKS.forEach((item, index) => {
      colArrays[index % numCols].push({ ...item, globalIndex: index });
    });

    colArrays.forEach((items, colIdx) => {
      const colEl = document.createElement('div');
      colEl.className = `ld-3d-col ld-col-${colIdx + 1}`;

      const trackEl = document.createElement('div');
      trackEl.className = 'ld-3d-track';

      // Duplicate list twice for seamless infinite loop
      const fullList = [...items, ...items];

      fullList.forEach((item) => {
        const card = document.createElement('div');
        card.className = `ld-3d-card aspect-${item.aspect || 'wide'}`;
        card.dataset.index = item.globalIndex;

        card.innerHTML = `
          ${createRotatingBadge('✦ LOGO DESIGN ✦ BRAND IDENTITY ✦')}
          <img src="logo-designs-works/${encodeURI(item.file)}" alt="${item.title}" loading="lazy">
        `;

        // Clicking any logo in 3D wall transitions over into Grid View
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
  // Phase 2: Build Complete Logo Grid View (Organized by Brand)
  // --------------------------------------------------------------------------
  function buildGridScene() {
    // 1. Personal Brand (My Logo)
    if (sectionMyLogo) {
      sectionMyLogo.innerHTML = '';
      const myLogos = ALL_LOGO_WORKS.filter((w) => w.project === 'my-logo');
      myLogos.forEach((item) => {
        sectionMyLogo.appendChild(createGridLogoCard(item));
      });
    }

    // 2. Triguna Logo
    if (sectionTriguna) {
      sectionTriguna.innerHTML = '';
      const trigunaLogos = ALL_LOGO_WORKS.filter((w) => w.project === 'triguna');
      trigunaLogos.forEach((item) => {
        sectionTriguna.appendChild(createGridLogoCard(item));
      });
    }

    // 3. Video Flux Design System
    if (sectionVideoFlux) {
      sectionVideoFlux.innerHTML = '';
      const videoFluxLogos = ALL_LOGO_WORKS.filter((w) => w.project === 'video-flux');
      videoFluxLogos.forEach((item) => {
        sectionVideoFlux.appendChild(createGridLogoCard(item));
      });
    }
  }

  function createGridLogoCard(item) {
    const card = document.createElement('div');
    card.className = 'ld-logo-card';
    card.id = `ldGridItem-${item.id}`;

    const globalIdx = ALL_LOGO_WORKS.findIndex((w) => w.id === item.id);

    card.innerHTML = `
      <div class="ld-card-media">
        <img src="logo-designs-works/${encodeURI(item.file)}" alt="${item.title}" loading="lazy">
        <div class="ld-card-zoom-overlay">
          <span class="ld-grid-zoom-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            View Fullscreen
          </span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(globalIdx);
    });

    return card;
  }

  function bindEvents() {
    // 1. Direct Click Binding for Logo Designs card & green arrow button
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cardLogoDesigns, #btnLogoDesignsArrow, .trigger-logo-design');
      if (trigger) {
        e.preventDefault();
        window.location.hash = '#logo-design';
        openShowcase();
      }
    });

    const cardTrigger = document.getElementById('cardLogoDesigns');
    if (cardTrigger) {
      cardTrigger.style.cursor = 'pointer';
      cardTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#logo-design';
        openShowcase();
      });
    }

    const arrowTrigger = document.getElementById('btnLogoDesignsArrow');
    if (arrowTrigger) {
      arrowTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#logo-design';
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

    // 4. Mode Switcher (3D Motion Wall vs Logo Grid View)
    if (btn3D) {
      btn3D.addEventListener('click', () => setMode('3d'));
    }
    if (btnGrid) {
      btnGrid.addEventListener('click', () => setMode('grid'));
    }

    // 5. Brand Project Filter Buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        const secMyLogo = document.getElementById('ldSectionGroupMyLogo');
        const secTriguna = document.getElementById('ldSectionGroupTriguna');
        const secVideoFlux = document.getElementById('ldSectionGroupVideoFlux');

        if (filter === 'all') {
          if (secMyLogo) secMyLogo.style.display = '';
          if (secTriguna) secTriguna.style.display = '';
          if (secVideoFlux) secVideoFlux.style.display = '';
        } else if (filter === 'my-logo') {
          if (secMyLogo) secMyLogo.style.display = '';
          if (secTriguna) secTriguna.style.display = 'none';
          if (secVideoFlux) secVideoFlux.style.display = 'none';
        } else if (filter === 'triguna') {
          if (secMyLogo) secMyLogo.style.display = 'none';
          if (secTriguna) secTriguna.style.display = '';
          if (secVideoFlux) secVideoFlux.style.display = 'none';
        } else if (filter === 'video-flux') {
          if (secMyLogo) secMyLogo.style.display = 'none';
          if (secTriguna) secTriguna.style.display = 'none';
          if (secVideoFlux) secVideoFlux.style.display = '';
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
      } else if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') closeShowcase();
      }
    });

    // 8. Hash Change Listener
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#logo-design' || window.location.hash === '#logo-designs') {
        openShowcase();
      } else if (modal && modal.classList.contains('active') && !window.location.hash.startsWith('#logo-design')) {
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
      const item = ALL_LOGO_WORKS[index];
      if (item) {
        const el = document.getElementById(`ldGridItem-${item.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      openLightbox(index);
    }, 150);
  }

  function openShowcase() {
    if (!modal) return;
    setMode('3d'); // Always open 3D Motion Logo Wall FIRST!
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

    if (window.location.hash === '#logo-design' || window.location.hash === '#logo-designs') {
      history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }

  // --------------------------------------------------------------------------
  // Phase 3: High-Resolution Logo Lightbox
  // --------------------------------------------------------------------------
  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentLightboxIndex = (index + ALL_LOGO_WORKS.length) % ALL_LOGO_WORKS.length;
    const item = ALL_LOGO_WORKS[currentLightboxIndex];

    lightboxImg.src = `logo-designs-works/${encodeURI(item.file)}`;
    lightboxImg.alt = item.title;

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxSubtitle) {
      lightboxSubtitle.textContent = `${item.projectName} - ${item.category}`;
    }

    lightbox.classList.add('active');
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  }

  function navigateLightbox(dir) {
    openLightbox(currentLightboxIndex + dir);
  }

  function checkInitialHash() {
    if (window.location.hash === '#logo-design' || window.location.hash === '#logo-designs') {
      setTimeout(openShowcase, 100);
    }
  }

  // --------------------------------------------------------------------------
  // Homepage Card Image Cycler (Cycles through key logo mockups every 3s)
  // --------------------------------------------------------------------------
  function initCardImageCycler() {
    const container = document.getElementById('ldCardPreview');
    if (!container) return;

    const featuredLogos = [
      { file: 'My Logo/My Logo 2.0.1.png', alt: 'Personal Brand Identity 2.0 Master Mark' },
      { file: 'Triguna logo/Triguna logo -1.png', alt: 'Triguna Corporate Logo Design' },
      { file: 'Video flux logo/Video flux logo presentation 01.jpg', alt: 'Video Flux Brand Presentation' },
      { file: 'My Logo/Branding Identity MockUp Vol16.png', alt: 'Luxury Brand Identity Mockup' },
      { file: 'Triguna logo/Triguna logo -2.png', alt: 'Triguna Dark Canvas Emblem' },
      { file: 'My Logo/Poster Artwork in a Modern Loft MockUp.png', alt: 'Modern Loft Gallery Poster' }
    ];

    container.innerHTML = `
      <div class="ld-cycler-slide active" id="ldSlide1">
        <img src="logo-designs-works/${encodeURI(featuredLogos[0].file)}" alt="${featuredLogos[0].alt}">
      </div>
      <div class="ld-cycler-slide" id="ldSlide2">
        <img src="logo-designs-works/${encodeURI(featuredLogos[1].file)}" alt="${featuredLogos[1].alt}">
      </div>
      <div class="project-preview-overlay">
        <span class="btn-preview-showcase">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Open Logo Showcase
        </span>
      </div>
    `;

    let activeIdx = 0;
    let activeSlot = 1;

    const slide1 = document.getElementById('ldSlide1');
    const slide2 = document.getElementById('ldSlide2');

    setInterval(() => {
      activeIdx = (activeIdx + 1) % featuredLogos.length;
      const nextLogo = featuredLogos[activeIdx];

      if (activeSlot === 1) {
        slide2.querySelector('img').src = `logo-designs-works/${encodeURI(nextLogo.file)}`;
        slide2.querySelector('img').alt = nextLogo.alt;
        slide2.classList.add('active');
        slide1.classList.remove('active');
        activeSlot = 2;
      } else {
        slide1.querySelector('img').src = `logo-designs-works/${encodeURI(nextLogo.file)}`;
        slide1.querySelector('img').alt = nextLogo.alt;
        slide1.classList.add('active');
        slide2.classList.remove('active');
        activeSlot = 1;
      }
    }, 3000); // 3 seconds
  }

  // Public API
  window._realOpenLogoShowcase = openShowcase;
  window.openLogoDesignShowcase = openShowcase;
  window.closeLogoDesignShowcase = closeShowcase;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initCardImageCycler();
    });
  } else {
    init();
    initCardImageCycler();
  }
})();
