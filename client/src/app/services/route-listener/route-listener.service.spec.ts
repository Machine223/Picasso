import { inject, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RouteListenerService } from './route-listener.service';

describe('RouteListenerService', () => {

  let service: RouteListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])]
    });
    service = TestBed.get(RouteListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getPreviousUrl should return previousUrl', () => {
    const expectedValue = 'test';
    service.previousUrl = expectedValue;
    const returnedValue = service.getPreviousUrl();
    expect(returnedValue).toEqual(expectedValue);
  });

  it('#loadRouting should be called',
  inject([Router], (router: Router) => {
      spyOn(router.events, 'pipe').and.returnValue(of('fakeUrl'));
      const spyLoadingRoute = spyOn(service, 'loadRouting').and.callThrough();
      router.events.pipe(filter((event) => event instanceof  NavigationEnd)).subscribe();
      service.loadRouting();
      expect(spyLoadingRoute).toHaveBeenCalled();
    })
  );

});
