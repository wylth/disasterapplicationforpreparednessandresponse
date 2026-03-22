import { useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { useFocusEffect } from "expo-router";
import { saveRecentTab } from "../services/recentTabs";

type HotlineItem = {
  id: string;
  name: string;
  number: string;
  description: string;
};

const hotlines: HotlineItem[] = [
  {
    id: "1",
    name: "Emergency Services",
    number: "555-0100",
    description: "General emergency assistance",
  },
  {
    id: "2",
    name: "Disaster Support Line",
    number: "555-0110",
    description: "Support during natural disasters",
  },
  {
    id: "3",
    name: "Medical Assistance",
    number: "555-0120",
    description: "Medical help and ambulance coordination",
  },
  {
    id: "4",
    name: "Community Help Desk",
    number: "555-0130",
    description: "Local disaster relief support",
  },
];

export default function Hotlines() {
  useFocusEffect(
    useCallback(() => {
      saveRecentTab({ label: "Hotlines", path: "/response/hotlines" });
    }, [])
  );

  const openDialer = (number: string) => {
    const phoneUrl = `tel:${number}`;
    Linking.openURL(phoneUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Hotlines</Text>

      {hotlines.map((item) => (
        <Pressable
          key={item.id}
          style={styles.card}
          onPress={() => openDialer(item.number)}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.number}>{item.number}</Text>
          <Text style={styles.description}>{item.description}</Text>
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

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  number: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 4,
    color: "#4a90e2",
  },

  description: {
    fontSize: 14,
    color: "#333",
  },
});