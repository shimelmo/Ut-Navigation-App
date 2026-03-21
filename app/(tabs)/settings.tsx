import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import {
  appThemes,
  defaultSettings,
  loadUserSettings,
  saveUserSettings,
  SETTINGS_KEY,
  UserSettings,
} from "@/utils/appSettings";
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

const SAVED_COURSES_KEY = "saved_courses";
const LAST_SELECTED_PROFESSOR_KEY = "last_selected_professor";

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  const theme = settings.darkMode ? appThemes.dark : appThemes.light;

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await loadUserSettings();
      setSettings(saved);
      setLoaded(true);
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (loaded) {
      saveUserSettings(settings);
    }
  }, [settings, loaded]);

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <View style={[styles.background, { backgroundColor: theme.screenBg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <SettingRow
              title="Dark Mode"
              description="Switch the app between light mode and dark mode."
              value={settings.darkMode}
              onValueChange={(value) => updateSetting("darkMode", value)}
            />

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