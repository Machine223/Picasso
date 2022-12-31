import { ObserversModule } from '@angular/cdk/observers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCard, MatDialogModule, MatDialogRef, MatFormField, MatLabel } from '@angular/material';
import {
  SavingFeatureConfirmationDialogComponent
} from '../saving-feature-confirmation-dialog/saving-feature-confirmation-dialog.component';

describe('SavingFeatureConfirmationDialogComponent', () => {
  let component: SavingFeatureConfirmationDialogComponent;
  let fixture: ComponentFixture<SavingFeatureConfirmationDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SavingFeatureConfirmationDialogComponent,
        MatLabel,
        MatFormField,
        MatCard
      ],
      imports: [
        MatDialogModule,
        ObserversModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingFeatureConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#close should be called', () => {
    const spy = spyOn(component, 'closeDialog').and.callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('#confirmDrawing should be called', () => {
    const spy = spyOn(component, 'confirmDrawing').and.callThrough();
    component.confirmDrawing();
    expect(spy).toHaveBeenCalled();
  });
});
