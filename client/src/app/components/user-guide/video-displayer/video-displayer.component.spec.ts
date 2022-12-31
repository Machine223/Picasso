import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from '../../../../class/subject';
import { VideoDisplayerComponent } from './video-displayer.component';

describe('VideoDisplayerComponent', () => {
  let component: VideoDisplayerComponent;
  let fixture: ComponentFixture<VideoDisplayerComponent>;
  const MOCK_SUBJECT: Subject = new Subject('', '', '');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoDisplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoDisplayerComponent);
    component = fixture.componentInstance;
    component.informationSubject = MOCK_SUBJECT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
