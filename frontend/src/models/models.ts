// src/models.ts
export interface Task {
    id?: number;
    title: string;
    description?: string;
    status?: string;        // "pending" | "done"
    due_date?: string | null;
    user_id?: number;
    subtasks?: Subtask[];
    // אפשר להוסיף כאן גם: subtasks?: Subtask[] אם רוצים לשמור אותם ביחד
  }
  
  export interface Subtask {
    id?: number;
    title: string;
    status?: string;        // "pending" | "done"
    due_date?: string | null;
    task_id?: number;
  }
  