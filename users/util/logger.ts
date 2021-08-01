import {configure, getLogger} from "log4js";

const logger = getLogger();
logger.level = "debug";

configure({
    appenders: {
        out: {type: 'stdout', layout: {type: 'basic'}},
        file: {type: "file", filename: "logs.log"}
    },
    categories: {
        default: {appenders: ["file","out"], level: "error"}

    }
});

class Logger {

    constructor() {
        logger.debug('Created new instance of Logger');
    }

    async debug(msg: string) {
        logger.level = "debug";
        logger.debug(msg);
    }

    async error(msg: string) {
        logger.level = "error";
        logger.error(msg);
    }

    async info(msg: string) {
        logger.level = "info";
        logger.info(msg);
    }

}

export default new Logger();