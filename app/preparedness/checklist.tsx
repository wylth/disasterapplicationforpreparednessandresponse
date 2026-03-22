import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
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

const STORAGE_KEY = "preparedness_checklist";

const defaultChecklist: ChecklistItem[] = [
  { id: "1", title: "I understand the purpose of disaster preparedness", checked: false, custom: false },
  { id: "2", title: "I know what should be included in an emergency kit", checked: false, custom: false },
  { id: "3", title: "I know the important emergency contact numbers", checked: false, custom: false },
  { id: "4", title: "I understand how emergency alerts work", checked: false, custom: false },
  { id: "5", title: "I know the basic steps to take during an emergency", checked: false, custom: false },
  { id: "6", title: "I know where to go for shelter if needed", checked: false, custom: false },
  { id: "7", title: "I have reviewed the preparedness information in this app", checked: false, custom: false },
];

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [showIncomplete, setShowIncomplete] = useState(true);
  const [showComplete, setShowComplete] = useState(true);

  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Checklist", path: "/preparedness/checklist" });
    }, [])
  );

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems(defaultChecklist);
      }
    } catch {
      setItems(defaultChecklist);
    }
  };

  const saveChecklist = async (updated: ChecklistItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const toggleItem = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );

    setItems(updated);
    saveChecklist(updated);
  };

  const addItem = () => {
    const trimmed = newItemText.trim();
    if (!trimmed) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: trimmed,
      checked: false,
      custom: true,
    };

    const updated = [...items, newItem];

    setItems(updated);
    saveChecklist(updated);
    setNewItemText("");
  };

  const deleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveChecklist(updated);
  };

  const completed = items.filter((item) => item.checked).length;
  const progress = items.length > 0 ? completed / items.length : 0;

  const incompleteItems = useMemo(
    () => items.filter((item) => !item.checked),
    [items]
  );

  const completeItems = useMemo(
    () => items.filter((item) => item.checked),
    [items]
  );

  const renderChecklistItem = ({ item }: { item: ChecklistItem }) => (
    <View style={styles.itemRow}>
      <Pressable
        style={styles.checkArea}
        onPress={() => toggleItem(item.id)}
      >
        <Text style={styles.checkbox}>{item.checked ? "☑" : "☐"}</Text>
        <Text style={styles.text}>{item.title}</Text>
      </Pressable>

      {item.custom && (
        <Pressable
          style={styles.deleteButton}
          onPress={() => deleteItem(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Preparedness Checklist</Text>

      <Text style={styles.progressText}>
        {completed} / {items.length} completed
      </Text>

      <View style={styles.progressBarBackground}>
        <View
          style={{
            ...styles.progressBarFill,
            width: `${progress * 100}%`,
          }}
        />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new checklist item"
          placeholderTextColor="#8a95a5"
          value={newItemText}
          onChangeText={setNewItemText}
        />

        <Pressable style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.sectionHeader}
        onPress={() => setShowIncomplete(!showIncomplete)}
      >
        <Text style={styles.sectionTitle}>
          Incomplete ({incompleteItems.length})
        </Text>
        <Text style={styles.sectionToggleText}>
          {showIncomplete ? "Hide" : "Show"}
        </Text>
      </Pressable>

      {showIncomplete && (
        <FlatList
          data={incompleteItems}
          keyExtractor={(item) => item.id}
          renderItem={renderChecklistItem}
          scrollEnabled={false}
        />
      )}

      <Pressable
        style={styles.sectionHeader}
        onPress={() => setShowComplete(!showComplete)}
      >
        <Text style={styles.sectionTitle}>
          Complete ({completeItems.length})
        </Text>
        <Text style={styles.sectionToggleText}>
          {showComplete ? "Hide" : "Show"}
        </Text>
      </Pressable>

      {showComplete && (
        <FlatList
          data={completeItems}
          keyExtractor={(item) => item.id}
          renderItem={renderChecklistItem}
          scrollEnabled={false}
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
    marginBottom: 12,
    fontWeight: "700",
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

  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },

  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dde5ee",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 15,
    color: "#425466",
  },

  addButton: {
    backgroundColor: "#e8eef8",
    borderWidth: 1,
    borderColor: "#d7e2f0",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#425466",
    fontSize: 15,
    fontWeight: "600",
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

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e9f0",
    borderRadius: 14,
    padding: 14,
  },

  checkArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  checkbox: {
    fontSize: 20,
    marginRight: 10,
    color: "#5f7390",
  },

  text: {
    flex: 1,
    fontSize: 15,
    color: "#425466",
    lineHeight: 22,
  },

  deleteButton: {
    backgroundColor: "#f2efff",
    borderWidth: 1,
    borderColor: "#e1dcf5",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginLeft: 10,
  },

  deleteText: {
    color: "#6b5f8f",
    fontSize: 13,
    fontWeight: "600",
  },
});