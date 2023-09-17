export type StatusType = 'open' | 'inProces' | 'done';

export type ScreenType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

export type ColorMode = 'light' | 'dark';

export interface TaskProps {
  id: string;
  created: Date;
  title: string;
  description: string;
  expiresAt: Date;
  status: StatusType;
}

export interface CommonPageProps {
  setHeaderLeftSlot: (...elements: HTMLElement[]) => void;
  setHeaderRightSlot: (...elements: HTMLElement[]) => void;
  setDialogContent: (dialogContent: HTMLElement) => void;
  toggleDialog: () => void;
}

export interface AppSettings {
  colorMode: ColorMode;
}
