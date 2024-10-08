export const USER_ACCESS_TOKEN = "intellihub_ai_user_access_token";
export const USER_DATA = "intellihub_ai_user_data";

export const TS_PARTICLES_OPTIONS = {
  background: {
    color: {
      value: "#000000",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: false,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 100,
      enable: true,
      opacity: 0.6,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: 15,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 700,
    },
    opacity: {
      value: 0.1,
    },
    shape: {
      type: ["circle", "triangle", "image"],
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: false,
};

export const GEMINI_1_5_FLASH = "gemini-1.5-flash";
export const GEMINI_1_5_PRO = "gemini-1.5-pro";
export const GEMINI_1_0_PRO = "gemini-1.0-pro";
export const TEXT_EMBEDDING_004 = "text-embedding-004";
export const AQA = "aqa";

export const ALL_MODELS_ARRAY = [
  GEMINI_1_5_FLASH,
  GEMINI_1_5_PRO,
  GEMINI_1_0_PRO,
  TEXT_EMBEDDING_004,
  AQA,
];

export const INTELLIHUB_SELECTED_MODEL = "intellihub_selected_model";
