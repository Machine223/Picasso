import { ObserversModule } from '@angular/cdk/observers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatFormField, MatSnackBarModule } from '@angular/material';
import { EmailConfirmationComponent } from './email-confirmation.component';

describe('EmailConfirmationComponent', () => {
  let component: EmailConfirmationComponent;
  let fixture: ComponentFixture<EmailConfirmationComponent>;
  const dialogMock = { close: () => null };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmailConfirmationComponent,
        MatDialogContent,
        MatFormField,
        MatDialogActions
       ],
      providers: [
        MatDialogModule,
        { provide: MatDialogRef, useValue: dialogMock },
      ],
      imports: [
        ObserversModule,
        HttpClientTestingModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#closeDialog should call dialog ref close', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#confirmSending should call dialog ref close', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.confirmSending();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

});
