import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IndexService } from '../../services/index/index.service';
import { KeyboardEventComponent } from '../keyboard-event/keyboard-event.component';
import { AppComponent } from './app.component';

import SpyObj = jasmine.SpyObj;

describe('AppComponent', () => {
    let indexServiceSpy: SpyObj<IndexService>;

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientModule,
                MatDialogModule,
                MatSnackBarModule
            ],
            declarations: [
                AppComponent,
                KeyboardEventComponent
            ],
            providers: [{ provide: IndexService, useValue: indexServiceSpy }],
        });
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

});
