import { type DateKey } from "@/components/Calendar";

const DATA_KEY = "data";

interface NoteData {
  key: DateKey;
  content: string;
  lastModified: number;
  version: string;
}

interface AppData {
  notes: Record<DateKey, NoteData>;
}

export function get_default_data(): AppData {
  return {
    notes: {},
  };
}

export function load_data(): AppData {
  const data = localStorage.getItem(DATA_KEY);
  return (data && serialize_data(data)) || get_default_data();
}

export function save_data(data: AppData): void {
  localStorage.setItem(DATA_KEY, deserialize_data(data));
}

export function deserialize_data(data: AppData): string {
  return JSON.stringify(data);
}

export function serialize_data(data: string): AppData {
  return JSON.parse(data);
}
