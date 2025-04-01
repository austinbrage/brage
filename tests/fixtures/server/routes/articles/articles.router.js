import { Router } from "express";
import SanitizeGetRequests from './articles.middlewares.js';
import ArticlesController from './articles.controllers.js';

const createArticlesRouter = ({ articlesModel }) => {
   const articlesRouter = Router();

   const sanitize = new SanitizeGetRequests();
   const articlesController = new ArticlesController({ articlesModel });

   articlesRouter.get('/all', articlesController.getAll);
   articlesRouter.get('/all/user', sanitize.getAllById, articlesController.getAllById);
   articlesRouter.get('/getAllByName', articlesController.getAllByName);
   articlesRouter.get('/getId', sanitize.getId, articlesController.getId);
   articlesRouter.post('/addNew', articlesController.addNew);
   articlesRouter.put('/changeData', articlesController.changeData);
   articlesRouter.put('/changePublishment', articlesController.changePublishment);
   articlesRouter.delete('/remove', articlesController.remove);

   return articlesRouter;
}

export default createArticlesRouter;