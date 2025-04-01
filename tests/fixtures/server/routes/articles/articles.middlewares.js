import { createErrorResponse } from './../../global/utils/responses.js';
import { ArticlesStringValidation } from './articles.validations.js';

class SanitizeGetRequests {

    constructor() {
        this.validateStringArticles = new ArticlesStringValidation();
    }

    validationErr(res, validationError) {
        return res.status(400).json(createErrorResponse({
            message: 'Validation data error',
            error: validationError.format()
        }));
    }

    getAllById = (req, res, next) => {
        const validation = this.validateStringArticles.getAllById(req.query);
        if (!validation.success) return this.validationErr(res, validation.error);

        // Initialize req.sanitizedData
        req.sanitizedData = {};

        //user_id goes from string to number
        req.sanitizedData.user_id = parseInt(validation.data.user_id, 10);

        next();
    }

    getId = (req, res, next) => {
        const validation = this.validateStringArticles.getId(req.query);
        if (!validation.success) return this.validationErr(res, validation.error);

        // Initialize req.sanitizedData
        req.sanitizedData = {};

        //user_id goes from string to number
        req.sanitizedData.user_id = parseInt(validation.data.user_id, 10);
        //name goes from string to string
        req.sanitizedData.name = validation.data.name;

        next();
    }

}

export default SanitizeGetRequests;