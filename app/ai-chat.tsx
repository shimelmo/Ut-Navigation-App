import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AIChatScreen() {
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <View style={styles.headerCard}>
          <Text style={styles.title}>Campus AI</Text>
          <Text style={styles.subtitle}>
            This is the future AI helper screen for your project.
          </Text>
        </View>

        <View style={styles.chatBox}>
          <Text style={styles.chatPlaceholder}>
            Ask about classes, rooms, or campus help here later.
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#7f90aa"
            value={message}
            onChangeText={setMessage}
          />

          <Pressable style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#edf4ff",
  },

  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#edf4ff",
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  backButtonText: {
    color: "#183a6b",
    fontWeight: "700",
    fontSize: 15,
  },

  headerCard: {
    backgroundColor: "#dcecff",
    borderWidth: 2,
    borderColor: "#c0d7f7",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#35527b",
    lineHeight: 22,
  },

  chatBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },

  chatPlaceholder: {
    fontSize: 16,
    color: "#5c7394",
    lineHeight: 24,
  },

  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#183a6b",
  },

  sendButton: {
    backgroundColor: "#dcecff",
    borderWidth: 2,
    borderColor: "#234a84",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  sendButtonText: {
    color: "#183a6b",
    fontWeight: "800",
    fontSize: 15,
  },
});