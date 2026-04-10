// Import Stack from Expo Router.
// Stack controls page navigation inside this (tabs) folder.
import { Stack } from "expo-router";

// Import StatusBar so phone top bar matches app appearance.
import { StatusBar } from "expo-status-bar";


// This is the layout file for everything inside the (tabs) folder.
// It controls how screens inside your tab section are organized.
export default function RootLayout() {
  return (
    <>
      {/*
        Stack navigator for all screens inside (tabs).

        Even though this folder is called (tabs),
        you're using custom TopTabs navigation manually,
        so this Stack handles screen switching behind the scenes.
      */}
      <Stack
        screenOptions={{
          // Hide Expo Router’s default header bar
          // because your app uses its own custom top navigation.
          headerShown: false,
        }}
      >
        {/*
          Main tab screen group:
          This loads all pages inside your (tabs) folder like:
          - index.tsx
          - office-hours.tsx
          - enter-course.tsx
          - settings.tsx
        */}
        <Stack.Screen name="(tabs)" />

        {/*
          AI Chat page:
          Opens separately from normal tab screens.
          This allows the AI page to act like its own full screen.
        */}
        <Stack.Screen name="ai-chat" />
      </Stack>

      {/*
        Controls top phone status bar appearance
        (battery, time, Wi-Fi icons).
        "auto" changes color automatically for dark/light mode.
      */}
      <StatusBar style="auto" />
    </>
  );
}