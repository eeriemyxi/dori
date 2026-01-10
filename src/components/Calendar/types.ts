export interface CalendarMonth {
  days: Date[];
  weekday: number;
}

export type MarkType = "normal" | "today" | "green" | "inactive";

export type DateKey = string & { readonly __brand: unique symbol };
