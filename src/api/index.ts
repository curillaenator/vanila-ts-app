import type { TaskProps, StatusType, AppSettings } from '@src/types';

const DEFAUULT_APP_SETTINGS: AppSettings = {
  colorMode: 'light',
};

export const api = {
  getTasks: (status: StatusType): Promise<TaskProps[]> => {
    return new Promise((response) => {
      const value = localStorage.getItem(`tasks-${status}`);

      if (!!value) {
        response(JSON.parse(value) as TaskProps[]);
      } else {
        response([]);
      }
    });
  },

  setTasks: (status: StatusType, payload: TaskProps[]) => {
    localStorage.setItem(`tasks-${status}`, JSON.stringify(payload));
  },

  getSettings: (): Promise<AppSettings> =>
    new Promise((response) => {
      const value = localStorage.getItem(`app-settings`);
      response(value ? (JSON.parse(value) as AppSettings) : DEFAUULT_APP_SETTINGS);
    }),

  setSettings: (appSettins: Partial<AppSettings>) => {
    const prevSettings = JSON.parse(localStorage.getItem(`app-settings`) || JSON.stringify(DEFAUULT_APP_SETTINGS));

    localStorage.setItem('app-settings', JSON.stringify({ ...prevSettings, ...appSettins }));
  },
};
