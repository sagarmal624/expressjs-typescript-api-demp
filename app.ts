import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors'
import {CommonRoutesConfig} from './common/common.routes.config';
import {UsersRoutes} from './users/users.routes.config';
import Logger from './users/util/logger';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];


app.use(bodyparser.json());
app.use(cors());

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    dynamicMeta: function (req, res) {
        var body="";
        if (typeof req.body === 'object') {
            body= JSON.stringify(req.body)
        } else if (typeof req.body === 'string') {
            body = req.body;
        }
        const meta = {
            "requestMethod": req.method,
            "requestUrl": `${req.protocol}://${req.get('host')}${req.originalUrl}`,
            "userAgent": req.get('User-Agent'),
            "body": body
        };
        Logger.debug(JSON.stringify(meta));
        return req
    },
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

routes.push(new UsersRoutes(app));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));


app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`)
});
server.listen(port, () => {
    Logger.debug(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        Logger.debug(`Routes configured for ${route.getName()}`);
    });
});