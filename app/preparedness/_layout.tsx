import { Stack } from "expo-router";

export default function PreparednessLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Preparedness" }}
      />
      <Stack.Screen
        name="checklist"
        options={{ title: "Checklist" }}
      />
      <Stack.Screen
        name="quiz"
        options={{ title: "Quiz" }}
      />
      <Stack.Screen
        name="badges"
        options={{ title: "Badges" }}
      />
    </Stack>
  );
}