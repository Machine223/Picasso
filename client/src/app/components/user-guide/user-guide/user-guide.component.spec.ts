import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatAccordion,
  MatCard,
  MatCardSubtitle,
  MatCardTitle,
  MatDrawer,
  MatDrawerContainer,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatFormField,
  MatIcon,
  MatLabel,
  MatOption,
  MatSelect,
   } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router} from '@angular/router';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';
import { DrawingModalWindowComponent } from '../../drawing-view/drawing-modal-window/drawing-modal-window.component';
import { DrawingViewComponent } from '../../drawing-view/drawing-view/drawing-view.component';
import { DrawingZoneComponent } from '../../drawing-view/drawing-zone/drawing-zone.component';
import { SidebarComponent } from '../../drawing-view/sidebar/sidebar.component';
import { StartingMenuComponent } from '../../starting-menu/starting-menu.component';
import { SubjectNavComponent } from '../subject-nav/subject-nav.component';
import { UserGuideViewComponent } from '../user-guide-view/user-guide-view.component';
import { UserGuideComponent } from './user-guide.component';

describe('UserGuideComponent', () => {
  let component: UserGuideComponent;
  let fixture: ComponentFixture<UserGuideComponent>;
  let routerStub;
  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };
    TestBed.configureTestingModule({
      declarations: [
        UserGuideComponent,
        UserGuideViewComponent,
        DrawingViewComponent,
        StartingMenuComponent,
        SubjectNavComponent,
        DrawingZoneComponent,
        ColorPickerComponent,
        DrawingModalWindowComponent,
        SidebarComponent,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelDescription,
        MatAccordion,
        MatDrawer,
        MatDrawerContainer,
        MatCardTitle,
        MatCardSubtitle,
        MatCard,
        MatLabel,
        MatOption,
        MatSelect,
        MatFormField,
        MatIcon
      ],
      providers: [
        { provide: Router, useValue: routerStub }
      ],
      imports: [PortalModule, MatSliderModule, OverlayModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(UserGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
}
);
