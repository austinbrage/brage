export const createOkResponse = ({ message, token, data }) => {
    return {
        success: true,
        result: {
            message: message,
            data: data ? data : null,
            token: token ? token : null
        }
    }
}

export const createErrorResponse = ({ message, error }) => {

    return {
        success: false,
        error: {
            status: 'fail',
            message: message,
            validationError: error ? error : null
        }
    }
}