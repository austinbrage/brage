import articlesQueries from './articles.queries.js';
import { ConnectionHandler } from '../../global/handlers/connection.js';

class ArticlesMysql {

    constructor({ articlesPool }) {
        const connectionHandler = new ConnectionHandler('articles');

        this.pool = articlesPool;
        this.connectionHandler = connectionHandler.connect;
    }

    getAll = async () => {
        return this.connectionHandler(this.pool, async (connection) => {

            const [rows] = await connection.execute(
               articlesQueries.getAll,
               []
            );

            return rows;
        })
    }

    getAllById = async ({ user_id }) => {
        return this.connectionHandler(this.pool, async (connection) => {

            const [rows] = await connection.execute(
               articlesQueries.getAllById,
               [user_id]
            );

            return rows;
        })
    }

    getAllByName = async ({ name }) => {
        return this.connectionHandler(this.pool, async (connection) => {

            const [rows] = await connection.execute(
               articlesQueries.getAllByName,
               [name]
            );

            return rows;
        })
    }

    getId = async ({ user_id, name }) => {
        return this.connectionHandler(this.pool, async (connection) => {

            const [rows] = await connection.execute(
               articlesQueries.getId,
               [user_id, name]
            );

            return rows;
        })
    }

    addNew = async ({ user_id, name, title, image, keywords, description }) => {
        return this.connectionHandler(this.pool, async (connection) => {

            const [rows] = await connection.execute(
               articlesQueries.addNew,
               [user_id, name, title, image, keywords, description]
            );

            return rows;
        })
    }

    changeData = async ({ name, title, image, keywords, description, id }) => {
        return this.connectionHandler(this.pool, async (connection) => {

            const [rows] = await connection.execute(
               articlesQueries.changeData,
               [name, title, image, keywords, description, id]
            );

            return rows;
        })
    }

    changePublishment = async ({ is_publish, id }) => {
        return this.connectionHandler(this.pool, async (connection) => {

            const [rows] = await connection.execute(
               articlesQueries.changePublishment,
               [is_publish, id]
            );

            return rows;
        })
    }

    remove = async ({ id }) => {
        return this.connectionHandler(this.pool, async (connection) => {

            const [rows] = await connection.execute(
               articlesQueries.remove,
               [id]
            );

            return rows;
        })
    }

}

export default ArticlesMysql;