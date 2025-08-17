export interface Assignment {
  id: number;
  mission_id: number;
  user_id?: number | null;
  email?: string | null;
  role_label: string;
  status: string;
  channel?: string | null;
  responded_at?: string | null;
}

export type AssignmentInput = Omit<Assignment, 'id'>;
