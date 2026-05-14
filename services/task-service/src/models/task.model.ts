import db from "../config/db";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  status: "pending" | "in_progress" | "completed";
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskInput {
  title: string;
  user_id: string;
  description?: string | null;
  status?: "pending" | "in_progress" | "completed";
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: "pending" | "in_progress" | "completed";
}

const TaskModel = {
  async findById(id: string): Promise<Task | undefined> {
    return db<Task>("tasks").where({ id }).first();
  },

  async findByUserId(userId: string): Promise<Task[]> {
    return db<Task>("tasks")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
  },

  async create(data: CreateTaskInput): Promise<Task> {
    const task = await db<Task>("tasks").insert(data).returning("*");
    return task[0];
  },

  async updateById(
    id: string,
    data: Partial<UpdateTaskInput>,
  ): Promise<Task | undefined> {
    const task = await db<Task>("tasks")
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning("*");
    return task[0];
  },
};

export default TaskModel;
