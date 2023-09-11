export type StatusType = 'open' | 'inProces' | 'done';

export interface TaskProps {
  id: string;
  created: Date;
  title: string;
  description: string;
  expiresAt: Date;
  status: StatusType;
}
