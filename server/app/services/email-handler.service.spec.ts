import { expect } from 'chai';
import * as FormData from 'form-data';
import { EmailRequestClientServer } from '../../../common/communication/email-request-client-server';
import { testingContainer } from '../../test/test-utils';
import Types from '../types';
import { EmailHandlerService } from './email-handler.service';

const MOCK_EMAIL_REQUEST: EmailRequestClientServer = {
  emailAddress: 'test@test.com', image: 'base64,testImage', filename: 'testFilename', imageType: 'image/jpeg' };

describe('Email Handler Service', () => {
    let emailHandlerService: EmailHandlerService;

    beforeEach(async () => {
        const [container] = await testingContainer();
        emailHandlerService = container.get<EmailHandlerService>(Types.EmailHandlerService);
    });

    it('createFormData should return a FormData', async () => {
      const formData = new FormData();
      formData.append('Content-Type', 'multipart/form-data');
      formData.append('to', 'test@test.com');
      formData.append('payload', emailHandlerService.dataURLtoBuffer('base64,testImage'),
        {filename: 'testFilename', contentType: 'image/jpeg'});
      const result = emailHandlerService.createFormData(MOCK_EMAIL_REQUEST);
      expect(result).to.have.property('_overheadLength');
    });

    it('sendRequestToAPI should return 200 when the email api request is good', async () => {
      const formData = new FormData();
      formData.append('Content-Type', 'multipart/form-data');
      formData.append('to', 'test@test.com');
      formData.append('payload', emailHandlerService.dataURLtoBuffer('base64,test'),
        {filename: 'test', contentType: 'image/jpeg'});
      const result = await emailHandlerService.sendRequestToAPI(formData);
      // tslint:disable-next-line: no-magic-numbers
      expect(result).to.equal(200);
    });

    it('dataURLtoBuffer should return a Buffer with the image', async () => {
      const result = emailHandlerService.dataURLtoBuffer('base64,test');
      expect(result).to.have.property('buffer');
    });
});
