export type AlertItem = {
  id: string;
  title: string;
  country: string;
  hazard: string;
  severity: string;
  date: string;
  timestamp: number;
};

const GDACS_URL =
  "https://www.gdacs.org/gdacsapi/api/Events/geteventlist/EVENTS4APP";

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function safeNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function extractCountry(item: any): string {
  return (
    safeString(item?.country) ||
    safeString(item?.countryname) ||
    safeString(item?.iso3) ||
    "Unknown"
  );
}

function extractHazard(item: any): string {
  return (
    safeString(item?.eventtype) ||
    safeString(item?.type) ||
    safeString(item?.hazard) ||
    "Unknown"
  );
}

function extractSeverity(item: any): string {
  return (
    safeString(item?.alertlevel) ||
    safeString(item?.severity) ||
    safeString(item?.gdacslevel) ||
    "Unknown"
  );
}

function extractTitle(item: any): string {
  return (
    safeString(item?.name) ||
    safeString(item?.eventname) ||
    safeString(item?.title) ||
    `${extractHazard(item)} event`
  );
}

function extractDate(item: any): string {
  return (
    safeString(item?.fromdate) ||
    safeString(item?.todate) ||
    safeString(item?.date) ||
    ""
  );
}

function extractTimestamp(item: any): number {
  return (
    safeNumber(item?.fromdateepoch) ||
    safeNumber(item?.todateepoch) ||
    safeNumber(item?.dateepoch) ||
    Date.parse(extractDate(item)) ||
    0
  );
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const response = await fetch(GDACS_URL);
    const data = await response.json();

    const rawItems = Array.isArray(data)
      ? data
      : Array.isArray(data?.features)
      ? data.features
      : Array.isArray(data?.events)
      ? data.events
      : Array.isArray(data?.result)
      ? data.result
      : [];

    const mapped: AlertItem[] = rawItems.map((entry: any, index: number) => {
      const item = entry?.properties ?? entry;

      return {
        id: safeString(item?.eventid) || safeString(item?.id) || `${index}`,
        title: extractTitle(item),
        country: extractCountry(item),
        hazard: extractHazard(item),
        severity: extractSeverity(item),
        date: extractDate(item),
        timestamp: extractTimestamp(item),
      };
    });

    return mapped.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.log("Failed to fetch GDACS alerts", error);
    return [];
  }
}