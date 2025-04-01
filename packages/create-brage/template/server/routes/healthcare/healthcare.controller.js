import { CustomError } from "../../global/helpers/customError.js";

class HealthcareController {
    
    constructor({ pingPool }) {
        this.pingPool = pingPool;
    }

    checkApi = (_req, res) => {    
        res.status(200).send('pong');
    }

    checkDatabase = async (_req, res, next) => {
        let connection

        try {
            connection = await this.pingPool.getConnection();
            await connection?.query('SELECT 1');
            res.status(200).send('pong');
            
        } catch(err) {
            next(new CustomError(`Database connection error (${err})`));
    
        } finally {
            connection?.release();
    
        }
    }
}

export default HealthcareController;