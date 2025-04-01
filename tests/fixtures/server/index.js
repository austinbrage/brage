import createApp from "./routes/app.js";
import ArticlesModel from "./routes/articles/articles.model.mysql.js";
import { PORT, ENVIRONMENT } from "./global/utils/config.js";
import { createPoolConnection } from "./global/utils/database.js";
import { checkDatabaseConnection } from "./global/helpers/databaseCheck.js";

const pingPool = createPoolConnection({ wait: true, cLimit: 1, qLimit: 0 });
const articlesPool = createPoolConnection({ wait: true, cLimit: 1, qLimit: 0 });

const articlesModel = new ArticlesModel({ articlesPool });

const app = createApp({
   pingPool,
   articlesModel,
});

await checkDatabaseConnection({ 
   pool: pingPool, 
   delay: 2000, 
   devRetries: 1, 
   prodRetries: 5 
});

const server = app.listen(PORT[ENVIRONMENT], () => {
   console.log(`Server running on Port: ${PORT[ENVIRONMENT]}`);
});

export {
   app,
   server,
   articlesPool,
};