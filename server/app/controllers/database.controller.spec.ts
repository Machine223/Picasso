import { expect } from 'chai';
import * as supertest from 'supertest';
import { Drawing } from '../../../common/communication/drawing';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const MOCK_DRAWING: Drawing = { name: 'test', tags: [], metadata: '', previewSource: ''};

describe('DatabaseController', () => {
    let databaseService: Stubbed<DatabaseService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.DatabaseService).toConstantValue({
            addDrawing: sandbox.stub(),
            updateDrawing: sandbox.stub(),
            getAllDrawings: sandbox.stub(),
            deleteDrawing: sandbox.stub()
        });
        databaseService = container.get(Types.DatabaseService);
        app = container.get<Application>(Types.Application).app;
    });

    it('should return CREATED status on successful addDrawing request', async () => {
        databaseService.addDrawing.resolves();
        return supertest(app)
            .post('/database/addDrawing')
            .send(JSON.stringify(MOCK_DRAWING))
            .expect(HTTP_STATUS_CREATED);
    });

    it('should return NOT FOUND status on failed addDrawing request', async () => {
        databaseService.addDrawing.rejects();
        return supertest(app)
            .post('/database/addDrawing')
            .send(JSON.stringify(MOCK_DRAWING))
            .expect(HTTP_NOT_FOUND);
    });

    it('should return OK status on successful updateDrawing request', async () => {
        databaseService.updateDrawing.resolves();
        return supertest(app)
            .patch('/database/updateDrawing')
            .send([JSON.stringify(MOCK_DRAWING), JSON.stringify(MOCK_DRAWING)])
            .expect(HTTP_STATUS_OK);
    });

    it('should return NOT FOUND status on failed updateDrawing request', async () => {
        databaseService.updateDrawing.rejects();
        return supertest(app)
            .patch('/database/updateDrawing')
            .send([JSON.stringify(MOCK_DRAWING), JSON.stringify(MOCK_DRAWING)])
            .expect(HTTP_NOT_FOUND);
    });

    it('should return OK status on successful getAllDrawings request', async () => {
        databaseService.getAllDrawings.resolves();
        return supertest(app)
            .get('/database/getAllDrawings')
            .expect(HTTP_STATUS_OK);
    });

    it('should return NOT FOUND status on failed getAllDrawings request', async () => {
        databaseService.getAllDrawings.rejects(new Error('Service error'));
        return supertest(app)
            .get('/database/getAllDrawings')
            .expect(HTTP_NOT_FOUND)
            // tslint:disable-next-line: no-any
            .then((response: any) => {
                expect(response.body.title).to.deep.equal('Error');
        });
    });

    it('should return OK status on successful delete request', async () => {
        databaseService.deleteDrawing.resolves();
        return supertest(app)
            .delete('/database/drawingName')
            .expect(HTTP_STATUS_OK);
    });

    it('should return NOT FOUND status on failed delete request', async () => {
        databaseService.deleteDrawing.rejects(new Error('Service error'));
        return supertest(app)
            .delete('/database/drawingName')
            .expect(HTTP_NOT_FOUND)
            // tslint:disable-next-line: no-any
            .then((response: any) => {
                expect(response.body.title).to.deep.equal('Error');
        });
    });
});
