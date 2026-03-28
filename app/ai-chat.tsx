import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function AIChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I’m Campus AI. Ask me about classes, rooms, or campus help.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: message.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://ut-ai-server.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      });

      const data = await response.json();

      const aiMessage: ChatMessage = {
        role: "assistant",
        text: data.reply || "Sorry, I could not get a response.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log("AI fetch error:", error);

      const errorMessage: ChatMessage = {
        role: "assistant",
        text: "There was a problem connecting to the AI server.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <View style={styles.headerCard}>
          <Text style={styles.title}>Campus AI</Text>
          <Text style={styles.subtitle}>
            Ask about classes, rooms, or campus help.
          </Text>
        </View>

        <ScrollView style={styles.chatBox} contentContainerStyle={styles.chatContent}>
          {messages.map((item, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                item.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          ))}

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#183a6b" />
              <Text style={styles.loadingText}>Campus AI is typing...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#7f90aa"
            value={message}
            onChangeText={setMessage}
          />

          <Pressable style={styles.sendButton} onPress={sendMessage}>
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

  chatContent: {
    paddingBottom: 8,
  },

  messageBubble: {
    maxWidth: "82%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 10,
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#dcecff",
    borderWidth: 2,
    borderColor: "#c0d7f7",
  },

  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#f7fbff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
  },

  messageText: {
    fontSize: 15,
    color: "#183a6b",
    lineHeight: 22,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },

  loadingText: {
    fontSize: 14,
    color: "#5c7394",
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