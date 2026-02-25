import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet } from "react-native";

export default function AIBubble() {
  const router = useRouter(); // lets us move to the AI screen

  return (
    <Pressable
      onPress={() => router.push("/ai-chat")}   // go to AI page when clicked
      style={styles.container}             // position on screen
    >
      <Image
        source={require("@/assets/images/ai-bubble.png")} // your hand-drawn image
        style={styles.image}                              // size of the image
        resizeMode="contain"                              // keep proportions
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",   // floats on top of the page
    bottom: 20,             // distance from bottom
    right: 20,              // distance from right
  },
  image: {
    width: 70,              // image width
    height: 70,             // image height
  },
});