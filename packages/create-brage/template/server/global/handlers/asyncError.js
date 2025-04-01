export const asyncErrorHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}