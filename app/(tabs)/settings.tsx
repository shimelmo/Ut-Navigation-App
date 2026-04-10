// Floating AI assistant button shown in bottom corner of screen
import AIBubble from "@/components/AIBubble";
// Custom top navigation tabs used throughout the app
import TopTabs from "@/components/TopTabs";
import {
  appThemes,
  defaultSettings,
  loadUserSettings,
  saveUserSettings,
  SETTINGS_KEY,
  UserSettings,
} from "@/utils/appSettings";
// AsyncStorage stores data locally on the user’s phone/device
import AsyncStorage from "@react-native-async-storage/async-storage";
// React hooks for screen state and lifecycle logic
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

// Storage key for saved courses
const SAVED_COURSES_KEY = "saved_courses";
// Storage key for remembered selected professor
const LAST_SELECTED_PROFESSOR_KEY = "last_selected_professor";

// Main Settings screen component
export default function SettingsScreen() {
  // Holds all current app settings (dark mode, course colors, etc.)
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  // Prevents saving too early before settings finish loading
  const [loaded, setLoaded] = useState(false);

  // Choose dark or light theme colors based on current darkMode setting
  const theme = settings.darkMode ? appThemes.dark : appThemes.light;

  // Runs once when screen first opens: load saved settings from storage
  useEffect(() => {
    // Pull previously saved settings from local storage
    const loadSettings = async () => {
      const saved = await loadUserSettings();
      setSettings(saved);
      setLoaded(true);
    };

    loadSettings();
  }, []);

  // Runs once when screen first opens: load saved settings from storage
  useEffect(() => {
    // Only save settings after initial loading is complete
    if (loaded) {
      saveUserSettings(settings);
    }
  }, [settings, loaded]);

  // Updates one setting switch without overwriting the others
  const updateSetting = (key: keyof UserSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Clears all locally stored app data after user confirmation
  const resetAllLocalData = () => {
    Alert.alert(
      "Reset My Local Data",
      "This clears your saved courses, selected professor, and settings on this device only.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete saved courses
              await AsyncStorage.removeItem(SAVED_COURSES_KEY);
              // Delete remembered professor
              await AsyncStorage.removeItem(LAST_SELECTED_PROFESSOR_KEY);
              // Delete saved settings
              await AsyncStorage.removeItem(SETTINGS_KEY);
              setSettings(defaultSettings);

              Alert.alert(
                "Done",
                "Your local app data has been cleared on this device."
              );
            } catch (error) {
              console.log("Could not reset local data:", error);
            }
          },
        },
      ]
    );
  };

  // Reusable mini component: one settings row with title, description, and toggle switch
  const SettingRow = ({
    title,
    description,
    value,
    onValueChange,
  }: {
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View
      style={[
        styles.settingBubble,
        {
          backgroundColor: theme.softCardBg,
          borderColor: theme.softCardBorder,
        },
      ]}
    >
      <View style={styles.settingRow}>
        <View style={styles.settingTextWrap}>
          <Text style={[styles.settingTitle, { color: theme.softTitle }]}>
            {title}
          </Text>
          <Text style={[styles.settingText, { color: theme.softText }]}>
            {description}
          </Text>
        </View>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
    </View>
  );

  // Start rendering everything visible on the Settings page
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <View style={[styles.background, { backgroundColor: theme.screenBg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top navigation tabs */}
          <TopTabs settings={settings} />

          <View
            style={[
              styles.headerCard,
              {
                backgroundColor: theme.headerBg,
                borderColor: theme.headerBorder,
              },
            ]}
          >
            <Text style={[styles.headerTitle, { color: theme.headerTitle }]}>
              Settings
            </Text>
            <Text style={[styles.headerText, { color: theme.headerText }]}>
              These settings are saved only on this device for this user.
            </Text>
          </View>

          <View
            style={[
              styles.mainCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            {/* Individual setting toggle rows below */}
            <SettingRow
              title="Dark Mode"
              description="Switch the app between light mode and dark mode."
              value={settings.darkMode}
              onValueChange={(value) => updateSetting("darkMode", value)}
            />

            {/* Individual setting toggle rows below */}
            <SettingRow
              title="Use Course Colors"
              description="Keep Monday/Wednesday and Tuesday/Thursday courses color-coded."
              value={settings.showCourseColors}
              onValueChange={(value) => updateSetting("showCourseColors", value)}
            />

            <View
              style={[
                styles.infoBubble,
                {
                  backgroundColor: theme.bubbleBg,
                  borderColor: theme.bubbleBorder,
                },
              ]}
            >
              <Text style={[styles.infoText, { color: theme.subtext }]}>
                Your settings, courses, and selected professor are stored locally
                on this device only.
              </Text>
            </View>

            <Pressable
              style={[
                styles.dangerButton,
                {
                  backgroundColor: theme.dangerBg,
                  borderColor: theme.dangerBorder,
                },
              ]}
              onPress={resetAllLocalData}
            >
              <Text
                style={[styles.dangerButtonText, { color: theme.dangerText }]}
              >
                Reset My Local Data
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <AIBubble />
      </View>
    </SafeAreaView>
  );
}

// Style definitions for layout, cards, buttons, spacing, and text
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  background: {
    flex: 1,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 120,
  },

  headerCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  headerText: {
    fontSize: 15,
    lineHeight: 22,
  },

  mainCard: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 18,
  },

  settingBubble: {
    borderWidth: 2,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
  },

  settingTextWrap: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },

  settingText: {
    fontSize: 14,
    lineHeight: 21,
  },

  infoBubble: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 21,
  },

  dangerButton: {
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  dangerButtonText: {
    fontWeight: "800",
    fontSize: 15,
  },
});