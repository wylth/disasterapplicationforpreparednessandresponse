import { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useFocusEffect } from "expo-router";
import { saveRecentTab } from "../services/recentTabs";

type ResourceItem = {
  id: string;
  title: string;
  description: string;
};

const resources: ResourceItem[] = [
  {
    id: "1",
    title: "Emergency Contacts",
    description:
      "Know the key emergency numbers in your area such as police, ambulance, and fire services. Save them in your phone for quick access.",
  },
  {
    id: "2",
    title: "First Aid Basics",
    description:
      "Learn simple first aid steps such as treating minor cuts, burns, and stabilizing injuries until professional help arrives.",
  },
  {
    id: "3",
    title: "Emergency Kit",
    description:
      "Prepare an emergency kit with water, non-perishable food, flashlight, batteries, basic medication, and important documents.",
  },
  {
    id: "4",
    title: "Shelter Guidance",
    description:
      "Understand where to go during evacuations and what to bring when moving to a temporary shelter.",
  },
  {
    id: "5",
    title: "Official Updates",
    description:
      "Follow trusted sources such as national weather services or government disaster agencies for accurate updates.",
  },
];

export default function Resources() {
  const [expanded, setExpanded] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Resources", path: "/response/resources" });
    }, [])
  );

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resources</Text>

      {resources.map((item) => (
        <Pressable
          key={item.id}
          style={styles.card}
          onPress={() => toggleExpand(item.id)}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>

          {expanded === item.id && (
            <Text style={styles.cardDescription}>{item.description}</Text>
          )}
        </Pressable>
      ))}
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
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  cardDescription: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
});