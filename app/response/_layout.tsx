import { Stack } from "expo-router";

export default function ResponseLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Response" }}
      />
      <Stack.Screen
        name="alerts"
        options={{ title: "Alerts" }}
      />
      <Stack.Screen
        name="resources"
        options={{ title: "Resources" }}
      />
      <Stack.Screen
        name="status"
        options={{ title: "Status" }}
      />
      <Stack.Screen
        name="hotlines"
        options={{ title: "Hotlines" }}
      />
      <Stack.Screen
        name="shelters"
        options={{ title: "Shelters" }}
      />
    </Stack>
  );
}