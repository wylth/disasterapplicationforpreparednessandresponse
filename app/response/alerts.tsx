import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { fetchAlerts, AlertItem } from "../services/alertsApi";
import { saveRecentTab } from "../services/recentTabs";

const ALERTS_UPDATED_AT_KEY = "alerts_last_updated";

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Alerts", path: "/response/alerts" });
    }, [])
  );

  useEffect(() => {
    loadAlerts();
    loadLastUpdated();
  }, []);

  const formatDateTime = (value: number) => {
    if (!value) return "Unknown";
    return new Date(value).toLocaleString();
  };

  const loadLastUpdated = async () => {
    try {
      const saved = await AsyncStorage.getItem(ALERTS_UPDATED_AT_KEY);
      setLastUpdated(saved ?? "");
    } catch (error) {
      console.log("Failed to load alerts timestamp", error);
    }
  };

  const saveLastUpdated = async (value: string) => {
    try {
      await AsyncStorage.setItem(ALERTS_UPDATED_AT_KEY, value);
      setLastUpdated(value);
    } catch (error) {
      console.log("Failed to save alerts timestamp", error);
    }
  };

  const loadAlerts = async () => {
    setLoading(true);
    const data = await fetchAlerts();
    setAlerts(data);
    const now = new Date().toLocaleString();
    await saveLastUpdated(now);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchAlerts();
    setAlerts(data);
    const now = new Date().toLocaleString();
    await saveLastUpdated(now);
    setRefreshing(false);
  };

  const filteredAlerts = useMemo(() => {
    const keyword = countryFilter.trim().toLowerCase();

    if (!keyword) {
      return alerts;
    }

    return alerts.filter((item) =>
      item.country.toLowerCase().includes(keyword)
    );
  }, [alerts, countryFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading alerts...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredAlerts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Global Disaster Alerts</Text>
          <Text style={styles.updatedText}>
            Last updated: {lastUpdated || "Not available"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Filter by country"
            placeholderTextColor="#8a95a5"
            value={countryFilter}
            onChangeText={setCountryFilter}
          />
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>No alerts found.</Text>
      }
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => toggleExpand(item.id)}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>Country: {item.country}</Text>
          <Text style={styles.cardText}>Hazard: {item.hazard}</Text>
          <Text style={styles.cardText}>Severity: {item.severity}</Text>

          {expandedId === item.id && (
            <View style={styles.expandedSection}>
              <Text style={styles.expandedText}>
                Date: {item.date || "Unknown"}
              </Text>
              <Text style={styles.expandedText}>
                Timestamp: {formatDateTime(item.timestamp)}
              </Text>
            </View>
          )}
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: "#f7f9fc",
    flexGrow: 1,
  },

  header: {
    marginBottom: 4,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
    padding: 20,
  },

  loadingText: {
    fontSize: 16,
    color: "#5b6b7c",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: "#31445a",
    letterSpacing: 0.3,
  },

  updatedText: {
    fontSize: 14,
    marginBottom: 14,
    color: "#7a8798",
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dde5ee",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 15,
    color: "#425466",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e4e9f0",
    shadowColor: "#7c8aa0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#425466",
  },

  cardText: {
    fontSize: 14,
    color: "#5b6b7c",
    marginBottom: 3,
  },

  expandedSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#edf1f5",
  },

  expandedText: {
    fontSize: 14,
    color: "#728096",
    marginBottom: 4,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
    color: "#8a95a5",
    fontStyle: "italic",
  },
});