import { config } from "dotenv";

config();

(() => {
    const allowedEnvironments = ['development', 'production', 'test'];

    if (!allowedEnvironments.includes(process.env.NODE_ENV)) {
        console.log(`
            The environment '${process.env.NODE_ENV}' is not valid.
            It must be one of: ${allowedEnvironments.join(', ')}. Exiting
        `);
        process.exit(1);
    }
})();

export const ENVIRONMENT = process.env.NODE_ENV ?? 'production';

export const PORT = {
    development: process.env.DEV_PORT ?? 3000,
    production: process.env.PROD_PORT ?? 3001,
    test: process.env.TEST_PORT ?? 3002
} 

export const DB_CONFIG = {
    development: {
        port: process.env.DEV_DB_PORT,
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_DATABASE,
    },
    production: {
        port: process.env.PROD_DB_PORT,
        host: process.env.PROD_DB_HOST,
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_DATABASE,
    },
    test: {
        port: process.env.TEST_DB_PORT,
        host: process.env.TEST_DB_HOST,
        user: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_DATABASE,
    },
}