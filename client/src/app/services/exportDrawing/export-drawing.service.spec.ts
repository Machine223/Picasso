import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { FilterType } from '../../../constants/constants';
import { ExportDrawingService } from './export-drawing.service';

describe('ExportDrawingService', () => {
  let service: ExportDrawingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatSnackBarModule ]
    });
    service = TestBed.get(ExportDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initFilterMap should set up the dependencies', () => {
    service.initFilterMap();
    expect(service.mapFilter).toBeDefined();
  });

  it('#getFilter should update observer of filter to none', () => {
    let filter = 'test';
    service.filter.subscribe((newFilter) => {
      filter = newFilter;
    });
    service.getFilter(FilterType.none);
    expect(filter).toContain('none');
  });

  it('#getFilter should update observer of filter to blur', () => {
    let filter = 'test';
    service.filter.subscribe((newFilter) => {
      filter = newFilter;
    });
    service.getFilter(FilterType.blur);
    expect(filter).toContain('blur(7px)');
  });

  it('#getFilter should update observer of filter to sepia', () => {
    let filter = 'test';
    service.filter.subscribe((newFilter) => {
      filter = newFilter;
    });
    service.getFilter(FilterType.sepia);
    expect(filter).toContain('sepia(100%)');
  });

  it('#getFilter should update observer of filter to invert', () => {
    let filter = 'test';
    service.filter.subscribe((newFilter) => {
      filter = newFilter;
    });
    service.getFilter(FilterType.invert);
    expect(filter).toContain('invert(90%)');
  });

  it('#getFilter should update observer of filter to hueRotate', () => {
    let filter = 'test';
    service.filter.subscribe((newFilter) => {
      filter = newFilter;
    });
    service.getFilter(FilterType.hueRotate);
    expect(filter).toContain('hue-rotate(130deg)');
  });

  it('#getFilter should update observer of filter to grayscale ', () => {
    let filter = 'test';
    service.filter.subscribe((newFilter) => {
      filter = newFilter;
    });
    service.getFilter(FilterType.grayscale);
    expect(filter).toContain('grayscale(1)');
  });

  it('#getFilter should not update observer ', () => {
    service.initFilterMap();
    const spy = spyOn(service.filter, 'next' ).and.callThrough();
    service.getFilter('nothing');
    expect(spy).not.toHaveBeenCalled();
  });

  it('#getFilter should not update observer ', () => {
    service.initFilterMap();
    const spy = spyOn(service.filter, 'next' ).and.callThrough();
    service.getFilter('nothing');
    expect(spy).not.toHaveBeenCalled();
  });

  it('#sendEmail should create an image request for a jpeg and call sendEmailRequest', () => {
    service.name = 'test';
    const image = 'test';
    const spy = spyOn(service, 'sendEmailRequest');
    service.email = 'test@test.com';
    service.extensionType = 'jpeg';
    service.sendEmail(image);
    expect(spy).toHaveBeenCalled();
  });

  it('#sendEmail should create an image request for a svg and call sendEmailRequest', () => {
    service.name = 'test';
    const image = 'test';
    const spy = spyOn(service, 'sendEmailRequest');
    service.email = 'test@test.com';
    service.extensionType = 'svg+xml';
    service.sendEmail(image);
    expect(spy).toHaveBeenCalled();
  });

  it('#sendEmailRequest should send a post request', () => {
    const emailRequest = {
      emailAddress: 'test@test.com',
      image: 'test',
      filename: 'test' + '.' + 'jpeg',
      imageType: 'image/' + 'jpeg'
    };
    const spy = spyOn(service.http, 'post').and.callThrough();
    service.sendEmailRequest(emailRequest);
    expect(spy).toHaveBeenCalled();
  });

  it('#getUserErrorMessage should return Impossible de procéder for error 422', () => {
    const result = service.getUserErrorMessage('blahblah : 422 blah blah');
    expect(result).toContain('Impossible de procéder à l\'envoie à cette adresse');
  });

  it('#getUserErrorMessage should return Limite du nombre for error 429', () => {
    const result = service.getUserErrorMessage('blahblah : 429 blah blah');
    expect(result).toContain('Limite du nombre de courriel par heure dépassée');
  });

  it('#getUserErrorMessage should return Courriel impossible a envoyé for other errors', () => {
    const result = service.getUserErrorMessage('blahblah : 410 blah blah');
    expect(result).toContain('Courriel impossible a envoyé');
  });

  it('#handleError should call open on the snackbar', () => {
    const error = new HttpErrorResponse({error: undefined});
    const spy = spyOn(service.snackBar, 'open');
    service.handleError(error);
    expect(spy).toHaveBeenCalled();
  });
});
