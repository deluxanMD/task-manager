import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("tasks", (table) => {
    table.text("user_id").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("tasks", (table) => {
    table.uuid("user_id").alter();
  });
}
