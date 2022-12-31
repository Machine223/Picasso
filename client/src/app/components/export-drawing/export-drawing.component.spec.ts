import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatSnackBarModule } from '@angular/material';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExportDrawingService } from '@app-services/exportDrawing/export-drawing.service';
import { ParsingService } from '@app-services/saving-feature/parsing.service';
import { ExtensionType } from '../../../constants/constants';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { ExportDrawingComponent } from './export-drawing.component';

describe('ExportDrawingComponent', () => {
  let component: ExportDrawingComponent;
  let fixture: ComponentFixture<ExportDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExportDrawingComponent,
        EmailConfirmationComponent
      ],
      imports: [
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        ExportDrawingService,
        ParsingService,
        MatDialog,
        {provide: MatDialogRef, useValue: {}}
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [EmailConfirmationComponent ],
      }})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#close should call closeAll function from MatDialog service', inject([MatDialog], (matDialog: MatDialog) => {
    const spy = spyOn(matDialog, 'closeAll').and.callThrough();
    component.close();
    expect(spy).toHaveBeenCalled();
  }));

  it('#saveImageSetAttribute should set save view child attribute',
    inject([ExportDrawingService], (exportService: ExportDrawingService) => {
    const hrefMock = 'hRefMock';
    const expectedDownload = exportService.name + exportService.extensionType;
    component.saveImageSetAttribute(hrefMock);
    const hrefAttribute = component.save.nativeElement.getAttribute('href');
    const downloadAttribute = component.save.nativeElement.getAttribute('download');
    expect(hrefAttribute).toEqual(hrefMock);
    expect(downloadAttribute).toEqual(expectedDownload);
  }));

  it('#saveImage should save an svg image if .svg extention selected',
    inject([ExportDrawingService, ParsingService], (exportService: ExportDrawingService, parsingService: ParsingService) => {
      exportService.name = 'test';
      exportService.extensionType = ExtensionType.svg;
      parsingService.image = new Image();
      component.saveImage(false);
      const expectedImage = parsingService.image.src;
      const hrefAttribute = component.save.nativeElement.getAttribute('href');
      expect(expectedImage).toEqual(hrefAttribute);
    }));

  it('#saveImage should save a jpeg or png image if selected',
    inject([ExportDrawingService, ParsingService], (exportService: ExportDrawingService, parsingService: ParsingService) => {
    exportService.extensionType = ExtensionType.jpeg;
    exportService.name = 'Valid name';
    parsingService.image = new Image();
    const canvas = document.createElement('canvas');
    const canvasExpected = document.createElement('canvas');
    parsingService.context2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    component.saveImage(false);
    // tslint:disable-next-line: no-magic-numbers
    const expectedImage = canvasExpected.toDataURL('image/' + ExtensionType.jpeg, 0.05);
    const currentImage =  component.save.nativeElement.getAttribute('href');
    expect(currentImage).toEqual(expectedImage);
  }));

  it('#saveImage should call sendEmail if it is an email with jpeg',
    inject([ExportDrawingService, ParsingService], (exportService: ExportDrawingService, parsingService: ParsingService) => {
    exportService.name = 'test';
    exportService.extensionType = ExtensionType.jpeg;
    parsingService.image = new Image();
    const canvas = document.createElement('canvas');
    parsingService.context2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    const spy = spyOn(component, 'sendEmail');
    component.saveImage(true);
    expect(spy).toHaveBeenCalled();
  }));

  it('#saveImage should call sendEmail if it is an email with svg',
    inject([ExportDrawingService, ParsingService], (exportService: ExportDrawingService, parsingService: ParsingService) => {
    exportService.name = 'test';
    exportService.extensionType = ExtensionType.svg;
    parsingService.image = new Image();
    const canvas = document.createElement('canvas');
    parsingService.context2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    const spy = spyOn(component, 'sendEmail');
    component.saveImage(true);
    expect(spy).toHaveBeenCalled();
  }));

  it('#updateFilter should update filter by called getFilter',
    inject([ExportDrawingService, ParsingService], (exportService: ExportDrawingService) => {
        const spy = spyOn(exportService, 'getFilter').and.callThrough();
        component.updateFilter('none', true);
        expect(spy).toHaveBeenCalled();
    }));

  it('#updateFilter should not call getFilter',
    inject([ExportDrawingService, ParsingService], (exportService: ExportDrawingService) => {
      const spy = spyOn(exportService, 'getFilter').and.callThrough();
      component.updateFilter('none', false);
      expect(spy).not.toHaveBeenCalled();
    }));

  it('#sendEmail should open a confirmation dialog', () => {
    const image = 'test';
    const spy = spyOn(component.dialogAlert, 'open').and.callThrough();
    component.sendEmail(image);
    component.dialogConfirmRef.close(true);
    expect(spy).toHaveBeenCalled();
  });

  it('#sendEmailRequest should call sendEmail from export drawing',
  inject([ExportDrawingService], (exportService: ExportDrawingService) => {
    const spy = spyOn(exportService, 'sendEmail');
    component.sendEmailRequest('test');
    expect(spy).toHaveBeenCalled();
  }
  ));

  it('#ngOnChanges should call drawCanvas', () => {
    const spy = spyOn(component, 'drawCanvas').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('#setHover should set isHovering', () => {
    component.setHover(true);
    expect(component.isHovering).toEqual(true);
  });
});
