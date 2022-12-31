import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { DatabaseController } from './controllers/database.controller';
import { DateController } from './controllers/date.controller';
import { EmailHandlerController } from './controllers/email-handler.controller';
import { IndexController } from './controllers/index.controller';
import Types from './types';

@injectable()
export class Application {
    private readonly internalError: number = 500;
    app: express.Application;

    constructor(
        @inject(Types.IndexController) private indexController: IndexController,
        @inject(Types.DateController) private dateController: DateController,
        @inject(Types.DatabaseController) private databaseController: DatabaseController,
        @inject(Types.EmailHandlerController) private emailHandlerController: EmailHandlerController,
    ) {
        this.app = express();
        this.config();
        this.bindRoutes();
    }

    private config(): void {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    bindRoutes(): void {
        this.app.use('/api/index', this.indexController.router);
        this.app.use('/api/date', this.dateController.router);
        this.app.use('/database', this.databaseController.router);
        this.app.use('/email-handler', this.emailHandlerController.router);
        this.errorHandling();
    }

    private errorHandling(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
