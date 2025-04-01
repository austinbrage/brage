export class ConnectionHandler {

    constructor(modelName) {
        this.modelName = modelName
    }

    connect = async (pool, callback) => {
        let connection;
        
        try {
            connection = await pool.getConnection();
            return await callback(connection);
        } catch(err) {
            throw new Error(`Error on ${this.modelName} model [${err.message}]`, err);
        } finally {
            connection.release();
        }
    }
}