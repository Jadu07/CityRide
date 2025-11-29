import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Video } from "expo-av";
import SlideToUnlock from "react-native-slide-to-unlock";

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>

      <Video
        source={require("../assets/home.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted={false}
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to CityRide</Text>
        <Text style={styles.subtitle}>
          Travel smart. Choose the best bus route instantly 
        </Text>

        <View style={{ marginTop: 50, width: "85%" }}>
          <SlideToUnlock
            onEndReached={() => navigation.replace("AppTabs")}
            containerStyle={styles.sliderContainer}
            sliderElement={<View style={styles.sliderCircle} />}
          >
            <Text style={styles.sliderText}>Slide to Start →</Text>
          </SlideToUnlock>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  title: { fontSize: 36, fontWeight: "bold", color: "#fff", textAlign: "center" },
  subtitle: {
    marginTop: 10,
    fontSize: 17,
    color: "#eee",
    textAlign: "center",
    lineHeight: 22,
  },
  sliderContainer: {
    backgroundColor: "rgba(255, 245, 245, 0.24)",
    borderRadius: 50,
    padding: 5,
  },
  sliderCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#434445ff",
  }
});
