/**
 * 3D Rubik's Cube Interactive Showcase for About Me Section
 * - 6 Faces mapped to Card 1-6 Works (Motion Graphics, Graphic Design, Video Editing, Logo Design, Packaging, Color Grading)
 * - Automatic 5-second media cycling per category with smooth crossfade
 * - 100% self-contained & origin-clean: loaded from window.CUBE_ASSETS (Base64 JPEG)
 * - Zero CORS taint: works flawlessly on both file:/// and http://localhost:8080/
 * - Realistic 3D slice twisting engine (cubic smoothstep easing) & continuous isometric tumbling
 * - Interactive mouse parallax tilt
 * - Dark crimson wine-red atmosphere matching website palette (no rainbow colors)
 * - Built-in automated CSS 3D fallback for environments where WebGL is unavailable
 */
(function () {
  'use strict';

  let retryCount = 0;
  const MAX_RETRIES = 60; // 3 seconds at 50ms intervals

  function bootstrap() {
    window.__rubiksDebug = { bootstrapped: true, time: Date.now() };
    const container = document.getElementById('aboutCubeBox');
    const canvas = document.getElementById('rubiksCubeCanvas');

    if (!container || !canvas || typeof THREE === 'undefined' || !window.CUBE_ASSETS) {
      window.__rubiksDebug.waiting = {
        hasContainer: !!container,
        hasCanvas: !!canvas,
        hasThree: typeof THREE !== 'undefined',
        hasAssets: !!window.CUBE_ASSETS,
        retry: retryCount
      };
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(bootstrap, 50);
      } else {
        // If Three.js or assets didn't load in time, activate CSS 3D fallback
        activateCssFallback(container);
      }
      return;
    }

    try {
      window.__rubiksDebug.initCalled = true;
      initRubiksCube(container, canvas);
      window.__rubiksDebug.initSuccess = true;
    } catch (err) {
      window.__rubiksDebug.initError = err.toString() + '\n' + (err.stack || '');
      console.error('[RubiksCube] WebGL initialization error:', err);
      activateCssFallback(container);
    }
  }

  // ---------------------------------------------------------------------------
  // 1. WebGL 3D Rubik's Cube Implementation
  // ---------------------------------------------------------------------------
  function initRubiksCube(container, canvas) {
    const rawAssets = window.CUBE_ASSETS || [];

    // Channel Metadata matching Cards 1 to 6
    // Three.js BoxGeometry face mapping:
    // Face 0: +X (Right)  -> Card 3: Video Editing
    // Face 1: -X (Left)   -> Card 2 (Angle B): Graphic Design (Brand & Editorial)
    // Face 2: +Y (Top)    -> Card 2 (Angle A): Graphic Design (Posters & Media)
    // Face 3: -Y (Bottom) -> Card 4: Logo Design
    // Face 4: +Z (Front)  -> Card 1: Motion Graphics
    // Face 5: -Z (Back)   -> Card 6: Color Grading
    const CHANNELS = [
      {
        id: 0,
        name: 'Video Editing',
        tag: 'Cinematic Cuts & Reels',
        bgColor: '#380006',
        accentColor: '#e63946',
        frames: (rawAssets[0] && rawAssets[0].frames) || []
      },
      {
        id: 1,
        name: 'Graphic Design',
        tag: 'Brand & Editorial',
        bgColor: '#2a001a',
        accentColor: '#d90429',
        frames: (rawAssets[1] && rawAssets[1].frames) || []
      },
      {
        id: 2,
        name: 'Graphic Design',
        tag: 'Posters & Media',
        bgColor: '#220800',
        accentColor: '#f77f00',
        frames: (rawAssets[2] && rawAssets[2].frames) || []
      },
      {
        id: 3,
        name: 'Logo Design',
        tag: 'Brand Identity',
        bgColor: '#001816',
        accentColor: '#2a9d8f',
        frames: (rawAssets[3] && rawAssets[3].frames) || []
      },
      {
        id: 4,
        name: 'Motion Graphics',
        tag: '3D VFX & Animation',
        bgColor: '#050024',
        accentColor: '#7209b7',
        frames: (rawAssets[4] && rawAssets[4].frames) || []
      },
      {
        id: 5,
        name: 'Color Grading',
        tag: 'DaVinci Tone',
        bgColor: '#1c0020',
        accentColor: '#9d0208',
        frames: (rawAssets[5] && rawAssets[5].frames) || []
      }
    ];

    // Preload all frames as origin-clean HTMLImageElement objects
    CHANNELS.forEach(function (ch) {
      ch.preloaded = [];
      ch.frames.forEach(function (src) {
        const img = new Image();
        img.src = src;
        ch.preloaded.push(img);
      });
      ch.currentIdx = 0;
      ch.isFading = false;
      ch.fadeStart = 0;
      ch.currentImg = ch.preloaded[0] || null;
      ch.targetImg = null;
    });

    // Helper: draw media cover on 512x512 face canvas
    function drawCover(ctx, img, alpha) {
      if (!img || !img.complete || img.naturalWidth === 0) return false;
      const mw = img.naturalWidth;
      const mh = img.naturalHeight;
      const cw = 512, ch = 512;
      const scale = Math.max(cw / mw, ch / mh);
      const dw = mw * scale;
      const dh = mh * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
      return true;
    }

    // Render an entire 512x512 face sticker
    function renderFace(ch) {
      const ctx = ch.ctx;
      ctx.clearRect(0, 0, 512, 512);

      // Deep velvet crimson / obsidian base matching portfolio palette
      const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 320);
      grad.addColorStop(0, ch.accentColor || '#7d0d12');
      grad.addColorStop(1, ch.bgColor || '#120103');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      let drawn = false;
      if (ch.isFading && ch.targetImg) {
        const elapsed = Math.min(1, (performance.now() - ch.fadeStart) / 600);
        if (ch.currentImg) {
          drawCover(ctx, ch.currentImg, 1 - elapsed);
        }
        drawn = drawCover(ctx, ch.targetImg, elapsed);
      } else if (ch.currentImg) {
        drawn = drawCover(ctx, ch.currentImg, 1.0);
      }

      // If no image loaded, subtle ambient glow
      if (!drawn) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            ctx.fillRect(c * 170.6 + 6, r * 170.6 + 6, 170.6 - 12, 170.6 - 12);
          }
        }
        ctx.restore();
      }

      // Rubik's cube sticker bevel grid lines (separating the 3x3 tiles)
      ctx.strokeStyle = 'rgba(12, 1, 3, 0.96)';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(170.6, 0); ctx.lineTo(170.6, 512);
      ctx.moveTo(341.3, 0); ctx.lineTo(341.3, 512);
      ctx.moveTo(0, 170.6); ctx.lineTo(512, 170.6);
      ctx.moveTo(0, 341.3); ctx.lineTo(512, 341.3);
      ctx.stroke();

      // Sleek crystal specular bevel on inner block edges
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(172, 0); ctx.lineTo(172, 512);
      ctx.moveTo(343, 0); ctx.lineTo(343, 512);
      ctx.moveTo(0, 172); ctx.lineTo(512, 172);
      ctx.moveTo(0, 343); ctx.lineTo(512, 343);
      ctx.stroke();
    }

    // Initialize 2D Face Canvases & Three.js CanvasTextures
    CHANNELS.forEach(function (ch) {
      ch.canvas = document.createElement('canvas');
      ch.canvas.width = 512;
      ch.canvas.height = 512;
      ch.ctx = ch.canvas.getContext('2d');

      renderFace(ch);

      ch.texture = new THREE.CanvasTexture(ch.canvas);
      ch.texture.minFilter = THREE.LinearFilter;
      ch.texture.magFilter = THREE.LinearFilter;
      if (THREE.sRGBEncoding) {
        ch.texture.encoding = THREE.sRGBEncoding;
      }
      ch.texture.needsUpdate = true;
    });

    // Cycle all 6 sides every 5 seconds (smooth crossfade)
    function cycleMedia() {
      CHANNELS.forEach(function (ch) {
        if (!ch.preloaded || ch.preloaded.length <= 1) return;
        const nextIdx = (ch.currentIdx + 1) % ch.preloaded.length;
        ch.currentIdx = nextIdx;
        ch.targetImg = ch.preloaded[nextIdx];
        ch.fadeStart = performance.now();
        ch.isFading = true;
      });
    }
    const cycleInterval = setInterval(cycleMedia, 5000);

    // ---------------------------------------------------------------------------
    // 2. Three.js Scene Setup (Centered Camera for True Vertical & Horizontal Motion)
    // ---------------------------------------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    // Camera elevated slightly (y = 1.2) to showcase top bevel, centered horizontally (x = 0)
    // Distance 7.2 gives generous headroom so corners never clip during smooth turns
    camera.position.set(0, 1.2, 7.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'default',
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // Lighting (Warm Studio Specular matching crimson palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight1.position.set(5, 7, 6);
    scene.add(dirLight1);

    // Deep crimson / wine backlight
    const wineBacklight = new THREE.PointLight(0xff1e3a, 1.3, 16);
    wineBacklight.position.set(-4, -4, 4);
    scene.add(wineBacklight);

    // Pure neutral rim highlight
    const rimLight = new THREE.PointLight(0xffffff, 0.8, 14);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Master Hierarchy (Calibrated Scale - Fits 100% Within Card Frame at All Angles)
    const sceneRoot = new THREE.Group();
    sceneRoot.scale.set(0.80, 0.80, 0.80);
    scene.add(sceneRoot);

    const mainCubeGroup = new THREE.Group();
    sceneRoot.add(mainCubeGroup);

    const pivotGroup = new THREE.Group();
    mainCubeGroup.add(pivotGroup);

    // ---------------------------------------------------------------------------
    // 3. 3x3x3 Rubik's Cube Construction & UV Face Slicing
    // ---------------------------------------------------------------------------
    const cubieSize = 0.94;
    const cubes = [];

    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x120305,
      roughness: 0.25,
      metalness: 0.35
    });

    const faceMaterials = CHANNELS.map(function (ch) {
      return new THREE.MeshStandardMaterial({
        map: ch.texture,
        roughness: 0.16,
        metalness: 0.08
      });
    });

    function setFaceUV(geom, faceIdx, u0, u1, v0, v1) {
      const uv = geom.attributes.uv;
      const off = faceIdx * 8;
      uv.array[off + 0] = u0; uv.array[off + 1] = v1;
      uv.array[off + 2] = u1; uv.array[off + 3] = v1;
      uv.array[off + 4] = u0; uv.array[off + 5] = v0;
      uv.array[off + 6] = u1; uv.array[off + 7] = v0;
      uv.needsUpdate = true;
    }

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue; // Skip inner core

          const geom = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

          // Face 0: +X (Right, Video Editing)
          let m0 = innerMaterial;
          if (x === 1) {
            m0 = faceMaterials[0];
            setFaceUV(geom, 0, (1 - z) / 3, (2 - z) / 3, (y + 1) / 3, (y + 2) / 3);
          }

          // Face 1: -X (Left, Packaging Design)
          let m1 = innerMaterial;
          if (x === -1) {
            m1 = faceMaterials[1];
            setFaceUV(geom, 1, (z + 1) / 3, (z + 2) / 3, (y + 1) / 3, (y + 2) / 3);
          }

          // Face 2: +Y (Top, Graphic Design)
          let m2 = innerMaterial;
          if (y === 1) {
            m2 = faceMaterials[2];
            setFaceUV(geom, 2, (x + 1) / 3, (x + 2) / 3, (1 - z) / 3, (2 - z) / 3);
          }

          // Face 3: -Y (Bottom, Logo Design)
          let m3 = innerMaterial;
          if (y === -1) {
            m3 = faceMaterials[3];
            setFaceUV(geom, 3, (x + 1) / 3, (x + 2) / 3, (z + 1) / 3, (z + 2) / 3);
          }

          // Face 4: +Z (Front, Motion Graphics)
          let m4 = innerMaterial;
          if (z === 1) {
            m4 = faceMaterials[4];
            setFaceUV(geom, 4, (x + 1) / 3, (x + 2) / 3, (y + 1) / 3, (y + 2) / 3);
          }

          // Face 5: -Z (Back, Color Grading)
          let m5 = innerMaterial;
          if (z === -1) {
            m5 = faceMaterials[5];
            setFaceUV(geom, 5, (1 - x) / 3, (2 - x) / 3, (y + 1) / 3, (y + 2) / 3);
          }

          const cubie = new THREE.Mesh(geom, [m0, m1, m2, m3, m4, m5]);
          cubie.position.set(x, y, z);
          cubie.userData.grid = { x: x, y: y, z: z };
          cubes.push(cubie);
          mainCubeGroup.add(cubie);
        }
      }
    }

    // ---------------------------------------------------------------------------
    // 4. Rubik Rotation Engine (Driven by rubik_rotation.json spec)
    // ---------------------------------------------------------------------------
    const ease = {
      linear: t => t,
      easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
      easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    };
    const rad = d => d * Math.PI / 180;

    const RUBIK_ROTATION_SPEC = (typeof window !== 'undefined' && window.RUBIK_ROTATION_SPEC) ? window.RUBIK_ROTATION_SPEC : {
      meta: {
        video: { fps: 60 },
        loop: { frames: 720, duration_seconds: 12.0 }
      },
      cube: {
        size: 3,
        euler_order: 'YXZ',
        home_view_euler_deg: { x: 0, y: -15, z: 0 }
      },
      global_rotation: {
        easing: 'easeInOutSine',
        keyframes: [
          { frame: 0, x: 0, y: -15, z: 0, motion: 'Vertical Roll Start - Side 1 (Front)' },
          { frame: 120, x: -90, y: -15, z: 0, motion: 'Vertical Roll - Side 4 (Bottom)' },
          { frame: 240, x: -180, y: -15, z: 0, motion: 'Vertical Roll - Side 6 (Back)' },
          { frame: 360, x: -270, y: -15, z: 0, motion: 'Vertical Roll - Side 2 (Top)' },
          { frame: 480, x: -345, y: 75, z: 0, motion: 'Horizontal Spin - Side 5 (Left)' },
          { frame: 600, x: -345, y: -105, z: 0, motion: 'Horizontal Spin - Side 3 (Right)' },
          { frame: 720, x: -360, y: -15, z: 0, motion: 'Horizontal Spin Return - Side 1 (Front)' }
        ]
      },
      layer_moves: [
        { axis: 'y', layer: 1, angle_deg: 90, start_frame: 60, end_frame: 100, easing: 'easeInOutCubic' },
        { axis: 'x', layer: 1, angle_deg: 90, start_frame: 180, end_frame: 220, easing: 'easeInOutCubic' },
        { axis: 'y', layer: -1, angle_deg: 90, start_frame: 300, end_frame: 340, easing: 'easeInOutCubic' },
        { axis: 'y', layer: 1, angle_deg: -90, start_frame: 420, end_frame: 460, easing: 'easeInOutCubic' },
        { axis: 'x', layer: 1, angle_deg: -90, start_frame: 540, end_frame: 580, easing: 'easeInOutCubic' },
        { axis: 'y', layer: -1, angle_deg: -90, start_frame: 660, end_frame: 700, easing: 'easeInOutCubic' }
      ]
    };

    function makeApplier(THREE, spec, root, cubies) {
      const fps = spec.meta.video.fps, loopFrames = spec.meta.loop.frames;
      const kf = spec.global_rotation.keyframes;
      const gE = ease[spec.global_rotation.easing] || ease.easeInOutSine;
      const initialBase = new Map(cubies.map(c => [c, { p: c.position.clone(), q: c.quaternion.clone() }]));
      const initialGrid = new Map(cubies.map(c => [c, { x: c.userData.grid.x, y: c.userData.grid.y, z: c.userData.grid.z }]));
      const base = new Map(cubies.map(c => [c, { p: c.position.clone(), q: c.quaternion.clone() }]));
      const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

      function c_markGrid(cs, m, q) {
        cs.forEach(c => {
          if (Math.round(c.userData.grid[m.axis]) === m.layer) {
            const g = new THREE.Vector3(c.userData.grid.x, c.userData.grid.y, c.userData.grid.z).applyQuaternion(q);
            c.userData.grid = { x: Math.round(g.x), y: Math.round(g.y), z: Math.round(g.z) };
          }
        });
      }

      return function update(timeSeconds, spacing = 1) {
        const f = (timeSeconds * fps) % loopFrames;

        // 1) Global tumble (3s vertical roll, 3s horizontal spin)
        let i = kf.findIndex(k => k.frame > f);
        if (i < 1) i = kf.length - 1;
        const a = kf[i - 1], b = kf[i];
        const span = b.frame - a.frame || 1;
        const t = gE(Math.max(0, Math.min(1, (f - a.frame) / span)));
        const L = (p) => rad(a[p] + (b[p] - a[p]) * t);
        root.rotation.set(L('x'), L('y'), L('z'), spec.cube.euler_order);

        // 2) Layer moves (deterministic evaluation from base state)
        cubies.forEach(c => {
          const s = initialBase.get(c);
          c.position.copy(s.p);
          c.quaternion.copy(s.q);
          const g = initialGrid.get(c);
          c.userData.grid = { x: g.x, y: g.y, z: g.z };
          const bItem = base.get(c);
          bItem.p.copy(s.p);
          bItem.q.copy(s.q);
        });

        for (const m of spec.layer_moves) {
          if (f < m.start_frame) break;
          const spanMove = m.end_frame - m.start_frame || 1;
          const u = Math.min(1, Math.max(0, (f - m.start_frame) / spanMove));
          const ang = rad(m.angle_deg) * (ease[m.easing] ? ease[m.easing](u) : u);
          if (ang !== 0) {
            const q = new THREE.Quaternion().setFromAxisAngle(AX[m.axis], ang);
            cubies.filter(c => Math.round(c.userData.grid[m.axis]) === m.layer).forEach(c => {
              c.position.applyQuaternion(q);
              c.quaternion.premultiply(q);
            });
            // After a move completes, bake it so subsequent moves in this frame see the updated layout
            if (u >= 1) {
              cubies.forEach(c => {
                const s = base.get(c);
                s.p.copy(c.position);
                s.q.copy(c.quaternion);
              });
              c_markGrid(cubies, m, q);
            }
          }
        }
      };
    }

    const applyRubikRotation = makeApplier(THREE, RUBIK_ROTATION_SPEC, mainCubeGroup, cubes);

    // ---------------------------------------------------------------------------
    // 5. Interactive Mouse Parallax Tilt & Click
    // ---------------------------------------------------------------------------
    let mouseTiltX = 0, mouseTiltY = 0;
    let targetTiltX = 0, targetTiltY = 0;

    container.addEventListener('mousemove', function (e) {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetTiltY = nx * 0.35;
      targetTiltX = -ny * 0.35;
    });

    container.addEventListener('mouseleave', function () {
      targetTiltX = 0;
      targetTiltY = 0;
    });

    container.addEventListener('click', function () {
      // Interactive click feedback
    });

    // ---------------------------------------------------------------------------
    // 6. Responsive Resize
    // ---------------------------------------------------------------------------
    function handleResize() {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 424;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    handleResize();
    window.addEventListener('resize', handleResize);

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(function () {
        handleResize();
      });
      ro.observe(container);
    }

    // ---------------------------------------------------------------------------
    // 7. 60 FPS Render Loop
    // ---------------------------------------------------------------------------
    let frameCount = 0;
    function animate() {
      requestAnimationFrame(animate);
      window.__rubiksDebug.frameCount = ++frameCount;

      const now = performance.now();
      const time = now * 0.001;

      // A. Update Canvas Textures when fading between images
      CHANNELS.forEach(function (ch) {
        if (ch.isFading) {
          const elapsed = (now - ch.fadeStart) / 600;
          if (elapsed >= 1) {
            ch.currentImg = ch.targetImg;
            ch.targetImg = null;
            ch.isFading = false;
          }
          renderFace(ch);
          ch.texture.needsUpdate = true;
        }
      });

      // B. Rubik's Cube Animation (Rotation + Layer Moves from JSON Spec Applier)
      applyRubikRotation(time);

      // C. Smooth Interactive Mouse Tilt
      mouseTiltX += (targetTiltX - mouseTiltX) * 0.08;
      mouseTiltY += (targetTiltY - mouseTiltY) * 0.08;
      sceneRoot.rotation.x = mouseTiltX;
      sceneRoot.rotation.y = mouseTiltY;

      try {
        renderer.render(scene, camera);
      } catch (renderErr) {
        console.warn('[RubiksCube] Render error:', renderErr);
      }
    }

    animate();
  }

  // ---------------------------------------------------------------------------
  // 8. Automated CSS 3D Cube Fallback (100% Visual Reliability Guarantee)
  // ---------------------------------------------------------------------------
  function activateCssFallback(container) {
    if (!container || container.querySelector('.css-cube-wrap')) return;
    console.log('[RubiksCube] Activating responsive CSS 3D Rubik Showcase fallback');

    const rawAssets = window.CUBE_ASSETS || [];
    const faces = [
      { name: 'Video Editing', cls: 'css-face-front', frames: (rawAssets[0] && rawAssets[0].frames) || [] },
      { name: 'Graphic Design', cls: 'css-face-back', frames: (rawAssets[1] && rawAssets[1].frames) || [] },
      { name: 'Graphic Design', cls: 'css-face-top', frames: (rawAssets[2] && rawAssets[2].frames) || [] },
      { name: 'Logo Design', cls: 'css-face-bottom', frames: (rawAssets[3] && rawAssets[3].frames) || [] },
      { name: 'Motion Graphics', cls: 'css-face-left', frames: (rawAssets[4] && rawAssets[4].frames) || [] },
      { name: 'Color Grading', cls: 'css-face-right', frames: (rawAssets[5] && rawAssets[5].frames) || [] }
    ];

    const wrap = document.createElement('div');
    wrap.className = 'css-cube-wrap';
    wrap.innerHTML = `
      <div class="css-cube-scene">
        <div class="css-cube-body" id="cssCubeBody">
          ${faces.map(f => `
            <div class="css-cube-face ${f.cls}" data-name="${f.name}">
              <div class="css-face-img" style="background-image: url('${f.frames[0] || ''}');"></div>
              <div class="css-face-grid"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Append fallback styles if not already present
    if (!document.getElementById('cssCubeStyles')) {
      const style = document.createElement('style');
      style.id = 'cssCubeStyles';
      style.textContent = `
        .css-cube-wrap {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          perspective: 900px; pointer-events: none; z-index: 3;
        }
        .css-cube-scene {
          width: 250px; height: 250px; transform-style: preserve-3d;
        }
        .css-cube-body {
          width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
          animation: cssCubeTumble 12s ease-in-out infinite;
        }
        @keyframes cssCubeTumble {
          0%      { transform: rotateX(0deg) rotateY(-15deg); }
          16.66%  { transform: rotateX(-90deg) rotateY(-15deg); }
          33.33%  { transform: rotateX(-180deg) rotateY(-15deg); }
          50.0%   { transform: rotateX(-270deg) rotateY(-15deg); }
          66.66%  { transform: rotateX(-345deg) rotateY(75deg); }
          83.33%  { transform: rotateX(-345deg) rotateY(-105deg); }
          100%    { transform: rotateX(-360deg) rotateY(-15deg); }
        }
        .css-cube-face {
          position: absolute; width: 250px; height: 250px;
          border-radius: 16px; overflow: hidden;
          background: #140103; border: 2px solid rgba(255,255,255,0.22);
          box-shadow: inset 0 0 25px rgba(0,0,0,0.85);
        }
        .css-face-img {
          width: 100%; height: 100%; background-size: cover; background-position: center;
          transition: background-image 0.6s ease;
        }
        .css-face-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(to right, transparent 32.5%, rgba(12,1,3,0.95) 32.5%, rgba(12,1,3,0.95) 34.5%, transparent 34.5%, transparent 65.5%, rgba(12,1,3,0.95) 65.5%, rgba(12,1,3,0.95) 67.5%, transparent 67.5%),
            linear-gradient(to bottom, transparent 32.5%, rgba(12,1,3,0.95) 32.5%, rgba(12,1,3,0.95) 34.5%, transparent 34.5%, transparent 65.5%, rgba(12,1,3,0.95) 65.5%, rgba(12,1,3,0.95) 67.5%, transparent 67.5%);
        }
        .css-face-front  { transform: rotateY(  0deg) translateZ(125px); }
        .css-face-back   { transform: rotateY(180deg) translateZ(125px); }
        .css-face-right  { transform: rotateY( 90deg) translateZ(125px); }
        .css-face-left   { transform: rotateY(-90deg) translateZ(125px); }
        .css-face-top    { transform: rotateX( 90deg) translateZ(125px); }
        .css-face-bottom { transform: rotateX(-90deg) translateZ(125px); }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(wrap);

    // 5-second image rotation for fallback
    let fallbackIdx = 0;
    setInterval(function () {
      fallbackIdx++;
      faces.forEach((f, i) => {
        if (!f.frames || f.frames.length === 0) return;
        const faceEl = wrap.querySelector(`.css-cube-face.${f.cls} .css-face-img`);
        if (faceEl) {
          const nextSrc = f.frames[fallbackIdx % f.frames.length];
          faceEl.style.backgroundImage = `url('${nextSrc}')`;
        }
      });
    }, 5000);
  }

  // Self-bootstrapping
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
