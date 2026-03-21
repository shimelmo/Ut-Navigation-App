import AsyncStorage from "@react-native-async-storage/async-storage";

export const SETTINGS_KEY = "user_settings";

export type UserSettings = {
  darkMode: boolean;
  showCourseColors: boolean;
};

export const defaultSettings: UserSettings = {
  darkMode: false,
  showCourseColors: true,
};

export const loadUserSettings = async (): Promise<UserSettings> => {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);

    if (!stored) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...JSON.parse(stored),
    };
  } catch (error) {
    console.log("Could not load user settings:", error);
    return defaultSettings;
  }
};

export const saveUserSettings = async (settings: UserSettings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.log("Could not save user settings:", error);
  }
};

export const appThemes = {
  light: {
    screenBg: "#edf4ff",
    cardBg: "#ffffff",
    cardBorder: "#d8e3f6",

    headerBg: "#efe9ff",
    headerBorder: "#ddd2ff",
    headerTitle: "#4d3c87",
    headerText: "#6b5c98",

    title: "#183a6b",
    text: "#516b91",
    subtext: "#5e7698",

    inputBg: "#f7faff",
    inputBorder: "#d8e3f6",
    inputText: "#183a6b",

    bubbleBg: "#f7faff",
    bubbleBorder: "#d8e3f6",

    buttonBg: "#dcecff",
    buttonBorder: "#234a84",
    buttonText: "#183a6b",

    softCardBg: "#f8f5ff",
    softCardBorder: "#e2daf8",
    softTitle: "#4d3c87",
    softText: "#6b5c98",

    infoBg: "#fff9eb",
    infoBorder: "#f1e2b5",
    infoTitle: "#5d4c16",
    infoText: "#735f22",

    dangerBg: "#ffe6e6",
    dangerBorder: "#e2aaaa",
    dangerText: "#8a2f2f",
  },

  dark: {
    screenBg: "#111827",
    cardBg: "#1f2937",
    cardBorder: "#334155",

    headerBg: "#312e81",
    headerBorder: "#4c4aa3",
    headerTitle: "#ede9fe",
    headerText: "#d1d5db",

    title: "#e5eefc",
    text: "#cbd5e1",
    subtext: "#94a3b8",

    inputBg: "#0f172a",
    inputBorder: "#334155",
    inputText: "#e5eefc",

    bubbleBg: "#172033",
    bubbleBorder: "#334155",

    buttonBg: "#1d4ed8",
    buttonBorder: "#60a5fa",
    buttonText: "#eff6ff",

    softCardBg: "#2a223d",
    softCardBorder: "#4b3d68",
    softTitle: "#f5f3ff",
    softText: "#d8d0ee",

    infoBg: "#3a2f19",
    infoBorder: "#6b5724",
    infoTitle: "#fde68a",
    infoText: "#fef3c7",

    dangerBg: "#4b1d1d",
    dangerBorder: "#7f1d1d",
    dangerText: "#fecaca",
  },
};