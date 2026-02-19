import { useRouter } from "expo-router"; // Change this import
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  text: string;
};


const COLORS = {
  bg: "#F7F7F8",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  navy: "#0B1F3B",
  gold: "#C9A227",
};


export default function MapHomeScreen() {
  const router = useRouter(); // Add this hook
  const [aiOpen, setAiOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hey! I'm your UT Navigation helper. Ask me where a class is, or a professor's office hours (coming soon).",
    },
  ]);


  const canSend = input.trim().length > 0;
  const headerTitle = useMemo(() => "Map Display", []);


  function goOfficeHours() {
    router.push("/(tabs)/office-hours");
  }
 
  function goEnterCourse() {
    router.push("/(tabs)/enter-course");
  }
 
  function goSettings() {
    router.push("/(tabs)/settings");
  }


  async function sendToAssistant(userText: string) {
    const lower = userText.toLowerCase();
    if (lower.includes("north") || lower.includes("engineering")) {
      return "For North Engineering: we'll soon add a real floor/map view. For now, try Enter Course and we'll highlight the building.";
    }
    if (lower.includes("office hours")) {
      return "Office hours screen is ready to build next. We can store hours per professor and show them by day.";
    }
    return "Got it. Next step is connecting this to real building + course data, then I can answer with exact rooms.";
  }


  async function onSend() {
    const userText = input.trim();
    if (!userText) return;


    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: userText,
    };


    setMessages((prev) => [userMsg, ...prev]);
    setInput("");


    const replyText = await sendToAssistant(userText);


    const aiMsg: ChatMsg = {
      id: `a-${Date.now() + 1}`,
      role: "assistant",
      text: replyText,
    };


    setMessages((prev) => [aiMsg, ...prev]);
  }


  return (
    <View style={styles.screen}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.topTab} onPress={goOfficeHours}>
          <Text style={styles.topTabText}>Office Hours</Text>
        </Pressable>


        <View style={styles.divider} />


        <Pressable style={styles.topTab} onPress={goEnterCourse}>
          <Text style={styles.topTabText}>Enter Course</Text>
        </Pressable>


        <View style={styles.divider} />


        <Pressable style={styles.topTab} onPress={goSettings}>
          <Text style={styles.topTabText}>Settings</Text>
        </Pressable>
      </View>


      {/* Main Display Area */}
      <View style={styles.content}>
        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>{headerTitle}</Text>
          <Text style={styles.mapHint}>
            Placeholder map area (we'll swap this for a real North Engineering /
            Nitschke map).
          </Text>


          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>DISPLAY</Text>
          </View>


          <View style={styles.legendRow}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>
              Later: show your location + starred courses
            </Text>
          </View>
        </View>
      </View>


      {/* Floating AI Assistant Button */}
      <Pressable style={styles.aiFab} onPress={() => setAiOpen(true)}>
        <Text style={styles.aiFabText}>AI</Text>
      </Pressable>


      {/* AI Modal */}
      <Modal visible={aiOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalSheet}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Assistant</Text>
              <Pressable onPress={() => setAiOpen(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>Close</Text>
              </Pressable>
            </View>


            <FlatList
              style={styles.chatList}
              data={messages}
              keyExtractor={(m) => m.id}
              inverted
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.bubble,
                    item.role === "user" ? styles.bubbleUser : styles.bubbleAI,
                  ]}
                >
                  <Text style={styles.bubbleText}>{item.text}</Text>
                </View>
              )}
            />


            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask about a building, room, course..."
                placeholderTextColor={COLORS.muted}
                style={styles.input}
                multiline
              />
              <Pressable
                onPress={onSend}
                style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
                disabled={!canSend}
              >
                <Text style={styles.sendBtnText}>Send</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}


// Copy all your existing styles here - they remain exactly the same
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  topTabText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 26,
    backgroundColor: COLORS.border,
  },
  content: { flex: 1, padding: 14 },
  mapCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    flex: 1,
  },
  mapTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  mapHint: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 13,
  },
  mapPlaceholder: {
    marginTop: 14,
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: "#FBFBFC",
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.navy,
    opacity: 0.35,
    letterSpacing: 1.2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: COLORS.gold,
  },
  legendText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  aiFab: {
    position: "absolute",
    right: 18,
    bottom: 22,
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  aiFabText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  closeBtnText: { color: COLORS.text, fontWeight: "700" },
  chatList: { paddingHorizontal: 14, paddingTop: 10 },
  bubble: {
    maxWidth: "85%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#EEF2FF",
    borderColor: "#DDE3FF",
  },
  bubbleAI: {
    alignSelf: "flex-start",
    backgroundColor: "#F9FAFB",
    borderColor: COLORS.border,
  },
  bubbleText: { color: COLORS.text, fontSize: 14, lineHeight: 19 },
  inputRow: {
    paddingHorizontal: 14,
    paddingTop: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    backgroundColor: "#FFFFFF",
  },
  sendBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: "#FFFFFF", fontWeight: "800" },
});