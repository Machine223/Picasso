import * as supertest from 'supertest';
import { EmailRequestClientServer } from '../../../common/communication/email-request-client-server';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { EmailHandlerService } from '../services/email-handler.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const HTTP_NOT_FOUND = 404;
const MOCK_EMAIL_REQUEST: EmailRequestClientServer = {
  emailAddress: 'test@test.com', image: 'testImage', filename: 'testFilename', imageType: 'image/jpeg' };

describe('EmailHandlerController', () => {
    let emailHandlerService: Stubbed<EmailHandlerService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.EmailHandlerService).toConstantValue({
            sendRequestToAPI: sandbox.stub(),
            createFormData: sandbox.stub()
        });
        emailHandlerService = container.get(Types.EmailHandlerService);
        app = container.get<Application>(Types.Application).app;
    });

    it('should return OK on post request if emailHandlerService was able to send the email', async () => {
        emailHandlerService.sendRequestToAPI.resolves();
        return supertest(app)
            .post('/email-handler/email')
            .send(JSON.stringify(MOCK_EMAIL_REQUEST))
            .expect(HTTP_STATUS_OK);
    });

    it('should return Not Found on post request if emailHandlerService is not able to send the email', async () => {
      const errorMessage = {message: 'test'};
      emailHandlerService.sendRequestToAPI.rejects(errorMessage);
      return supertest(app)
          .post('/email-handler/email')
          .send(JSON.stringify(MOCK_EMAIL_REQUEST))
          .expect(HTTP_NOT_FOUND);
  });
});
