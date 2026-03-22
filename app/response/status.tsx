import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { saveRecentTab } from "../services/recentTabs";

type StatusOption = "Safe" | "Need Help" | "Unknown" | null;

const STATUS_STORAGE_KEY = "user_status";
const STATUS_UPDATED_AT_KEY = "user_status_updated_at";

export default function Status() {
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Status", path: "/response/status" });
    }, [])
  );

  useEffect(() => {
    loadStatus();
    loadLastUpdated();
  }, []);

  const loadStatus = async () => {
    try {
      const saved = await AsyncStorage.getItem(STATUS_STORAGE_KEY);
      if (saved) {
        setSelectedStatus(saved as StatusOption);
      }
    } catch (error) {
      console.log("Failed to load status", error);
    }
  };

  const loadLastUpdated = async () => {
    try {
      const saved = await AsyncStorage.getItem(STATUS_UPDATED_AT_KEY);
      setLastUpdated(saved ?? "");
    } catch (error) {
      console.log("Failed to load status timestamp", error);
    }
  };

  const saveLastUpdated = async () => {
    try {
      const value = new Date().toLocaleString();
      await AsyncStorage.setItem(STATUS_UPDATED_AT_KEY, value);
      setLastUpdated(value);
    } catch (error) {
      console.log("Failed to save status timestamp", error);
    }
  };

  const updateStatus = async (status: StatusOption) => {
    try {
      setSelectedStatus(status);
      await AsyncStorage.setItem(STATUS_STORAGE_KEY, status ?? "");
      await saveLastUpdated();
    } catch (error) {
      console.log("Failed to save status", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Status</Text>

      <Text style={styles.subtitle}>
        Select your current status during an emergency.
      </Text>

      <Text style={styles.updatedText}>
        Last updated: {lastUpdated || "Not available"}
      </Text>

      <Pressable
        style={[
          styles.button,
          selectedStatus === "Safe" && styles.safeButton,
        ]}
        onPress={() => updateStatus("Safe")}
      >
        <Text style={styles.buttonText}>Safe</Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          selectedStatus === "Need Help" && styles.helpButton,
        ]}
        onPress={() => updateStatus("Need Help")}
      >
        <Text style={styles.buttonText}>Need Help</Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          selectedStatus === "Unknown" && styles.unknownButton,
        ]}
        onPress={() => updateStatus("Unknown")}
      >
        <Text style={styles.buttonText}>Unknown</Text>
      </Pressable>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Current Status</Text>
        <Text style={styles.statusValue}>
          {selectedStatus ? selectedStatus : "No status selected"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 10,
    color: "#444",
  },
  updatedText: {
    fontSize: 14,
    marginBottom: 20,
    color: "#555",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: "#d9d9d9",
  },
  safeButton: {
    backgroundColor: "#7bc67b",
  },
  helpButton: {
    backgroundColor: "#e88b8b",
  },
  unknownButton: {
    backgroundColor: "#d8c36a",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  statusCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
});