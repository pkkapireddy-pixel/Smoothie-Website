/**
 * Rubik's Cube Choreography Spec
 * - Vertical Rotation Phase (0s to 6s): Smooth vertical tumble visiting Side 1 -> Side 4 -> Side 6 -> Side 2
 * - Horizontal Rotation Phase (6s to 12s): Smooth horizontal spin visiting Side 2 -> Side 5 -> Side 3 -> Side 1
 * - 12.0-second loop (720 frames at 60 FPS) — slightly increased speed while remaining silky-smooth
 * - Coordinated slice layer twists with net zero accumulation
 */
window.RUBIK_ROTATION_SPEC = {
  meta: {
    version: "1.4.0",
    description: "3D Rubik's Cube choreography: Vertical roll (Side 1 -> 4 -> 6 -> 2) and Horizontal spin (Side 2 -> 5 -> 3 -> 1)",
    video: {
      fps: 60
    },
    loop: {
      frames: 720,
      duration_seconds: 12.0
    }
  },
  cube: {
    size: 3,
    euler_order: "YXZ",
    home_view_euler_deg: {
      x: 0,
      y: -15,
      z: 0
    }
  },
  global_rotation: {
    easing: "easeInOutSine",
    keyframes: [
      {
        frame: 0,
        x: 0,
        y: -15,
        z: 0,
        motion: "Vertical Roll Start - Side 1 (Front)"
      },
      {
        frame: 120,
        x: -90,
        y: -15,
        z: 0,
        motion: "Vertical Roll - Side 4 (Bottom)"
      },
      {
        frame: 240,
        x: -180,
        y: -15,
        z: 0,
        motion: "Vertical Roll - Side 6 (Back)"
      },
      {
        frame: 360,
        x: -270,
        y: -15,
        z: 0,
        motion: "Vertical Roll - Side 2 (Top)"
      },
      {
        frame: 480,
        x: -345,
        y: 75,
        z: 0,
        motion: "Horizontal Spin - Side 5 (Left)"
      },
      {
        frame: 600,
        x: -345,
        y: -105,
        z: 0,
        motion: "Horizontal Spin - Side 3 (Right)"
      },
      {
        frame: 720,
        x: -360,
        y: -15,
        z: 0,
        motion: "Horizontal Spin Return - Side 1 (Front)"
      }
    ]
  },
  layer_moves: [
    {
      axis: "y",
      layer: 1,
      angle_deg: 90,
      start_frame: 60,
      end_frame: 100,
      easing: "easeInOutCubic"
    },
    {
      axis: "x",
      layer: 1,
      angle_deg: 90,
      start_frame: 180,
      end_frame: 220,
      easing: "easeInOutCubic"
    },
    {
      axis: "y",
      layer: -1,
      angle_deg: 90,
      start_frame: 300,
      end_frame: 340,
      easing: "easeInOutCubic"
    },
    {
      axis: "y",
      layer: 1,
      angle_deg: -90,
      start_frame: 420,
      end_frame: 460,
      easing: "easeInOutCubic"
    },
    {
      axis: "x",
      layer: 1,
      angle_deg: -90,
      start_frame: 540,
      end_frame: 580,
      easing: "easeInOutCubic"
    },
    {
      axis: "y",
      layer: -1,
      angle_deg: -90,
      start_frame: 660,
      end_frame: 700,
      easing: "easeInOutCubic"
    }
  ]
};
