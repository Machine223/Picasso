import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLoadingComponent } from './request-loading.component';

describe('RequestLoadingComponent', () => {
  let component: RequestLoadingComponent;
  let fixture: ComponentFixture<RequestLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
