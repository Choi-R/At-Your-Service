exports.notFound = (req, res) => {
    res.status(404).json({
        status: false,
        errors: 'Page not found. Maybe it has been moved or deleted? Or maybe you just lost?'
    })
}

exports.internalServerError = (req, res) => {
    res.status(500).json({
        status: false,
        errors: 'Our server is on maintenance, please come back some time later'
    })
}