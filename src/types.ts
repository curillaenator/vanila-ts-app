export interface TaskProps {
  id: string;
  created: Date;
  title: string;
  description: string;
  expiresAt: Date;
  status: 'open' | 'inProces' | 'done';
}
