import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAlerts } from "./services/alertsApi";
import { getRecentTabs, saveRecentTab, RecentTabItem } from "./services/recentTabs";

type ChecklistItem = {
  id: string;
  title: string;
  checked: boolean;
  custom: boolean;
};

type StatusOption = "Safe" | "Need Help" | "Unknown" | null;

const CHECKLIST_STORAGE_KEY = "preparedness_checklist";
const ALERTS_UPDATED_AT_KEY = "alerts_last_updated";
const STATUS_STORAGE_KEY = "user_status";
const STATUS_UPDATED_AT_KEY = "user_status_updated_at";

export default function Home() {
  const [completedChecklist, setCompletedChecklist] = useState(0);
  const [totalChecklist, setTotalChecklist] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [alertsLastUpdated, setAlertsLastUpdated] = useState("");
  const [currentStatus, setCurrentStatus] = useState<StatusOption>(null);
  const [statusLastUpdated, setStatusLastUpdated] = useState("");
  const [recentTabs, setRecentTabs] = useState<RecentTabItem[]>([]);

  const loadChecklistSummary = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHECKLIST_STORAGE_KEY);
      const items: ChecklistItem[] = stored ? JSON.parse(stored) : [];

      setTotalChecklist(items.length);
      setCompletedChecklist(items.filter((item) => item.checked).length);
    } catch {
      setTotalChecklist(0);
      setCompletedChecklist(0);
    }
  };

  const loadAlertsSummary = async () => {
    const alerts = await fetchAlerts();
    setAlertsCount(alerts.length);
  };

  const loadAlertsLastUpdated = async () => {
    try {
      const saved = await AsyncStorage.getItem(ALERTS_UPDATED_AT_KEY);
      setAlertsLastUpdated(saved ?? "");
    } catch {
      setAlertsLastUpdated("");
    }
  };

  const loadStatusSummary = async () => {
    try {
      const savedStatus = await AsyncStorage.getItem(STATUS_STORAGE_KEY);
      const savedUpdatedAt = await AsyncStorage.getItem(STATUS_UPDATED_AT_KEY);

      setCurrentStatus((savedStatus as StatusOption) ?? null);
      setStatusLastUpdated(savedUpdatedAt ?? "");
    } catch {
      setCurrentStatus(null);
      setStatusLastUpdated("");
    }
  };

  const loadRecentTabs = async () => {
    const tabs = await getRecentTabs();
    setRecentTabs(tabs);
  };

  const loadDashboard = async () => {
    await Promise.all([
      loadChecklistSummary(),
      loadAlertsSummary(),
      loadAlertsLastUpdated(),
      loadStatusSummary(),
      loadRecentTabs(),
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Home", path: "/" });
      loadDashboard();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>
          Overview of your emergency readiness
        </Text>

        <Link href="/response/status" asChild>
          <Pressable style={{ ...styles.card, ...styles.statusCard }}>
            <Text style={styles.cardTitle}>Status Summary</Text>
            <Text style={styles.cardText}>
              {currentStatus || "No status selected"}
            </Text>
            <Text style={styles.cardSubText}>
              Last updated: {statusLastUpdated || "Not available"}
            </Text>
          </Pressable>
        </Link>

        <Link href="/response/alerts" asChild>
          <Pressable style={{ ...styles.card, ...styles.alertCard }}>
            <Text style={styles.cardTitle}>Alerts Summary</Text>
            <Text style={styles.cardText}>
              {alertsCount} recent global alerts
            </Text>
            <Text style={styles.cardSubText}>
              Last updated: {alertsLastUpdated || "Not available"}
            </Text>
          </Pressable>
        </Link>

        <Link href="/preparedness/checklist" asChild>
          <Pressable style={{ ...styles.card, ...styles.checklistCard }}>
            <Text style={styles.cardTitle}>Checklist Summary</Text>
            <Text style={styles.cardText}>
              {completedChecklist} / {totalChecklist} completed
            </Text>
          </Pressable>
        </Link>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActionsRow}>
          <Link href="/response/alerts" asChild>
            <Pressable style={{ ...styles.button, ...styles.quickActionButton }}>
              <Text style={styles.buttonText}>Open Alerts</Text>
            </Pressable>
          </Link>

          <Link href="/response/status" asChild>
            <Pressable style={{ ...styles.button, ...styles.quickActionButton }}>
              <Text style={styles.buttonText}>Update My Status</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>

        {recentTabs.length === 0 ? (
          <Text style={styles.emptyText}>No recent activity yet.</Text>
        ) : (
          recentTabs.map((item) => (
            <Link key={item.path} href={item.path as never} asChild>
              <Pressable style={styles.activityButton}>
                <Text style={styles.activityText}>{item.label}</Text>
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },

  container: {
    padding: 20,
    paddingBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#31445a",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#7a8798",
    marginBottom: 20,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },

  statusCard: {
    backgroundColor: "#edf4ff",
    borderColor: "#dbe7f7",
  },

  alertCard: {
    backgroundColor: "#f2efff",
    borderColor: "#e1dcf5",
  },

  checklistCard: {
    backgroundColor: "#eef7f2",
    borderColor: "#d8eadf",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#425466",
  },

  cardText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2f4154",
  },

  cardSubText: {
    fontSize: 13,
    color: "#728096",
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#425466",
    marginTop: 10,
    marginBottom: 12,
  },

  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#e8eef8",
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d7e2f0",
    justifyContent: "center",
    alignItems: "center",
  },

  quickActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#425466",
  },

  activityButton: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e4e9f0",
  },

  activityText: {
    fontSize: 15,
    color: "#516172",
  },

  emptyText: {
    fontSize: 14,
    color: "#8a95a5",
    fontStyle: "italic",
  },
});