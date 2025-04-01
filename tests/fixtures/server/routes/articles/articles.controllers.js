import { ArticlesValidation } from './articles.validations.js';
import { asyncErrorHandler } from './../../global/handlers/asyncError.js';
import { createOkResponse, createErrorResponse } from './../../global/utils/responses.js';

class ArticlesController {

    constructor({ articlesModel }) {
        this.articlesModel = articlesModel;
        this.validateArticles = new ArticlesValidation();
    }

    validationErr(res, validationError) {
        return res.status(400).json(createErrorResponse({
            message: 'Validation data error',
            error: validationError.format()
        }));
    }

    getAll = asyncErrorHandler(async (_req, res) => {
        const data = await this.articlesModel.getAll();

        return res.status(200).json(createOkResponse({
            message: 'All articles from all users requested',
            data
        }));
    })

    getAllById = asyncErrorHandler(async (req, res) => {
        const validation = this.validateArticles.getAllById(req.sanitizedData);

        if (!validation.success) return this.validationErr(res, validation.error);

        const data = await this.articlesModel.getAllById(validation.data);

        return res.status(200).json(createOkResponse({
            message: 'All articles from user requested',
            data
        }));
    })

    getAllByName = asyncErrorHandler(async (req, res) => {
        const validation = this.validateArticles.getAllByName(req.query);

        if (!validation.success) return this.validationErr(res, validation.error);

        const data = await this.articlesModel.getAllByName(validation.data);

        return res.status(200).json(createOkResponse({
            message: 'getAllByName in articles executed successfully',
            data
        }));
    })

    getId = asyncErrorHandler(async (req, res) => {
        const validation = this.validateArticles.getId(req.sanitizedData);

        if (!validation.success) return this.validationErr(res, validation.error);

        const data = await this.articlesModel.getId(validation.data);

        return res.status(200).json(createOkResponse({
            message: 'getId in articles executed successfully',
            data
        }));
    })

    addNew = asyncErrorHandler(async (req, res) => {
        const validation = this.validateArticles.addNew(req.body);

        if (!validation.success) return this.validationErr(res, validation.error);

        const data = await this.articlesModel.addNew(validation.data);

        return res.status(200).json(createOkResponse({
            message: 'addNew in articles executed successfully',
            data: [data]
        }));
    })

    changeData = asyncErrorHandler(async (req, res) => {
        const validation = this.validateArticles.changeData(req.body);

        if (!validation.success) return this.validationErr(res, validation.error);

        const data = await this.articlesModel.changeData(validation.data);

        return res.status(200).json(createOkResponse({
            message: 'changeData in articles executed successfully',
            data: [data]
        }));
    })

    changePublishment = asyncErrorHandler(async (req, res) => {
        const validation = this.validateArticles.changePublishment(req.body);

        if (!validation.success) return this.validationErr(res, validation.error);

        const data = await this.articlesModel.changePublishment(validation.data);

        return res.status(200).json(createOkResponse({
            message: 'changePublishment in articles executed successfully',
            data: [data]
        }));
    })

    remove = asyncErrorHandler(async (req, res) => {
        const validation = this.validateArticles.remove(req.body);

        if (!validation.success) return this.validationErr(res, validation.error);

        const data = await this.articlesModel.remove(validation.data);

        return res.status(200).json(createOkResponse({
            message: 'remove in articles executed successfully',
            data: [data]
        }));
    })

}

export default ArticlesController;