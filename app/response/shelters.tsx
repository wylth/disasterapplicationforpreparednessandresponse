import { useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useFocusEffect } from "expo-router";
import { saveRecentTab } from "../services/recentTabs";

type ShelterItem = {
  id: string;
  name: string;
  description: string;
};

const shelters: ShelterItem[] = [
  {
    id: "1",
    name: "XXX Community Shelter",
    description:
      "Location: XXX Avenue, Block 123\nCapacity: XXX people\nFacilities: Basic sleeping areas, water supply, and restrooms.\nNotes: Open during emergency situations.",
  },
  {
    id: "2",
    name: "YYY Emergency Shelter",
    description:
      "Location: YYY Road, Building ABC\nCapacity: YYY people\nFacilities: Food distribution, medical support, and resting areas.\nNotes: Operated by local authorities during disasters.",
  },
  {
    id: "3",
    name: "ZZZ Temporary Shelter",
    description:
      "Location: ZZZ Street, Hall 5\nCapacity: ZZZ people\nFacilities: Shelter beds, charging stations, and basic first aid.\nNotes: Suitable for short-term stays.",
  },
  {
    id: "4",
    name: "XXX Regional Shelter",
    description:
      "Location: XXX District, Community Center\nCapacity: XXX people\nFacilities: Family areas, information desk, and sanitation facilities.\nNotes: Used for evacuation and coordination.",
  },
];

export default function Shelters() {
  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Shelters", path: "/response/shelters" });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shelters</Text>

      {shelters.map((item) => (
        <Pressable key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
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
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 14,
    color: "#333",
  },
});