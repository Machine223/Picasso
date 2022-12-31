import * as dotenv from 'dotenv';
import * as FormData from 'form-data';
import got from 'got';
import { injectable } from 'inversify';
import { EmailRequestClientServer } from '../../../common/communication/email-request-client-server';
import { EmailRequestOptions } from './email-request-options';

const EMAIL_API_URL = 'https://log2990.step.polymtl.ca/email';

@injectable()
export class EmailHandlerService {

  options: EmailRequestOptions;

  constructor() {
    dotenv.config();
  }

  createFormData(request: EmailRequestClientServer): FormData {
    const formData = new FormData();
    formData.append('Content-Type', 'multipart/form-data');
    formData.append('to', request.emailAddress);
    formData.append('payload', this.dataURLtoBuffer(request.image),
      {filename: request.filename, contentType: request.imageType});
    return formData;
  }

  async sendRequestToAPI(emailOptions: FormData): Promise<number> {
    const response = await got.post(EMAIL_API_URL, {
      headers:  { 'X-Team-Key': process.env.XTEAMKEY },
      body: emailOptions } );
    return response.statusCode;
  }

  dataURLtoBuffer(dataURL: string): Buffer {
    const binary =  Buffer.from((dataURL.split(',')[1]), 'base64');
    return binary;
  }
}
