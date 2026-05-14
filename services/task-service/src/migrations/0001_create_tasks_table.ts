import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tasks", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("title", 255).notNullable();
    table.text("description");
    table.uuid("user_id").notNullable().index();
    table
      .enu("status", ["pending", "in_progress", "completed"])
      .notNullable()
      .defaultTo("pending");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tasks");
}
