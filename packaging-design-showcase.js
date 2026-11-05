/**
 * Packaging Design Interactive 3D Showcase & Product Gallery
 * Inspired by Reference Video (One SEO-optimized video can outperform 50 uploads)
 *
 * Workflow:
 * - When user clicks Packaging Design card or green arrow button:
 *   Phase 1: 3D Motion Packaging Wall opens FIRST (#pdModal[data-view-mode="3d"])
 *   Continuous 3D perspective columns stream and loop packaging works!
 * - When user clicks any packaging work or the floating hint banner:
 *   Phase 2: Transitions over to the Grid View (#pdModal[data-view-mode="grid"])
 *   where ALL packaging designs are organized in a 4-column responsive grid!
 *   Row 1, Column 1: Master Die-Line & Full Packaging Net
 * - When user clicks any design in either view:
 *   Phase 3: Opens High-Resolution Lightbox Viewer with zoom, info, and prev/next navigation!
 */

(function () {
  'use strict';

  // Complete Packaging Design Catalog (12 High-Definition Curated Assets)
  // Row 1, Column 1 (Index 0) is the Master Die-Line Net
  const ALL_PACKAGING_WORKS = [
    // ------------------------------------------------------------------------
    // Row 1, Column 1: Master Die-Line & Full Packaging Net
    // ------------------------------------------------------------------------
    {
      id: 'pd-master-dieline',
      file: 'cadbury_packaging_full_dieline.jpg',
      title: 'Cadbury Cookies Master Die-Line & Full Packaging Net',
      subtitle: 'Master Blueprint & Dieline (360-Degree Net)',
      desc: 'Complete 360-degree unfolded carton net showing all folds, tuck tabs, bleed margins, and structural dieline metrics.',
      category: 'Master Blueprint',
      group: 'blueprint',
      groupName: 'Master Blueprint & Dieline',
      aspect: 'square',
      fit: 'contain'
    },

    // ------------------------------------------------------------------------
    // Row 1, Columns 2-4: Retail Hero Displays
    // ------------------------------------------------------------------------
    {
      id: 'pd-front',
      file: 'cadbury_cookies_front_display.jpg',
      title: 'Cadbury Cookies Front Retail Display Hero Panel',
      subtitle: 'Hero Package Display',
      desc: 'Vibrant retail display packaging featuring rich Cadbury purple, Minions mascot character, and golden choc-filled cookie.',
      category: 'Hero Display',
      group: 'hero',
      groupName: 'Retail Hero Displays',
      aspect: 'square'
    },
    {
      id: 'pd-focal',
      file: 'cadbury_cookies_cookie_minion_focal.jpg',
      title: 'Molten Choc Cookie Hero & Minion Character Lockup',
      subtitle: 'Focal Artwork & Character Design',
      desc: 'Dynamic visual lockup of the crispy baked cookie breaking open to reveal rich liquid chocolate, alongside the Minion mascot.',
      category: 'Focal Hero',
      group: 'hero',
      groupName: 'Retail Hero Displays',
      aspect: 'square'
    },
    {
      id: 'pd-header',
      file: 'cadbury_cookies_top_header_panel.jpg',
      title: 'Top Display Header Panel with Free Movie Voucher Promo',
      subtitle: 'Promotional Packaging Header',
      desc: 'Shelf-top header panel featuring movie voucher QR scan promotion and promotional Minions franchise partnership.',
      category: 'Top Header',
      group: 'hero',
      groupName: 'Retail Hero Displays',
      aspect: 'square'
    },

    // ------------------------------------------------------------------------
    // Row 2, Columns 1-4: Brand Typography & Macro Details
    // ------------------------------------------------------------------------
    {
      id: 'pd-brand',
      file: 'cadbury_cookies_brand_lockup.jpg',
      title: 'Cadbury Cookies Premium Brand Identity Lockup',
      subtitle: 'Brand Typography & Wordmark',
      desc: 'Gold-embossed Cadbury Cookies script lockup with product descriptor taglines and high-contrast packaging hierarchy.',
      category: 'Brand Identity',
      group: 'details',
      groupName: 'Macro Details & Typography',
      aspect: 'square'
    },
    {
      id: 'pd-cookie-macro',
      file: 'cadbury_cookies_molten_cookie_macro.jpg',
      title: 'Molten Choc Cookie Center Macro Food Photography',
      subtitle: 'Macro Food Styling',
      desc: 'Ultra-high-definition macro crop highlighting golden cookie crumb texture and luscious melted chocolate core.',
      category: 'Food Styling',
      group: 'details',
      groupName: 'Macro Details & Typography',
      aspect: 'square'
    },
    {
      id: 'pd-minion-macro',
      file: 'cadbury_cookies_minion_mascot_macro.jpg',
      title: 'Minions Franchise Mascot High-Res Macro Artwork',
      subtitle: 'Character Mascot Styling',
      desc: 'Crystal-clear macro render of the iconic one-eyed Minion character holding a fresh chocolate chip.',
      category: 'Character Design',
      group: 'details',
      groupName: 'Macro Details & Typography',
      aspect: 'square'
    },
    {
      id: 'pd-cake-promo',
      file: 'cadbury_cookies_brownie_cake_promo.jpg',
      title: 'Cadbury Brownie & Choc Layered Cake Cross-Sell Panel',
      subtitle: 'Cross-Merchandising Panel',
      desc: 'Appetizing visual cross-promotion displaying Cadbury Fudgy Brownie and Layered Choc Cake product variants.',
      category: 'Cross-Sell Panel',
      group: 'details',
      groupName: 'Macro Details & Typography',
      aspect: 'square'
    },

    // ------------------------------------------------------------------------
    // Row 3, Columns 1-2: Structural Packaging Flaps
    // ------------------------------------------------------------------------
    {
      id: 'pd-left-flap',
      file: 'cadbury_cookies_left_flap.jpg',
      title: 'Left Side Flap & Precision Insert Tab Dieline',
      subtitle: 'Structural Packaging Flap',
      desc: 'Side flap with promotional QR redemption code, opening arrow guides, and structural lock tabs.',
      category: 'Structural Flap',
      group: 'structure',
      groupName: 'Structure & Flaps',
      aspect: 'square'
    },
    {
      id: 'pd-right-flap',
      file: 'cadbury_cookies_right_flap.jpg',
      title: 'Right Side Flap & Minions Franchise Seal',
      subtitle: 'Structural Packaging Flap',
      desc: 'Opposite side closure flap featuring Minions movie franchise badge and tamper-evident fold lines.',
      category: 'Structural Flap',
      group: 'structure',
      groupName: 'Structure & Flaps',
      aspect: 'square'
    },

    // ------------------------------------------------------------------------
    // Row 3, Columns 3-4: Nutritional Facts & Statutory Compliance
    // ------------------------------------------------------------------------
    {
      id: 'pd-back-nutrition',
      file: 'cadbury_cookies_back_nutrition_panel.jpg',
      title: 'Complete Back Nutrition Facts & Regulatory Specification',
      subtitle: 'Compliance & Nutritional Facts',
      desc: 'Comprehensive food labeling including calorie breakdown, allergy warnings, ingredients list, and storage specifications.',
      category: 'Nutrition Label',
      group: 'compliance',
      groupName: 'Regulatory Compliance & Nutrition',
      aspect: 'square'
    },
    {
      id: 'pd-barcode',
      file: 'cadbury_cookies_barcode_compliance.jpg',
      title: 'Retail EAN Barcode & Government Compliance Certification',
      subtitle: 'Barcode & Statutory Seals',
      desc: 'Scannable global EAN-13 retail barcode, FSSAI green-dot vegetarian certification, and manufacturer licensing details.',
      category: 'Statutory Seal',
      group: 'compliance',
      groupName: 'Regulatory Compliance & Nutrition',
      aspect: 'square'
    }
  ];

  // DOM Elements
  let modal = null;
  let plane3D = null;
  let gridContainer = null;
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
    modal = document.getElementById('pdModal');
    if (!modal) return;

    plane3D = document.getElementById('pd3DPlane');
    gridContainer = document.getElementById('pdPackagesGrid');
    closeBtn = document.getElementById('pdCloseBtn');
    floatingHint = document.getElementById('pdFloatingHint');
    lightbox = document.getElementById('pdLightbox');
    lightboxImg = document.getElementById('pdLightboxImg');
    lightboxClose = document.getElementById('pdLightboxClose');
    lightboxTitle = document.getElementById('pdLightboxTitle');
    lightboxSubtitle = document.getElementById('pdLightboxSubtitle');
    lightboxPrev = document.getElementById('pdLightboxPrev');
    lightboxNext = document.getElementById('pdLightboxNext');
    btn3D = document.getElementById('pdBtn3D');
    btnGrid = document.getElementById('pdBtnGrid');
    filterBtns = Array.from(document.querySelectorAll('.pd-filter-btn'));

    build3DScene();
    buildGridScene();
    bindEvents();
    checkInitialHash();
  }

  // Create SVG Rotating Stamp Badge
  function createRotatingBadge(label) {
    return `
      <div class="pd-rotating-badge">
        <svg class="pd-badge-svg" viewBox="0 0 100 100" width="60" height="60">
          <defs>
            <path id="pdBadgePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
          </defs>
          <text>
            <textPath href="#pdBadgePath" startOffset="0%">${label}</textPath>
          </text>
        </svg>
        <div class="pd-badge-center-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Phase 1: Build 3D Motion Packaging Wall (Continuous Looping Columns)
  // --------------------------------------------------------------------------
  function build3DScene() {
    if (!plane3D) return;
    plane3D.innerHTML = '';

    const numCols = 5;
    const colArrays = Array.from({ length: numCols }, () => []);

    // Distribute works across 5 columns (Index 0 goes to Column 1)
    ALL_PACKAGING_WORKS.forEach((item, index) => {
      colArrays[index % numCols].push({ ...item, globalIndex: index });
    });

    colArrays.forEach((items, colIdx) => {
      const colEl = document.createElement('div');
      colEl.className = `pd-3d-col pd-col-${colIdx + 1}`;

      const trackEl = document.createElement('div');
      trackEl.className = 'pd-3d-track';

      // Duplicate list for seamless infinite loop
      const fullList = [...items, ...items, ...items];

      fullList.forEach((item) => {
        const card = document.createElement('div');
        const fitClass = item.fit === 'contain' ? ' fit-contain' : '';
        card.className = `pd-3d-card aspect-${item.aspect || 'square'}${fitClass}`;
        card.dataset.index = item.globalIndex;

        card.innerHTML = `
          ${createRotatingBadge('PACKAGING DESIGN - BRAND IDENTITY -')}
          <img src="packaging-design-works/${encodeURI(item.file)}" alt="${item.title}" loading="lazy">
        `;

        // Clicking any packaging item in 3D wall transitions over into Grid View
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
  // Phase 2: Build Complete Packaging Grid View (4-Column Responsive Grid)
  // Row 1, Column 1 is Master Die-Line & Full Packaging Net
  // --------------------------------------------------------------------------
  function buildGridScene() {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    ALL_PACKAGING_WORKS.forEach((item, index) => {
      gridContainer.appendChild(createGridPackagingCard(item, index));
    });
  }

  // Pure Visual Media Card (No text underneath image, per user instruction)
  function createGridPackagingCard(item, globalIdx) {
    const card = document.createElement('div');
    const fitClass = item.fit === 'contain' ? ' fit-contain' : '';
    card.className = `pd-packaging-card aspect-${item.aspect || 'square'}${fitClass}`;
    card.id = `pdGridItem-${item.id}`;
    card.dataset.group = item.group;

    card.innerHTML = `
      <div class="pd-card-media">
        <img src="packaging-design-works/${encodeURI(item.file)}" alt="${item.title}" loading="lazy">
        <div class="pd-card-zoom-overlay">
          <span class="pd-grid-zoom-pill">
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
    // 1. Direct Click Binding for Packaging Design card & green arrow button
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cardPackagingDesign, #btnPackagingDesignArrow, .trigger-packaging-design');
      if (trigger) {
        e.preventDefault();
        window.location.hash = '#packaging-design';
        openShowcase();
      }
    });

    const cardTrigger = document.getElementById('cardPackagingDesign');
    if (cardTrigger) {
      cardTrigger.style.cursor = 'pointer';
      cardTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#packaging-design';
        openShowcase();
      });
    }

    const arrowTrigger = document.getElementById('btnPackagingDesignArrow');
    if (arrowTrigger) {
      arrowTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#packaging-design';
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

        if (!gridContainer) return;
        const cards = gridContainer.querySelectorAll('.pd-packaging-card');
        cards.forEach((card) => {
          const group = card.dataset.group;
          if (filter === 'all' || group === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
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
      if (window.location.hash === '#packaging-design' || window.location.hash === '#packaging-designs') {
        openShowcase();
      } else if (modal && modal.classList.contains('active') && !window.location.hash.startsWith('#packaging-design')) {
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
      const item = ALL_PACKAGING_WORKS[index];
      if (item) {
        const el = document.getElementById(`pdGridItem-${item.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      openLightbox(index);
    }, 150);
  }

  function openShowcase() {
    if (!modal) return;
    setMode('3d'); // Always open 3D Motion Packaging Wall FIRST!
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

    if (window.location.hash === '#packaging-design' || window.location.hash === '#packaging-designs') {
      history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }

  // --------------------------------------------------------------------------
  // Phase 3: High-Resolution Packaging Lightbox
  // --------------------------------------------------------------------------
  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentLightboxIndex = (index + ALL_PACKAGING_WORKS.length) % ALL_PACKAGING_WORKS.length;
    const item = ALL_PACKAGING_WORKS[currentLightboxIndex];

    lightboxImg.src = `packaging-design-works/${encodeURI(item.file)}`;
    lightboxImg.alt = item.title;

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxSubtitle) {
      lightboxSubtitle.textContent = `${item.groupName} - ${item.category}`;
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
    if (window.location.hash === '#packaging-design' || window.location.hash === '#packaging-designs') {
      setTimeout(openShowcase, 100);
    }
  }

  // --------------------------------------------------------------------------
  // Homepage Card Image Cycler (Cycles through key packaging panels every 3s)
  // Master Die-Line Net is shown FIRST!
  // --------------------------------------------------------------------------
  function initCardImageCycler() {
    const container = document.getElementById('pdCardPreview');
    if (!container) return;

    const featuredPanels = [
      { file: 'cadbury_packaging_full_dieline.jpg', alt: 'Cadbury Cookies Master Die-Line Net' },
      { file: 'cadbury_cookies_front_display.jpg', alt: 'Cadbury Cookies Front Retail Display' },
      { file: 'cadbury_cookies_cookie_minion_focal.jpg', alt: 'Molten Choc Cookie Hero & Minion Character' },
      { file: 'cadbury_cookies_brand_lockup.jpg', alt: 'Cadbury Cookies Brand Identity' },
      { file: 'cadbury_cookies_top_header_panel.jpg', alt: 'Top Display Header Panel' }
    ];

    container.innerHTML = `
      ${featuredPanels
        .map(
          (p, idx) => `
        <div class="pd-cycler-slide ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
          <img src="packaging-design-works/${encodeURI(p.file)}" alt="${p.alt}" loading="lazy">
        </div>
      `
        )
        .join('')}
      <div class="project-preview-overlay">
        <span class="btn-preview-showcase">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Open Packaging Showcase
        </span>
      </div>
    `;

    const slides = Array.from(container.querySelectorAll('.pd-cycler-slide'));
    if (slides.length <= 1) return;

    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 3000);
  }

  // Public APIs
  window._realOpenPackagingShowcase = openShowcase;
  window.openPackagingDesignShowcase = openShowcase;
  window.closePackagingDesignShowcase = closeShowcase;

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
