import { createPool } from "mysql2/promise";
import { DB_CONFIG, ENVIRONMENT } from "../utils/config.js";

const currentDBConfig = DB_CONFIG[ENVIRONMENT];

export const createPoolConnection = ({ wait, cLimit, qLimit } = {}) => {
    const pool = createPool({
        ...currentDBConfig,
        waitForConnections: wait ?? true,
        connectionLimit: cLimit ?? 10,
        queueLimit: qLimit ?? 0
    });

    if(!pool) throw new Error('Error at MySQL pool connection');

    return pool;
}