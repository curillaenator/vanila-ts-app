import type { TaskProps, StatusType } from '@src/types';

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
};
