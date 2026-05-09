import knex from "knex";
import { env } from "./env";
import configs from "./knex.config";

const config = configs[env.NODE_ENV];
const db = knex(config);

export default db;
