import { CustomError } from "../helpers/customError.js";

export const notFoundHandler = (req, _res, next) => {
    const err = new CustomError(`Cannot find ${req.originalUrl} on the server!`, 404);
    next(err);
}