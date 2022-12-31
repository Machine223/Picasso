import { PortalModule } from '@angular/cdk/portal';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SubjectNavComponent } from './subject-nav.component';

describe('SubjectNavComponent', () => {
  let component: SubjectNavComponent;
  let fixture: ComponentFixture<SubjectNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubjectNavComponent,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelDescription,
        MatAccordion
      ],
      imports: [
        PortalModule,
        RouterModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
