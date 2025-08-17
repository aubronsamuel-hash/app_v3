export interface Position {
  label: string;
  count: number;
  skills: Record<string, unknown>;
}

export interface Mission {
  id: number;
  title: string;
  start: string;
  end: string;
  location: string;
  call_time?: string | null;
  positions: Position[];
  documents: string[];
  status: string;
  notes?: string | null;
  created_by: number;
}

export type MissionInput = Omit<Mission, 'id' | 'created_by'>;
