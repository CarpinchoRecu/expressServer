const {createLogger, format, transports} = require("winston")

module.exports = createLogger({
    format: format.combine(format.simple()),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 20,
            filename: `${__dirname}/../logs/salida.log`
        }),
        new transports.Console({
            level: "debug",
        })
    ]
})