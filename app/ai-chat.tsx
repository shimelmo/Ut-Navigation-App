import { useRouter } from "expo-router"; // lets us go back
import React, { useState } from "react"; // useState for typing state
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"; // basic RN stuff

type Message = {
  id: string; // unique id for list
  text: string; // what message says
  from: "user" | "ai"; // who sent it
};

export default function AIChatScreen() {
  const router = useRouter(); // for navigation
  const [input, setInput] = useState(""); // stores what user types

  // fake starter messages (just to make it look real)
  const [messages] = useState<Message[]>([
    { id: "1", text: "Hi! I'm your UT helper (placeholder).", from: "ai" },
    { id: "2", text: "Ask me where your class is and I'll help later.", from: "ai" },
  ]);

  return (
    <View style={styles.screen}>
      {/* top header bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={{ width: 60 }} /> {/* spacer so title stays centered */}
      </View>

      {/* message list */}
      <FlatList
        data={messages} // our messages array
        keyExtractor={(item) => item.id} // key for each row
        contentContainerStyle={styles.listPadding} // spacing
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble, // base bubble style
              item.from === "ai" ? styles.aiBubble : styles.userBubble, // different bubble types
            ]}
          >
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
      />

      {/* input area */}
      <View style={styles.inputRow}>
        <TextInput
          value={input} // controlled input
          onChangeText={setInput} // update input state
          placeholder="Type here..." // placeholder
          placeholderTextColor="#6B7280" // gray placeholder
          style={styles.input} // styling
        />

        {/* send button does NOTHING for now on purpose */}
        <Pressable style={styles.sendBtn} onPress={() => {}}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // full screen height
    backgroundColor: "#F7F7FB", // soft background color
  },

  header: {
    height: 60, // header height
    backgroundColor: "#0B1F3B", // UT navy
    paddingHorizontal: 12, // left/right padding
    flexDirection: "row", // row layout
    alignItems: "center", // vertical center
    justifyContent: "space-between", // spread out
  },

  backBtn: {
    backgroundColor: "#EAF2FF", // soft blue
    paddingVertical: 8, // padding
    paddingHorizontal: 12,
    borderRadius: 10, // rounded
  },

  backText: {
    color: "#0B1F3B", // navy text
    fontWeight: "800", // bold
  },

  headerTitle: {
    color: "white", // white text
    fontSize: 16, // readable
    fontWeight: "900", // bold
    letterSpacing: 0.5, // slight spacing
  },

  listPadding: {
    padding: 14, // spacing around list
    gap: 10, // space between bubbles
  },

  bubble: {
    maxWidth: "85%", // bubble not full width
    padding: 12, // inside padding
    borderRadius: 14, // rounded bubble
    borderWidth: 1, // border
  },

  aiBubble: {
    alignSelf: "flex-start", // left side
    backgroundColor: "#FFFFFF", // white
    borderColor: "#E5E7EB", // light border
  },

  userBubble: {
    alignSelf: "flex-end", // right side
    backgroundColor: "#EAF2FF", // soft blue
    borderColor: "#CFE2FF", // blue border
  },

  bubbleText: {
    color: "#111827", // dark text
    lineHeight: 18, // spacing
    fontSize: 14, // normal size
  },

  inputRow: {
    flexDirection: "row", // row layout
    alignItems: "center", // center vertically
    gap: 10, // space between input and button
    padding: 12, // padding
    borderTopWidth: 1, // line above input
    borderTopColor: "#E5E7EB", // light line
    backgroundColor: "#FFFFFF", // white
  },

  input: {
    flex: 1, // take remaining space
    borderWidth: 1, // border
    borderColor: "#E5E7EB", // light border
    borderRadius: 12, // rounded
    paddingHorizontal: 12, // left/right padding
    paddingVertical: 10, // top/bottom padding
    color: "#111827", // typed text color
    backgroundColor: "#F9FAFB", // slightly gray
  },

  sendBtn: {
    backgroundColor: "#C9A227", // UT gold
    paddingVertical: 10, // padding
    paddingHorizontal: 14,
    borderRadius: 12, // rounded
  },

  sendText: {
    color: "#0B1F3B", // navy text
    fontWeight: "900", // bold
  },
});