export type Slot = {
  slot: number;
  from: string;
  to: string;
  error?: boolean;
};
export type Day = {
  day: string;
  dayLabel: string;
  timeSlots: Slot[];
};
export type DaysTable = Day[];
