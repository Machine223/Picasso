import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Drawing } from '../../../../../common/communication/drawing';
import { DatabaseRequestsService } from './database-requests.service';

const MOCK_DRAWING: Drawing = { name: 'test', tags: [], metadata: '', previewSource: '' };

describe('DatabaseRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  }));

  let service: DatabaseRequestsService;

  beforeEach(() => {
    service = TestBed.get(DatabaseRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#sendDrawing should call createDrawing if drawing does not exist', async () => {
    const spy = spyOn(service, 'createDrawing').and.callThrough();
    await service.sendDrawing(MOCK_DRAWING, MOCK_DRAWING, false);
    expect(spy).toHaveBeenCalled();
  });

  it('#sendDrawing should call updateDrawing if drawing exists', () => {
    const spy = spyOn(service, 'updateDrawing').and.callThrough();
    service.sendDrawing(MOCK_DRAWING, MOCK_DRAWING, true);
    expect(spy).toHaveBeenCalled();
  });

  // tslint:disable-next-line: no-any
  it('#createDrawing should create a Drawing if http status is CREATED', (done: any) => {
    spyOn(service.http, 'post').and.returnValue(of({body: 'CREATED'}));
    const spy = spyOn(Promise, 'resolve');
    service.createDrawing(MOCK_DRAWING).then(() => expect(spy).toHaveBeenCalled());
    done();
  });

  // tslint:disable-next-line: no-any
  it('#createDrawing should not create a Drawing if http status is not CREATED', (done: any) => {
    spyOn(service.http, 'post').and.returnValue(of({body: 'NOT CREATED'}));
    const spy = spyOn(Promise, 'resolve');
    service.createDrawing(MOCK_DRAWING).then(() => expect(spy).not.toHaveBeenCalled());
    done();
  });

  // tslint:disable-next-line: no-any
  it('#updateDrawing should update a Drawing if http status is OK', (done: any) => {
    spyOn(service.http, 'patch').and.returnValue(of({body: 'OK'}));
    const spy = spyOn(Promise, 'resolve');
    service.updateDrawing([MOCK_DRAWING, MOCK_DRAWING]).then(() => expect(spy).toHaveBeenCalled());
    done();
  });

  // tslint:disable-next-line: no-any
  it('#updateDrawing should not update a Drawing if http status is not OK', (done: any) => {
    spyOn(service.http, 'patch').and.returnValue(of({body: 'NOT OK'}));
    const spy = spyOn(Promise, 'resolve');
    service.updateDrawing([MOCK_DRAWING, MOCK_DRAWING]).then(() => expect(spy).not.toHaveBeenCalled());
    done();
  });

  // tslint:disable-next-line: no-any
  it('#getDrawings should get all Drawings', (done: any) => {
    spyOn(service.http, 'get').and.returnValue(of(MOCK_DRAWING));
    const spy = spyOn(Promise, 'resolve');
    service.getDrawings().then(() => expect(spy).toHaveBeenCalled());
    done();
  });

  // tslint:disable-next-line: no-any
  it('#deleteDrawing should delete a Drawing if http status is OK', (done: any) => {
    spyOn(service.http, 'delete').and.returnValue(of({body: 'OK'}));
    const spy = spyOn(Promise, 'resolve');
    service.deleteDrawing(MOCK_DRAWING).then(() => expect(spy).toHaveBeenCalled());
    done();
  });

  // tslint:disable-next-line: no-any
  it('#deleteDrawing should not delete a Drawing if http status is not OK', (done: any) => {
    spyOn(service.http, 'delete').and.returnValue(of({body: 'NOT OK'}));
    const spy = spyOn(Promise, 'resolve');
    service.deleteDrawing(MOCK_DRAWING).then(() => expect(spy).not.toHaveBeenCalled());
    done();
  });
});
