import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { EmailHandlerService } from '../services/email-handler.service';
import Types from '../types';

// Source: Most of this code is inspired of the MongoDB tutorial, provided on Moodle

@injectable()
export class EmailHandlerController {

  router: Router;

  constructor(
  @inject(Types.EmailHandlerService) private emailHandlerService: EmailHandlerService) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();
    this.router.post('/email', async (req: Request, res: Response, next: NextFunction) => {
      const request = this.emailHandlerService.createFormData(req.body);
      this.emailHandlerService.sendRequestToAPI(request)
        .then((response) => res.sendStatus(Httpstatus.OK).send())
        .catch((error) => {res.status(Httpstatus.NOT_FOUND).send(error);
        });
    });
  }
}
