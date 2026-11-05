/**
 * Graphic Design Interactive 3D Showcase & 4x4 Grid
 * - Phase 1: 3D Motion Wall (Perspective tilted drift inspired by reference video)
 * - Phase 2: 4-Column Grid View (4 horizontal, 4 visible vertical, scrolling)
 * - Lightbox: Full-resolution zoom view with navigation
 */

(function () {
  'use strict';

  // Immediate window exposure
  window._realOpenShowcase = function () {
    openShowcase();
  };
  window.openGraphicDesignShowcase = function () {
    openShowcase();
  };
  window.closeGraphicDesignShowcase = function () {
    closeShowcase();
  };

  const GRAPHIC_DESIGN_WORKS = [
    // --- Featured in Mid-year_Recap.mp4 Reference Video ---
    { file: "Artboard 1.png", title: "BEYOND", subtitle: "Nature Awaits - Botanical Astronaut", category: "Conceptual Art" },
    { file: "Artboard 2.png", title: "WATCH", subtitle: "Always Watching - Surreal Monochrome", category: "Surreal Art" },
    { file: "Artboard 3.png", title: "NATURE", subtitle: "Breathe Fresh Air - Forest Capsule", category: "Visual Design" },
    { file: "Artboard 4.png", title: "DEEP SLEEP", subtitle: "Serenity In Capsule - Liquid Dreams", category: "3D Concept" },
    { file: "Artboard 5.png", title: "WISDOM", subtitle: "Life in a Shortfilm - Cinematic Portrait", category: "Editorial" },
    { file: "Artboard 6.png", title: "awaken.", subtitle: "Find Your Soul - Misty Dimension Portal", category: "Creative Art" },
    { file: "Artboard 7.png", title: "SUNSHINE", subtitle: "A Legacy of Vibes - Chromatic Sunset", category: "Poster Design" },
    { file: "Artboard 8.png", title: "OVER THINK", subtitle: "Nothing Worth - Surreal Geometry", category: "Poster Art" },
    { file: "Artboard 9.png", title: "DREAMS", subtitle: "Cloud in a Glass Pill - Ethereal Concept", category: "Creative Direction" },
    { file: "Artboard 10.png", title: "ENDLESS", subtitle: "Sound of Depths - Layered Identity", category: "Visual Symphony" },
    { file: "Artboard 1.jpg", title: "BURNOUT", subtitle: "Stop. Rest. Recharge - High Contrast", category: "Art Direction" },
    { file: "Artboard 2.jpg", title: "TIMELESS", subtitle: "Shadowed Journey Across The Dunes", category: "Atmospheric Visual" },
    { file: "Artboard 3.jpg", title: "DIMENSION", subtitle: "Parallel Horizon Exhibition Series", category: "Exhibition Art" },
    { file: "Artboard 4.0.png", title: "EXISTENCE", subtitle: "Red Luminescence - Modernist Study", category: "Digital Art" },
    
    // --- Apparel & Brand Visual Campaigns ---
    { file: "Apparel-&-LifestyleArtboard-1.png", title: "Apparel & Lifestyle I", subtitle: "Summer Visual Campaign", category: "Fashion" },
    { file: "Apparel-&-LifestyleArtboard-2.png", title: "Apparel & Lifestyle II", subtitle: "Urban Streetwear Aesthetics", category: "Fashion" },
    { file: "Skincare Brands.png", title: "Skincare Brands", subtitle: "Pure Radiant Glow Aesthetics", category: "Beauty & Wellness" },
    { file: "Salons.png", title: "Salons & Luxury Aesthetics", subtitle: "High Fashion Grooming Brand", category: "Lifestyle" },
    { file: "Gold & Silver Jewellery.png", title: "Gold & Silver Jewellery", subtitle: "Royal Heritage Collection", category: "Luxury" },
    { file: "Car Detailing Studios.png", title: "Car Detailing Studios", subtitle: "High-Gloss Precision Finish", category: "Automotive" },
    { file: "EV-Brands.png", title: "EV Brands", subtitle: "Next-Gen Eco Mobility Identity", category: "Tech & Auto" },
    { file: "Flower Shops.png", title: "Flower Shops", subtitle: "Botanical Floral Compositions", category: "Retail Design" },
    { file: "Gym & Fitness Centres.png", title: "Gym & Fitness Centres", subtitle: "High-Octane Performance Power", category: "Fitness" },
    { file: "Home Renovation.png", title: "Home Renovation", subtitle: "Contemporary Architectural Living", category: "Interior" },
    { file: "Photography Studios.png", title: "Photography Studios", subtitle: "Visual Storytelling Identity", category: "Media & Arts" },
    { file: "Podcast Studios.png", title: "Podcast Studios", subtitle: "Broadcast Audio-Visual Branding", category: "Broadcast" },
    { file: "Dance_Music Academies.png", title: "Dance & Music Academies", subtitle: "Rhythmic Performing Arts", category: "Arts" },
    { file: "Preschools & Play Schools.png", title: "Preschools & Play Schools", subtitle: "Vibrant Early Childhood Learning", category: "Education" },
    { file: "Smart Home Solutions.png", title: "Smart Home Solutions", subtitle: "Intelligent Connected Living", category: "Smart Tech" },
    { file: "Startups (Tech Non-Tech).png", title: "Startups (Tech & Non-Tech)", subtitle: "Innovative Venture Identity", category: "Corporate" },
    { file: "Travel Agencies.png", title: "Travel Agencies", subtitle: "Wanderlust Destinations Campaign", category: "Travel" },
    { file: "Yoga Studios.png", title: "Yoga Studios", subtitle: "Mindfulness, Balance & Zen", category: "Wellness" }
  ];

  let currentMode = '3d'; // '3d' or 'grid'
  let currentLightboxIndex = -1;
  let isShowcaseOpen = false;

  // DOM Elements
  let modal, plane3D, gridContainer, btn3D, btnGrid, closeBtn, lightbox, lightboxImg, lightboxCaption;

  function init() {
    modal = document.getElementById('gdModal');
    if (!modal) return;

    plane3D = document.getElementById('gd3DPlane');
    gridContainer = document.getElementById('gdWorksGrid');
    btn3D = document.getElementById('gdBtn3D');
    btnGrid = document.getElementById('gdBtnGrid');
    closeBtn = document.getElementById('gdCloseBtn');
    lightbox = document.getElementById('gdLightbox');
    lightboxImg = document.getElementById('gdLightboxImg');
    lightboxCaption = document.getElementById('gdLightboxCaption');

    build3DScene();
    buildGridScene();
    bindEvents();
  }

  // Populate 3D scrolling columns (5 columns of infinite looping poster strips)
  function build3DScene() {
    if (!plane3D) return;
    plane3D.innerHTML = '';

    const numCols = 5;
    const colArrays = Array.from({ length: numCols }, () => []);

    // Distribute works across columns
    GRAPHIC_DESIGN_WORKS.forEach((item, index) => {
      colArrays[index % numCols].push({ ...item, origIndex: index });
    });

    colArrays.forEach((items, colIdx) => {
      const colEl = document.createElement('div');
      colEl.className = `gd-3d-col gd-col-${colIdx + 1}`;

      const trackEl = document.createElement('div');
      trackEl.className = 'gd-3d-track';

      // Duplicate array items twice for smooth infinite loop
      const fullList = [...items, ...items];

      fullList.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'gd-3d-card';
        card.dataset.index = item.origIndex;

        const img = document.createElement('img');
        img.src = `graphic-design-works/${encodeURIComponent(item.file)}`;
        img.alt = item.title;
        img.loading = 'lazy';
        img.draggable = false;

        card.appendChild(img);

        // Clicking any card in 3D mode triggers transition to 4x4 Grid view
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          switchToGridAndScrollTo(item.origIndex);
        });

        trackEl.appendChild(card);
      });

      colEl.appendChild(trackEl);
      plane3D.appendChild(colEl);
    });
  }

  // Populate 4-column responsive grid
  function buildGridScene() {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    GRAPHIC_DESIGN_WORKS.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gd-grid-card';
      card.id = `gdGridItem-${index}`;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="gd-grid-preview">
          <img src="graphic-design-works/${encodeURIComponent(item.file)}" alt="${item.title}" loading="lazy">
          <div class="gd-grid-overlay">
            <span class="gd-grid-zoom-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              View Fullscreen
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(index);
      });

      gridContainer.appendChild(card);
    });
  }

  function bindEvents() {
    // 1. Trigger ONLY when clicking the Graphic Design project card or its green arrow button
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cardGraphicDesign, #btnGraphicDesignArrow');
      if (trigger) {
        e.preventDefault();
        openShowcase();
      }
    });

    // 2. Direct binding for Graphic Design project card
    const cardTrigger = document.getElementById('cardGraphicDesign');
    if (cardTrigger) {
      cardTrigger.style.cursor = 'pointer';
      cardTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openShowcase();
      });
    }

    const arrowTrigger = document.getElementById('btnGraphicDesignArrow');
    if (arrowTrigger) {
      arrowTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openShowcase();
      });
    }

    // Hash check on load & hashchange
    // Hash listener ready for clicks
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#graphic-design') {
        openShowcase();
      }
    });

    // 3. Mode Toggle buttons
    if (btn3D) {
      btn3D.addEventListener('click', () => setMode('3d'));
    }
    if (btnGrid) {
      btnGrid.addEventListener('click', () => setMode('grid'));
    }

    // 4. Close Showcase
    if (closeBtn) {
      closeBtn.addEventListener('click', closeShowcase);
    }

    // 4. Floating hint click -> switch to grid
    const hint = document.getElementById('gdFloatingHint');
    if (hint) {
      hint.addEventListener('click', () => setMode('grid'));
    }

    // 5. Interactive 3D mouse parallax in 3D mode
    const viewport = document.getElementById('gd3DScene');
    if (viewport) {
      viewport.addEventListener('mousemove', (e) => {
        if (currentMode !== '3d' || !plane3D) return;
        const rect = viewport.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotX = 34 - y * 12;
        const rotY = -14 + x * 16;
        const rotZ = 8 + x * 4;

        plane3D.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) translateZ(0)`;
      });

      viewport.addEventListener('mouseleave', () => {
        if (currentMode === '3d' && plane3D) {
          plane3D.style.transform = `rotateX(34deg) rotateY(-14deg) rotateZ(8deg) translateZ(0)`;
        }
      });
    }

    // 6. Lightbox navigation & close
    const lbClose = document.getElementById('gdLightboxClose');
    const lbPrev = document.getElementById('gdLightboxPrev');
    const lbNext = document.getElementById('gdLightboxNext');
    const lbBackdrop = document.querySelector('.gd-lightbox-backdrop');

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', prevLightbox);
    if (lbNext) lbNext.addEventListener('click', nextLightbox);

    // 7. Global Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (!isShowcaseOpen) return;

      if (e.key === 'Escape') {
        if (currentLightboxIndex !== -1) {
          closeLightbox();
        } else {
          closeShowcase();
        }
      } else if (currentLightboxIndex !== -1) {
        if (e.key === 'ArrowLeft') prevLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
      } else {
        if (e.key === '1') setMode('3d');
        if (e.key === '2') setMode('grid');
      }
    });
  }

  function openShowcase() {
    if (!modal || !plane3D || !plane3D.children.length) {
      init();
    }
    if (!modal) {
      modal = document.getElementById('gdModal');
    }
    if (!modal) return;
    isShowcaseOpen = true;
    modal.style.display = 'block';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.pointerEvents = 'auto';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Keep URL updated with #graphic-design
    try {
      if (window.location.hash !== '#graphic-design') {
        history.replaceState(null, '', '#graphic-design');
      }
    } catch (e) {}

    // Start in 3D Motion Wall mode as requested
    setMode('3d');
  }

  function closeShowcase() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.style.pointerEvents = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    isShowcaseOpen = false;
    closeLightbox();

    // Cleanly revert hash back to #projects
    try {
      if (window.location.hash === '#graphic-design') {
        // Keep hash intact
      }
    } catch (e) {}
  }

  function setMode(mode) {
    currentMode = mode;
    modal.setAttribute('data-view-mode', mode);

    if (btn3D && btnGrid) {
      if (mode === '3d') {
        btn3D.classList.add('active');
        btnGrid.classList.remove('active');
        if (plane3D) {
          plane3D.style.transform = `rotateX(34deg) rotateY(-14deg) rotateZ(8deg) translateZ(0)`;
        }
      } else {
        btnGrid.classList.add('active');
        btn3D.classList.remove('active');
      }
    }
  }

  function switchToGridAndScrollTo(targetIndex) {
    setMode('grid');
    setTimeout(() => {
      const el = document.getElementById(`gdGridItem-${targetIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('gd-card-highlighted');
        setTimeout(() => el.classList.remove('gd-card-highlighted'), 1800);
      }
    }, 280);
  }

  // Lightbox functions
  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    if (index < 0 || index >= GRAPHIC_DESIGN_WORKS.length) return;

    currentLightboxIndex = index;
    const item = GRAPHIC_DESIGN_WORKS[index];

    lightboxImg.src = `graphic-design-works/${encodeURIComponent(item.file)}`;
    lightboxImg.alt = item.title;
    lightboxCaption.innerHTML = `
      <span class="gd-lb-cat">${item.category}</span>
      <h3 class="gd-lb-title">${item.title}</h3>
      <p class="gd-lb-sub">${item.subtitle} - (${index + 1} of ${GRAPHIC_DESIGN_WORKS.length})</p>
    `;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    currentLightboxIndex = -1;
  }

  function prevLightbox() {
    if (currentLightboxIndex > 0) {
      openLightbox(currentLightboxIndex - 1);
    } else {
      openLightbox(GRAPHIC_DESIGN_WORKS.length - 1);
    }
  }

  function nextLightbox() {
    if (currentLightboxIndex < GRAPHIC_DESIGN_WORKS.length - 1) {
      openLightbox(currentLightboxIndex + 1);
    } else {
      openLightbox(0);
    }
  }

  // --------------------------------------------------------------------------
  // 5-Second Dual Image Cycler for Graphic Design Project Card Preview
  // (Two images horizontal side-by-side, changing every 5 seconds)
  // --------------------------------------------------------------------------
  let cyclerInterval = null;
  function initCardImageCycler() {
    if (cyclerInterval) return; // already running

    const slide1 = document.getElementById('gdDualSlide1');
    const slide2 = document.getElementById('gdDualSlide2');
    const img1A = document.getElementById('gdDualImg1A');
    const img1B = document.getElementById('gdDualImg1B');
    const img2A = document.getElementById('gdDualImg2A');
    const img2B = document.getElementById('gdDualImg2B');

    if (!slide1 || !slide2 || !img1A || !img1B || !img2A || !img2B) return;

    let pairIndex = 0;
    let activeSlot = 1;

    function preload(filename) {
      if (!filename) return;
      const img = new Image();
      img.src = 'graphic-design-works/' + encodeURIComponent(filename);
    }

    // Preload first 8 artworks
    for (let i = 0; i < Math.min(8, GRAPHIC_DESIGN_WORKS.length); i++) {
      preload(GRAPHIC_DESIGN_WORKS[i].file);
    }

    cyclerInterval = setInterval(() => {
      // Advance by 2 images to show next horizontal pair
      pairIndex = (pairIndex + 2) % GRAPHIC_DESIGN_WORKS.length;
      const idxA = pairIndex;
      const idxB = (pairIndex + 1) % GRAPHIC_DESIGN_WORKS.length;

      const workA = GRAPHIC_DESIGN_WORKS[idxA];
      const workB = GRAPHIC_DESIGN_WORKS[idxB];
      const srcA = 'graphic-design-works/' + encodeURIComponent(workA.file);
      const srcB = 'graphic-design-works/' + encodeURIComponent(workB.file);

      if (activeSlot === 1) {
        img2A.src = srcA;
        img2A.alt = workA.title;
        img2B.src = srcB;
        img2B.alt = workB.title;

        slide2.classList.add('active');
        slide1.classList.remove('active');
        activeSlot = 2;
      } else {
        img1A.src = srcA;
        img1A.alt = workA.title;
        img1B.src = srcB;
        img1B.alt = workB.title;

        slide1.classList.add('active');
        slide2.classList.remove('active');
        activeSlot = 1;
      }

      // Preload next upcoming pair
      const nextIdxA = (pairIndex + 2) % GRAPHIC_DESIGN_WORKS.length;
      const nextIdxB = (pairIndex + 3) % GRAPHIC_DESIGN_WORKS.length;
      preload(GRAPHIC_DESIGN_WORKS[nextIdxA].file);
      preload(GRAPHIC_DESIGN_WORKS[nextIdxB].file);
    }, 5000); // exactly 5 seconds
  }

  // Public API
  window._realOpenShowcase = openShowcase;
  window.openGraphicDesignShowcase = openShowcase;
  window.closeGraphicDesignShowcase = closeShowcase;

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
