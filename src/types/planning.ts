import type { Mission } from './mission';

export interface WeekDay {
  date: string;
  missions: Mission[];
}

export interface WeekOut {
  start: string;
  days: WeekDay[];
}
