import { ENVIRONMENT } from "../utils/config.js";

export const checkDatabaseConnection = async ({ pool, delay, devRetries, prodRetries }) => {

    const retries = ENVIRONMENT === 'production' ? prodRetries : devRetries;

    for(let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('Connected to the database successfully');
            return connection.release();

        } catch(err) {
            console.error(`Failed to connect to the database (attempt ${i + 1}/${retries}):\n`, err);
            
            if(i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Exhausted all retry attempts. Exiting.');
                process.exit(1);
            }
        }
    }
}