import type { Position } from './mission';

export interface Template {
  id: number;
  title: string;
  positions: Position[];
  notes?: string;
}

export type TemplateInput = Omit<Template, 'id'>;
