import { useRouter } from "expo-router";
import { Image, Platform, Pressable, StyleSheet } from "react-native";

export default function AIBubble() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push("/ai-chat")} style={styles.container}>
      <Image
        source={require("@/assets/images/ai-bubble.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === "web"
      ? {
          position: "fixed",
          bottom: 20,
          right: 20,
        }
      : {
          position: "absolute",
          bottom: 20,
          right: 20,
        }),
    zIndex: 999,
  },
  image: {
    width: 70,
    height: 70,
  },
});