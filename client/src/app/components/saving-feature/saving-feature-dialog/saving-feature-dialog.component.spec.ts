import { ObserversModule } from '@angular/cdk/observers';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCard, MatDialogModule, MatDialogRef, MatInputModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { RequestLoadingComponent } from '../request-state-dialogs/request-loading/request-loading.component';
import {
  SavingFeatureConfirmationDialogComponent
} from '../saving-feature-confirmation-dialog/saving-feature-confirmation-dialog.component';
import { SavingFeatureDialogComponent } from './saving-feature-dialog.component';

const mockDialogRef = {
  close: jasmine.createSpy('close'),
  afterClosed: jasmine.createSpy('afterClosed')
};

describe('SavingFeatureDialogComponent', () => {
  let component: SavingFeatureDialogComponent;
  let fixture: ComponentFixture<SavingFeatureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequestLoadingComponent,
        SavingFeatureDialogComponent,
        SavingFeatureConfirmationDialogComponent,
        MatCard
      ],
      imports: [
        MatDialogModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ObserversModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          RequestLoadingComponent,
          SavingFeatureConfirmationDialogComponent
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingFeatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#addTag should push to currentTagsList if currentTag is not empty & not part of tags', () => {
    component.currentTag = 'hello';
    component.tags = [];
    component.addTag();
    expect(component.tags.length).toEqual(1);
  });

  it('#removeTag should remove tag from currentTagsList', () => {
    component.tags = ['hello', 'world'];
    component.removeTag('world');
    expect(component.tags.length).toEqual(1);
  });

  it('#saveDrawingInfo should send a POST/PATCH request if names & tags are valid', async () => {
    component.name = 'test';
    component.tags = ['hello'];
    spyOn(MatDialogRef.prototype, 'afterClosed').and.returnValue(of(true));
    const spy = spyOn(component.databaseRequests, 'sendDrawing').and.returnValue(Promise.resolve());
    await component.saveDrawingInfo();
    expect(spy).toHaveBeenCalled();
  });

  it('#saveDrawingInfo should not send new drawing to load if request unsuccessful', async () => {
    spyOn(MatDialogRef.prototype, 'afterClosed').and.returnValue(of(true));
    spyOn(component.databaseRequests, 'sendDrawing').and.returnValue(Promise.reject());
    const spy = spyOn(component.loadingFeature, 'load');
    await component.saveDrawingInfo();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#saveDrawingInfo should not send new drawing to load if confirmation is cancelled', async () => {
    spyOn(MatDialogRef.prototype, 'afterClosed').and.returnValue(of(false));
    const spy = spyOn(component.loadingFeature, 'load');
    await component.saveDrawingInfo();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#saveDrawingInfo should alert user if name/tags validation fail', () => {
    component.name = '';
    component.tags = ['$not gonna work'];
    const spy = spyOn(window, 'alert').and.callThrough();
    component.saveDrawingInfo();
    expect(spy).toHaveBeenCalled();
  });

  it('#validateTags should return false if a tag is empty', () => {
    component.tags = [''];
    expect(component.validateTags()).toEqual(false);
  });

  it('#validateTags should return false if a tag does not start with a letter', () => {
    component.tags = ['^not gonna work'];
    expect(component.validateTags()).toEqual(false);
  });

  it('#close should close the dialogAlert', () => {
    const spy = spyOn(component.dialogAlert, 'closeAll').and.callThrough();
    component.close();
    expect(spy).toHaveBeenCalled();
  });
});
