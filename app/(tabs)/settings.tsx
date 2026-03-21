import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const SETTINGS_KEY = "user_settings";
const SAVED_COURSES_KEY = "saved_courses";
const LAST_SELECTED_PROFESSOR_KEY = "last_selected_professor";

type UserSettings = {
  darkMode: boolean;
  showCourseColors: boolean;
};

const defaultSettings: UserSettings = {
  darkMode: false,
  showCourseColors: true,
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (loaded) {
      saveSettings(settings);
    }
  }, [settings, loaded]);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);

      if (storedSettings) {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(storedSettings),
        });
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.log("Could not load settings:", error);
      setSettings(defaultSettings);
    } finally {
      setLoaded(true);
    }
  };

  const saveSettings = async (newSettings: UserSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.log("Could not save settings:", error);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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
              await AsyncStorage.removeItem(SAVED_COURSES_KEY);
              await AsyncStorage.removeItem(LAST_SELECTED_PROFESSOR_KEY);
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
    <View style={styles.settingBubble}>
      <View style={styles.settingRow}>
        <View style={styles.settingTextWrap}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingText}>{description}</Text>
        </View>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs />

          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerText}>
              These settings are saved only on this device for this user.
            </Text>
          </View>

          <View style={styles.mainCard}>
            <SettingRow
              title="Dark Mode"
              description="Switch between light mode and dark mode later in the app."
              value={settings.darkMode}
              onValueChange={(value) => updateSetting("darkMode", value)}
            />

            <SettingRow
              title="Use Course Colors"
              description="Keep Monday/Wednesday and Tuesday/Thursday courses color-coded."
              value={settings.showCourseColors}
              onValueChange={(value) => updateSetting("showCourseColors", value)}
            />

            <View style={styles.infoBubble}>
              <Text style={styles.infoText}>
                Your settings, courses, and selected professor are stored locally
                on this device only.
              </Text>
            </View>

            <Pressable style={styles.dangerButton} onPress={resetAllLocalData}>
              <Text style={styles.dangerButtonText}>Reset My Local Data</Text>
            </Pressable>
          </View>
        </ScrollView>

        <AIBubble />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#edf4ff",
  },

  background: {
    flex: 1,
    backgroundColor: "#edf4ff",
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 120,
  },

  headerCard: {
    backgroundColor: "#efe9ff",
    borderWidth: 2,
    borderColor: "#ddd2ff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4d3c87",
    marginBottom: 6,
  },

  headerText: {
    fontSize: 15,
    color: "#6b5c98",
    lineHeight: 22,
  },

  mainCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 28,
    padding: 18,
  },

  settingBubble: {
    backgroundColor: "#f8f5ff",
    borderWidth: 2,
    borderColor: "#e2daf8",
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
    color: "#4d3c87",
    marginBottom: 6,
  },

  settingText: {
    fontSize: 14,
    color: "#6b5c98",
    lineHeight: 21,
  },

  infoBubble: {
    backgroundColor: "#f7faff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },

  infoText: {
    fontSize: 14,
    color: "#5e7698",
    lineHeight: 21,
  },

  dangerButton: {
    backgroundColor: "#ffe6e6",
    borderWidth: 2,
    borderColor: "#e2aaaa",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  dangerButtonText: {
    color: "#8a2f2f",
    fontWeight: "800",
    fontSize: 15,
  },
});