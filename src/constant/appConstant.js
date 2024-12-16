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
        area: 1000,
      },
      value: 400,
    },
    opacity: {
      value: 0.4,
    },
    shape: {
      type: ["circle", "triangle", "image"],
    },
    size: {
      value: { min: 3, max: 7 },
    },
  },
  detectRetina: false,
};

// GEMINI
export const GEMINI_1_0_PRO = "gemini-1.0-pro";
export const GEMINI_1_5_FLASH = "gemini-1.5-flash";
export const GEMINI_1_5_FLASH_002 = "gemini-1.5-flash-002";
export const GEMINI_1_5_FLASH_LATEST = "gemini-1.5-flash-latest";
export const GEMINI_1_5_PRO = "gemini-1.5-pro";
export const GEMINI_1_5_PRO_002 = "gemini-1.5-pro-002";
export const GEMINI_1_5_PRO_LATEST = "gemini-1.5-pro-latest";
export const GEMINI_PRO = "gemini-pro";

// HUGGING FACE
export const FLUX_1_SCHNELL = "black-forest-labs/FLUX.1-schnell";
export const STABLE_DIFFUSION = "stabilityai/stable-diffusion-3.5-large";

export const ALL_MODELS_ARRAY = [
  // GEMINI_1_0_PRO,
  GEMINI_1_5_FLASH,
  // GEMINI_1_5_FLASH_002,
  GEMINI_1_5_FLASH_LATEST,
  GEMINI_1_5_PRO,
  // GEMINI_1_5_PRO_002,
  GEMINI_1_5_PRO_LATEST,
  // GEMINI_PRO,
];

export const GEMINI_MODELS_OPTIONS = [
  // {
  //   label: GEMINI_1_0_PRO,
  //   value: GEMINI_1_0_PRO,
  // },
  {
    label: GEMINI_1_5_FLASH,
    value: GEMINI_1_5_FLASH,
  },
  // {
  //   label: GEMINI_1_5_FLASH_002,
  //   value: GEMINI_1_5_FLASH_002,
  // },
  {
    label: GEMINI_1_5_FLASH_LATEST,
    value: GEMINI_1_5_FLASH_LATEST,
  },
  {
    label: GEMINI_1_5_PRO,
    value: GEMINI_1_5_PRO,
  },
  // {
  //   label: GEMINI_1_5_PRO_002,
  //   value: GEMINI_1_5_PRO_002,
  // },
  {
    label: GEMINI_1_5_PRO_LATEST,
    value: GEMINI_1_5_PRO_LATEST,
  },
  // {
  //   label: GEMINI_PRO,
  //   value: GEMINI_PRO,
  // },
];

export const INTELLIHUB_SELECTED_MODEL = "intellihub_selected_model";

export const ROLE_USER = "user";
export const ROLE_ASSISTANT = "assistant";

export const PUBLIC_ROUTES = ["/login", "/"];

export const CHATS_PER_PAGE = 5;

export const GREETINGS_KEYWORDS = ["hello", "hi", "hey", "greetings"];

export const COLLECTION_NAMES = {
  CHATS: "chats",
  USERS: "users",
};
