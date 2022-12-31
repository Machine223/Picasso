import { ObserversModule } from '@angular/cdk/observers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormField } from '@angular/material';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NewDrawingAlertDialogComponent } from './new-drawing-alert-dialog.component';

describe('NewDrawingAlertDialogComponent', () => {
  let component: NewDrawingAlertDialogComponent;
  let fixture: ComponentFixture<NewDrawingAlertDialogComponent>;
  const dialogMock = { close: () => null };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewDrawingAlertDialogComponent,
        MatDialogContent,
        MatFormField,
        MatDialogActions
      ],
      providers: [
        MatDialogModule,
        { provide: MatDialogRef, useValue: dialogMock },
      ],
      imports: [ObserversModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#close should call dialogAlertRef close', () => {
    spyOn(component.dialogAlertRef, 'close').and.callThrough();
    component.closeDialog();
    expect(component.dialogAlertRef.close).toHaveBeenCalled();
  });

  it('#confirmDrawing should call dialogAlertRef close', () => {
    spyOn(component.dialogAlertRef, 'close').and.callThrough();
    component.confirmDrawing();
    expect(component.dialogAlertRef.close).toHaveBeenCalled();
  });
});
