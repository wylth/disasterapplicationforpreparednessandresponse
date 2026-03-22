import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { saveRecentTab } from "../services/recentTabs";

export default function Response() {
  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Response", path: "/response" });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Response Screen</Text>

      <Link href="/response/alerts" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Alerts</Text>
        </Pressable>
      </Link>

      <Link href="/response/resources" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Resources</Text>
        </Pressable>
      </Link>

      <Link href="/response/status" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Status</Text>
        </Pressable>
      </Link>

      <Link href="/response/hotlines" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Hotlines</Text>
        </Pressable>
      </Link>

      <Link href="/response/shelters" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Shelters</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f9fc",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 28,
    color: "#31445a",
    letterSpacing: 0.3,
  },

  button: {
    width: "85%",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
    alignItems: "center",
    backgroundColor: "#e2e9ff",
    borderWidth: 1,
    borderColor: "#e4e9f0",

    shadowColor: "#7c8aa0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#425466",
  },
});