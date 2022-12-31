import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Drawing } from '../../../common/communication/drawing';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

// Source: Most of this code is inspired of the MongoDB tutorial, provided on Moodle

@injectable()
export class DatabaseController {

  router: Router;

  constructor(
  @inject(Types.DatabaseService) private databaseService: DatabaseService) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();

    this.router.post('/addDrawing', async (req: Request, res: Response, next: NextFunction) => {
      this.databaseService.addDrawing(req.body)
        .then(() => {
          res.sendStatus(Httpstatus.CREATED).send();
        })
        .catch((error: Error) => {
          res.status(Httpstatus.NOT_FOUND).send(error.message);
        });
    });

    this.router.patch('/updateDrawing', async (req: Request, res: Response, next: NextFunction) => {
        this.databaseService.updateDrawing(req.body)
            .then(() => {
                res.sendStatus(Httpstatus.OK);
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
    });

    this.router.get('/getAllDrawings', async (req: Request, res: Response, next: NextFunction) => {
        this.databaseService.getAllDrawings()
            .then((drawings: Drawing[]) => {
                res.json(drawings);
            })
            .catch((error: Error) => {
                const errorMessage = { title: 'Error', body: error };
                res.status(Httpstatus.NOT_FOUND);
                res.json(errorMessage);
            });
        });

    this.router.delete('/:name', async (req: Request, res: Response, next: NextFunction) => {
      this.databaseService.deleteDrawing(req.params.name)
        .then(() => {
          res.sendStatus(Httpstatus.OK).send();
        })
        .catch((error: Error) => {
          const errorMessage = { title: 'Error', body: error };
          res.status(Httpstatus.NOT_FOUND);
          res.json(errorMessage);
        });
    });
  }
}
