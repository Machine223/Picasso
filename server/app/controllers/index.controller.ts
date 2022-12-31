import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { Message } from '../../../common/communication/message';
import { IndexService } from '../services/index.service';
import Types from '../types';

@injectable()
export class IndexController {
    router: Router;

    constructor(@inject(Types.IndexService) private indexService: IndexService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            const time: Message = await this.indexService.helloWorld();
            res.json(time);
        });

        this.router.get('/about', (req: Request, res: Response, next: NextFunction) => {
            res.json(this.indexService.about());
        });
    }
}
