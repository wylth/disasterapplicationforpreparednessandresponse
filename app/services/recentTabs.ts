import AsyncStorage from "@react-native-async-storage/async-storage";

export type RecentTabItem = {
  label: string;
  path: string;
};

const STORAGE_KEY = "recent_tabs";

export async function saveRecentTab(item: RecentTabItem): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const current: RecentTabItem[] = stored ? JSON.parse(stored) : [];

    const filtered = current.filter((tab) => tab.path !== item.path);
    const updated = [item, ...filtered].slice(0, 3);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.log("Failed to save recent tab", error);
  }
}

export async function getRecentTabs(): Promise<RecentTabItem[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.log("Failed to load recent tabs", error);
    return [];
  }
}