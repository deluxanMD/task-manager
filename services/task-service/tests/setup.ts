import knex, { Knex } from "knex";
import configs from "../src/config/knex.config";

const testDB = knex(configs.test);

beforeAll(async () => {
  await testDB.migrate.latest();
});

beforeEach(async () => {
  await testDB("tasks").delete();
});

afterAll(async () => {
  await testDB.destroy();
});
