exports.success = (res, message, data, statusCode) => {
    return res.status(statusCode).json({
        status: true,
        message,
        data
    })
}

exports.error = (res, err, message, statusCode) => {
    return res.status(statusCode).json({
        status: false,
        message,
        error: err
    })
}

exports.successMessage = (res, message, statusCode) => {
    return res.status(statusCode).json({
        status: true,
        message,
    })
}

exports.failedMessage = (res, message, statusCode) => {
    return res.status(statusCode).json({
        status: false,
        message,
    })
}