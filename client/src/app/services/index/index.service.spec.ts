import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Message } from '../../../../../common/communication/message';
import { IndexService } from './index.service';
import SpyObj = jasmine.SpyObj;

describe('IndexService', () => {
    let httpClientSpy: SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    });

    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient, useValue: httpClientSpy }],
        }),
    );

    it('should return expected message (HttpClient called once)', inject([IndexService], (service: IndexService) => {
        const expectedMessage: Message = { body: 'Hello', title: 'World' };

        httpClientSpy.get.and.returnValue(of(expectedMessage));
        service.basicGet().subscribe((response: Message) => {
            expect(response.title).toEqual(expectedMessage.title, 'Title check');
            expect(response.body).toEqual(expectedMessage.body, 'body check');
        }, fail);

        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    }));
});
