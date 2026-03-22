import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { saveRecentTab } from "../services/recentTabs";

type ChecklistItem = {
  id: string;
  title: string;
  checked: boolean;
  custom: boolean;
};

type SavedQuizData = {
  answers: Record<string, string>;
  score: number | null;
  submitted: boolean;
};

type BadgeItem = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
};

const CHECKLIST_STORAGE_KEY = "preparedness_checklist";
const QUIZ_STORAGE_KEY = "preparedness_quiz";

export default function Badges() {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [showLocked, setShowLocked] = useState(true);
  const [showEarned, setShowEarned] = useState(true);

  const loadBadges = async () => {
    try {
      const checklistStored = await AsyncStorage.getItem(CHECKLIST_STORAGE_KEY);
      const quizStored = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);

      const checklistItems: ChecklistItem[] = checklistStored
        ? JSON.parse(checklistStored)
        : [];

      const quizData: SavedQuizData = quizStored
        ? JSON.parse(quizStored)
        : { answers: {}, score: null, submitted: false };

      const completedChecklistCount = checklistItems.filter(
        (item) => item.checked
      ).length;

      const totalChecklistCount = checklistItems.length;

      const checklistCompleted =
        totalChecklistCount > 0 &&
        completedChecklistCount === totalChecklistCount;

      const quizCompleted = quizData.submitted;

      const quizPassed = quizData.score !== null && quizData.score >= 3;

      const generatedBadges: BadgeItem[] = [
        {
          id: "1",
          title: "Getting Started",
          description: "Complete at least 1 checklist item",
          earned: completedChecklistCount >= 1,
        },
        {
          id: "2",
          title: "Prepared Learner",
          description: "Complete all checklist items",
          earned: checklistCompleted,
        },
        {
          id: "3",
          title: "Quiz Attempted",
          description: "Submit the preparedness quiz",
          earned: quizCompleted,
        },
        {
          id: "4",
          title: "Quiz Passed",
          description: "Score at least 3 out of 5 in the quiz",
          earned: quizPassed,
        },
        {
          id: "5",
          title: "Preparedness Champion",
          description: "Complete the checklist and pass the quiz",
          earned: checklistCompleted && quizPassed,
        },
      ];

      setBadges(generatedBadges);
    } catch (error) {
      console.log("Failed to load badges", error);
      setBadges([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Badges", path: "/preparedness/badges" });
      loadBadges();
    }, [])
  );

  const earnedBadges = useMemo(
    () => badges.filter((b) => b.earned),
    [badges]
  );

  const lockedBadges = useMemo(
    () => badges.filter((b) => !b.earned),
    [badges]
  );

  const progress = badges.length > 0 ? earnedBadges.length / badges.length : 0;

  const renderBadge = ({ item }: { item: BadgeItem }) => (
    <View
      style={{
        ...styles.badgeCard,
        ...(item.earned ? styles.earnedBadge : styles.lockedBadge),
      }}
    >
      <Text style={styles.badgeTitle}>
        {item.earned ? "🏅 " : "🔒 "}
        {item.title}
      </Text>

      <Text style={styles.badgeDescription}>{item.description}</Text>

      <Text style={styles.badgeStatus}>{item.earned ? "Earned" : "Locked"}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Badges</Text>

      <Text style={styles.progressText}>
        {earnedBadges.length} / {badges.length} earned
      </Text>

      <View style={styles.progressBarBackground}>
        <View
          style={{
            ...styles.progressBarFill,
            width: `${progress * 100}%`,
          }}
        />
      </View>

      <Pressable
        style={styles.sectionHeader}
        onPress={() => setShowLocked(!showLocked)}
      >
        <Text style={styles.sectionTitle}>Locked ({lockedBadges.length})</Text>
        <Text style={styles.sectionToggleText}>
          {showLocked ? "Hide" : "Show"}
        </Text>
      </Pressable>

      {showLocked && (
        <FlatList
          data={lockedBadges}
          keyExtractor={(item) => item.id}
          renderItem={renderBadge}
          scrollEnabled={false}
        />
      )}

      <Pressable
        style={styles.sectionHeader}
        onPress={() => setShowEarned(!showEarned)}
      >
        <Text style={styles.sectionTitle}>Earned ({earnedBadges.length})</Text>
        <Text style={styles.sectionToggleText}>
          {showEarned ? "Hide" : "Show"}
        </Text>
      </Pressable>

      {showEarned && (
        <FlatList
          data={earnedBadges}
          keyExtractor={(item) => item.id}
          renderItem={renderBadge}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No earned badges yet.</Text>
          }
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: "#f7f9fc",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    color: "#31445a",
    letterSpacing: 0.3,
  },

  progressText: {
    fontSize: 15,
    marginBottom: 8,
    color: "#5b6b7c",
    fontWeight: "500",
  },

  progressBarBackground: {
    height: 10,
    backgroundColor: "#e8edf3",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 20,
  },

  progressBarFill: {
    height: 10,
    backgroundColor: "#a9bed6",
    borderRadius: 999,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e4e9f0",
    shadowColor: "#7c8aa0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#425466",
  },

  sectionToggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#728096",
  },

  badgeCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
  },

  earnedBadge: {
    backgroundColor: "#eef7f2",
    borderColor: "#d8eadf",
  },

  lockedBadge: {
    backgroundColor: "#f2efff",
    borderColor: "#e1dcf5",
  },

  badgeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#31445a",
  },

  badgeDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: "#5b6b7c",
    lineHeight: 20,
  },

  badgeStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c7a89",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    color: "#8a95a5",
    fontStyle: "italic",
  },
});