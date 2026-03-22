import { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";
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

const CHECKLIST_STORAGE_KEY = "preparedness_checklist";
const QUIZ_STORAGE_KEY = "preparedness_quiz";

export default function Preparedness() {

  const [completedChecklist, setCompletedChecklist] = useState(0);
  const [totalChecklist, setTotalChecklist] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState(0);
  const [totalBadges] = useState(5);


  const loadPreparednessSummary = async () => {

    try {

      const checklistStored = await AsyncStorage.getItem(CHECKLIST_STORAGE_KEY);
      const quizStored = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);

      const checklistItems: ChecklistItem[] = checklistStored
        ? JSON.parse(checklistStored)
        : [];

      const quizData: SavedQuizData = quizStored
        ? JSON.parse(quizStored)
        : {
            answers: {},
            score: null,
            submitted: false,
          };


      const completedChecklistCount = checklistItems.filter(
        (item) => item.checked
      ).length;

      const totalChecklistCount = checklistItems.length;

      const checklistCompleted =
        totalChecklistCount > 0 &&
        completedChecklistCount === totalChecklistCount;

      const quizCompleted = quizData.submitted;

      const quizPassed =
        quizData.score !== null && quizData.score >= 3;


      let badgesCount = 0;

      if (completedChecklistCount >= 1) badgesCount += 1;
      if (checklistCompleted) badgesCount += 1;
      if (quizCompleted) badgesCount += 1;
      if (quizPassed) badgesCount += 1;
      if (checklistCompleted && quizPassed) badgesCount += 1;


      setCompletedChecklist(completedChecklistCount);
      setTotalChecklist(totalChecklistCount);
      setEarnedBadges(badgesCount);

    } catch (error) {

      console.log("Failed to load preparedness summary", error);

      setCompletedChecklist(0);
      setTotalChecklist(0);
      setEarnedBadges(0);
    }
  };


  useFocusEffect(
    useCallback(() => {

      saveRecentTab({
        label: "Preparedness",
        path: "/preparedness",
      });

      loadPreparednessSummary();

    }, [])
  );


  const checklistProgress =
    totalChecklist > 0
      ? completedChecklist / totalChecklist
      : 0;

  const badgeProgress =
    totalBadges > 0
      ? earnedBadges / totalBadges
      : 0;


  return (

    <View style={styles.container}>

      <Text style={styles.title}>Preparedness</Text>


      {/* Checklist Progress */}

      <View style={styles.summaryCard}>

        <Text style={styles.summaryTitle}>
          Checklist Progress
        </Text>

        <Text style={styles.summaryText}>
          {completedChecklist} / {totalChecklist} completed
        </Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${checklistProgress * 100}%` },
            ]}
          />
        </View>

      </View>


      {/* Badge Progress */}

      <View style={styles.summaryCard}>

        <Text style={styles.summaryTitle}>
          Badge Progress
        </Text>

        <Text style={styles.summaryText}>
          {earnedBadges} / {totalBadges} earned
        </Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${badgeProgress * 100}%` },
            ]}
          />
        </View>

      </View>


      {/* Navigation Buttons */}

      <Link href="/preparedness/checklist" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Checklist</Text>
        </Pressable>
      </Link>


      <Link href="/preparedness/quiz" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Quiz</Text>
        </Pressable>
      </Link>


      <Link href="/preparedness/badges" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Badges</Text>
        </Pressable>
      </Link>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f7f9fc",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#31445a",
    letterSpacing: 0.3,
  },

  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e4e9f0",
    shadowColor: "#7c8aa0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#425466",
  },

  summaryText: {
    fontSize: 15,
    marginBottom: 10,
    color: "#5b6b7c",
  },

  progressBarBackground: {
    height: 10,
    backgroundColor: "#e8edf3",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressBarFill: {
    height: 10,
    backgroundColor: "#a9bed6",
    borderRadius: 999,
  },

  button: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: "#eef2f7",
    borderWidth: 1,
    borderColor: "#dde5ee",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#425466",
  },
});