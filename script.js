(function () {
  'use strict';

  const TOTAL_FRAMES = 240;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  const images = new Array(TOTAL_FRAMES);
  const decodingSet = new Set();
  let targetProgress = 0;
  let currentProgress = 0;
  let lastDrawnFrame = -1;

  // Accurately compute scroll progress [0, 1]
  function getScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const maxScroll = scrollHeight - windowHeight;
    if (maxScroll <= 0) return 0;
    return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
  }

  // Draw image shifted right & downside with seamless background filling (Ultra-HD native crispness)
  function drawImageCover(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Calculate base cover scale so the image always covers full viewport height & width
    const baseScale = Math.max(cw / iw, ch / ih);
    const dw = Math.ceil(iw * baseScale);
    const dh = Math.ceil(ih * baseScale);

    // Responsive subject placement: on desktop/tablet shift toward the right side to leave room for text;
    // on mobile, shift a little bit to the left side on mobile version only
    const isMobile = (typeof window !== 'undefined' && window.innerWidth <= 768);
    const shiftRatio = isMobile
      ? -0.10
      : (window.innerWidth >= 1024 ? 0.12 : 0.08);
    const shiftX = Math.round(cw * shiftRatio);

    const extraW = dw - cw;
    const centeredX = Math.round(-extraW / 2);
    const dx = centeredX + shiftX;

    // Shift background image a little bit downside so the subject sits comfortably below the header
    const shiftYRatio = isMobile ? 0.04 : (window.innerWidth >= 1024 ? 0.08 : 0.06);
    const shiftY = Math.round(Math.max(50, ch * shiftYRatio));

    // On wide viewports where dh > ch, bias slightly towards top before downward shift so head is never cut off
    const extraH = dh - ch;
    const topBiasedY = Math.min(0, Math.round(-extraH * 0.2));
    const dy = topBiasedY + shiftY;

    // 1. Fill entire canvas background with deep wine red (#5d0003) matching frame edges
    ctx.fillStyle = '#5d0003';
    ctx.fillRect(0, 0, cw, ch);

    // 2. Hardware-accelerated high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) {
      ctx.imageSmoothingQuality = 'high';
    }

    // 3. Draw image at native un-stretched scale, shifted right and downside
    ctx.drawImage(img, dx, dy, dw, dh);

    // 4. If shifted downside (dy > 0), seamlessly fill the top gap with the matching edge color gradient
    if (dy > 0) {
      // Stretch the top 2-pixel slice of the image vertically to fill y=0 to y=dy+1
      ctx.drawImage(img, 0, 0, iw, 2, dx, 0, dw, dy + 1);

      // Feather smoothly over the boundary (20px blend) so there is zero hard seam
      const blendH = Math.min(20, dy);
      const topGrad = ctx.createLinearGradient(0, dy - blendH, 0, dy + blendH);
      topGrad.addColorStop(0, 'rgba(93, 0, 3, 0.2)');
      topGrad.addColorStop(1, 'rgba(93, 0, 3, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(dx, dy - blendH, dw, blendH * 2);

      // Fill empty corners if image is shifted horizontally
      if (dx > 0) {
        ctx.fillStyle = '#5d0003';
        ctx.fillRect(0, 0, dx, dy + 1);
      }
      if (dx + dw < cw) {
        ctx.fillStyle = '#5d0003';
        ctx.fillRect(dx + dw, 0, cw - (dx + dw), dy + 1);
      }
    }

    // 5. If shifted right (dx > 0), seamlessly fill the left gap and feather into the image
    if (dx > 0) {
      // Solid fill for the empty gap on the left
      ctx.fillStyle = '#5d0003';
      ctx.fillRect(0, 0, dx, ch);

      // Feather smoothly over the left edge of the photograph (140px gradient)
      const blendWidth = Math.min(140, Math.round(dw * 0.1));
      const grad = ctx.createLinearGradient(dx - 1, 0, dx + blendWidth, 0);
      grad.addColorStop(0, '#5d0003');
      grad.addColorStop(0.3, 'rgba(93, 0, 3, 0.95)');
      grad.addColorStop(0.7, 'rgba(93, 0, 3, 0.5)');
      grad.addColorStop(1, 'rgba(93, 0, 3, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(dx - 1, 0, blendWidth + 1, ch);
    }
  }

  function loadFrame(idx) {
    if (idx < 0 || idx >= TOTAL_FRAMES) return null;
    if (images[idx]) return images[idx];
    const img = new Image();
    const num = String(idx + 1).padStart(3, '0');
    img.onload = function () {
      const needed = Math.round(currentProgress * (TOTAL_FRAMES - 1));
      if (Math.abs(needed - idx) <= 1) {
        render(true);
      }
    };
    img.src = `ezgif-frame-${num}.jpg`;
    images[idx] = img;
    return img;
  }

  // Decode a sliding window of frames around the current scrub position into GPU memory
  function decodeNearby(centerIndex) {
    const windowSize = 8;
    const start = Math.max(0, centerIndex - windowSize);
    const end = Math.min(TOTAL_FRAMES - 1, centerIndex + windowSize);

    for (let i = start; i <= end; i++) {
      if (!images[i]) {
        loadFrame(i);
      }
      const img = images[i];
      if (img && img.complete && img.naturalWidth > 0 && !decodingSet.has(i)) {
        decodingSet.add(i);
        if (img.decode) {
          img.decode().then(function () {
            const needed = Math.round(currentProgress * (TOTAL_FRAMES - 1));
            if (needed === i && lastDrawnFrame !== i) {
              render(true);
            }
          }).catch(function () {});
        }
      }
    }
  }

  // Render the current frame with closest-loaded fallback
  function render(forceRedraw) {
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
    );

    if (!forceRedraw && frameIndex === lastDrawnFrame) return;

    // 1. Direct hit if target frame is loaded
    const exact = images[frameIndex];
    if (exact && exact.complete && exact.naturalWidth > 0) {
      drawImageCover(exact);
      lastDrawnFrame = frameIndex;
      decodeNearby(frameIndex);
      return;
    }

    // 2. Outward search for closest loaded frame
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const p = frameIndex - offset;
      if (p >= 0 && images[p] && images[p].complete && images[p].naturalWidth > 0) {
        drawImageCover(images[p]);
        lastDrawnFrame = -1;
        decodeNearby(frameIndex);
        return;
      }
      const n = frameIndex + offset;
      if (n < TOTAL_FRAMES && images[n] && images[n].complete && images[n].naturalWidth > 0) {
        drawImageCover(images[n]);
        lastDrawnFrame = -1;
        decodeNearby(frameIndex);
        return;
      }
    }
  }

  function updateActiveNav() {
    const scrollPos = (window.pageYOffset || document.documentElement.scrollTop || 0) + 160;
    let currentId = 'hero';
    sections.forEach(function (sec) {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Continuous animation loop with LERP smoothing
  function loop() {
    targetProgress = getScrollProgress();

    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * 0.12;
    } else {
      currentProgress = targetProgress;
    }

    render(false);

    // Header glassmorphism on scroll
    const st = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (siteHeader) {
      if (st > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    updateActiveNav();
    requestAnimationFrame(loop);
  }

  // Canvas resize with Device Pixel Ratio for Retina/HiDPI
  function handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) {
      ctx.imageSmoothingQuality = 'high';
    }
    render(true);
  }

  // Ensure all autoplay videos play seamlessly across all modern browsers
  function ensureVideosAutoplay() {
    const vids = document.querySelectorAll('video[autoplay]');
    vids.forEach(function (vid) {
      vid.muted = true;
      vid.playsInline = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(function () {
          const resumeOnInteraction = function () {
            vid.play().catch(function () {});
            window.removeEventListener('click', resumeOnInteraction);
            window.removeEventListener('scroll', resumeOnInteraction);
            window.removeEventListener('touchstart', resumeOnInteraction);
          };
          window.addEventListener('click', resumeOnInteraction, { once: true, passive: true });
          window.addEventListener('scroll', resumeOnInteraction, { once: true, passive: true });
          window.addEventListener('touchstart', resumeOnInteraction, { once: true, passive: true });
        });
      }
    });
  }

  function init() {
    handleResize();
    window.addEventListener('resize', handleResize);

    // Preload first 6 frames immediately so initial render is instant
    for (let i = 0; i < Math.min(6, TOTAL_FRAMES); i++) {
      loadFrame(i);
    }

    // Preload remaining frames smoothly in idle batches so network pipeline is never clogged
    let preloadIdx = 6;
    function preloadNextBatch() {
      if (preloadIdx >= TOTAL_FRAMES) return;
      const batchEnd = Math.min(preloadIdx + 4, TOTAL_FRAMES);
      for (; preloadIdx < batchEnd; preloadIdx++) {
        loadFrame(preloadIdx);
      }
      if (preloadIdx < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(preloadNextBatch, { timeout: 200 });
        } else {
          setTimeout(preloadNextBatch, 80);
        }
      }
    }
    setTimeout(preloadNextBatch, 400);

    currentProgress = getScrollProgress();
    targetProgress = currentProgress;
    requestAnimationFrame(loop);

    ensureVideosAutoplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
