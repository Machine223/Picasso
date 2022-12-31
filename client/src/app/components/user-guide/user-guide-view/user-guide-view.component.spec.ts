import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { Subject } from '../../../../class/subject';
import { VideoDisplayerComponent } from '../video-displayer/video-displayer.component';
import { UserGuideViewComponent } from './user-guide-view.component';

describe('UserGuideViewComponent', () => {
  let component: UserGuideViewComponent;
  let fixture: ComponentFixture<UserGuideViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserGuideViewComponent,
        VideoDisplayerComponent
      ],
      imports: [RouterModule.forRoot([])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#hasImage() should return true when there is an image link ', () =>  {
    const mockSubject: Subject = new Subject('MockSubject', 'This is a mock', 'This is a link');
    spyOn(component, 'hasImage').and.callThrough();
    expect(component.hasImage(mockSubject)).toBeTruthy();
  });
  it('#hasImage() should return false when there is no image link', () =>  {
    const mockSubject: Subject = new Subject('MockSubject', 'This is a mock');
    spyOn(component, 'hasImage').and.callThrough();
    expect(component.hasImage(mockSubject)).toBeFalsy();
  });
});
