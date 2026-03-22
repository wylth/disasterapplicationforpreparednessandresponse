import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { saveRecentTab } from "../services/recentTabs";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

type SavedQuizData = {
  answers: Record<string, string>;
  score: number | null;
  submitted: boolean;
};

const QUIZ_STORAGE_KEY = "preparedness_quiz";
const QUIZ_UPDATED_AT_KEY = "preparedness_quiz_updated_at";

const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "What should be included in an emergency kit?",
    options: [
      "Snacks only",
      "Water, food, flashlight, and first aid supplies",
      "Books and toys only",
    ],
    correctAnswer: "Water, food, flashlight, and first aid supplies",
  },
  {
    id: "2",
    question: "What should you do first when an emergency alert is issued?",
    options: [
      "Ignore it",
      "Check official instructions and stay informed",
      "Leave immediately without checking information",
    ],
    correctAnswer: "Check official instructions and stay informed",
  },
  {
    id: "3",
    question: "Why is it important to know emergency contact numbers?",
    options: [
      "To save time during an emergency",
      "For entertainment",
      "To avoid using a phone",
    ],
    correctAnswer: "To save time during an emergency",
  },
  {
    id: "4",
    question: "Why should you know your nearest shelter location?",
    options: [
      "So you can respond faster during an emergency",
      "So you can visit it daily",
      "Because it replaces emergency services",
    ],
    correctAnswer: "So you can respond faster during an emergency",
  },
  {
    id: "5",
    question: "What is one purpose of disaster preparedness?",
    options: [
      "To reduce confusion and improve safety",
      "To make emergencies happen",
      "To replace emergency services",
    ],
    correctAnswer: "To reduce confusion and improve safety",
  },
];

export default function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Quiz", path: "/preparedness/quiz" });
    }, [])
  );

  useEffect(() => {
    loadQuizData();
    loadLastUpdated();
  }, []);

  const loadQuizData = async () => {
    try {
      const stored = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);

      if (stored) {
        const parsed: SavedQuizData = JSON.parse(stored);
        setSelectedAnswers(parsed.answers);
        setScore(parsed.score);
        setSubmitted(parsed.submitted);
      }
    } catch (error) {
      console.log("Failed to load quiz data", error);
    }
  };

  const loadLastUpdated = async () => {
    try {
      const saved = await AsyncStorage.getItem(QUIZ_UPDATED_AT_KEY);
      setLastUpdated(saved ?? "");
    } catch (error) {
      console.log("Failed to load timestamp", error);
    }
  };

  const saveLastUpdated = async () => {
    try {
      const value = new Date().toLocaleString();
      await AsyncStorage.setItem(QUIZ_UPDATED_AT_KEY, value);
      setLastUpdated(value);
    } catch (error) {
      console.log("Failed to save timestamp", error);
    }
  };

  const saveQuizData = async (data: SavedQuizData) => {
    try {
      await AsyncStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log("Failed to save quiz data", error);
    }
  };

  const selectAnswer = async (questionId: string, answer: string) => {
    if (submitted) return;

    const updatedAnswers = {
      ...selectedAnswers,
      [questionId]: answer,
    };

    setSelectedAnswers(updatedAnswers);

    await saveQuizData({
      answers: updatedAnswers,
      score,
      submitted,
    });

    await saveLastUpdated();
  };

  const submitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
      Alert.alert("Incomplete Quiz", "Please answer all questions.");
      return;
    }

    let correct = 0;

    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });

    setScore(correct);
    setSubmitted(true);

    await saveQuizData({
      answers: selectedAnswers,
      score: correct,
      submitted: true,
    });

    await saveLastUpdated();
  };

  const resetQuiz = async () => {
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);

    await saveQuizData({
      answers: {},
      score: null,
      submitted: false,
    });

    await saveLastUpdated();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Preparedness Quiz</Text>

      <Text style={styles.updatedText}>
        Last updated: {lastUpdated || "Not available"}
      </Text>

      {quizQuestions.map((question) => (
        <View key={question.id} style={styles.card}>
          <Text style={styles.question}>{question.question}</Text>

          {question.options.map((option) => {
            const isSelected = selectedAnswers[question.id] === option;
            const isCorrect = submitted && option === question.correctAnswer;
            const isWrong = submitted && isSelected && !isCorrect;

            const optionStyle = {
              ...styles.option,
              ...(isSelected ? styles.selected : {}),
              ...(isCorrect ? styles.correct : {}),
              ...(isWrong ? styles.wrong : {}),
            };

            return (
              <Pressable
                key={option}
                style={optionStyle}
                onPress={() => selectAnswer(question.id, option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      {score !== null && (
        <Text style={styles.score}>
          Score: {score} / {quizQuestions.length}
        </Text>
      )}

      <Pressable style={styles.submitButton} onPress={submitQuiz}>
        <Text style={styles.submitText}>Submit</Text>
      </Pressable>

      <Pressable style={styles.resetButton} onPress={resetQuiz}>
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
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
    marginBottom: 6,
    color: "#31445a",
    letterSpacing: 0.3,
  },

  updatedText: {
    fontSize: 14,
    marginBottom: 18,
    color: "#7a8798",
  },

  card: {
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

  question: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#425466",
    lineHeight: 22,
  },

  option: {
    backgroundColor: "#eef2f7",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dde5ee",
  },

  optionText: {
    fontSize: 15,
    color: "#425466",
    lineHeight: 20,
  },

  selected: {
    backgroundColor: "#acb8ca",
    borderColor: "#dbe7f7",
  },

  correct: {
    backgroundColor: "#eef7f2",
    borderColor: "#d8eadf",
  },

  wrong: {
    backgroundColor: "#f6eff7",
    borderColor: "#e8dced",
  },

  score: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 14,
    color: "#31445a",
  },

  submitButton: {
    backgroundColor: "#e8eef8",
    borderWidth: 1,
    borderColor: "#d7e2f0",
    paddingVertical: 13,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
  },

  submitText: {
    color: "#425466",
    fontWeight: "600",
    fontSize: 16,
  },

  resetButton: {
    backgroundColor: "#f2efff",
    borderWidth: 1,
    borderColor: "#e1dcf5",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },

  resetText: {
    color: "#6b5f8f",
    fontWeight: "600",
    fontSize: 16,
  },
});