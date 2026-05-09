export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
