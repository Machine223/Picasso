import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatButtonToggleGroup,
  MatCheckbox,
  MatDialogModule,
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatFormFieldModule,
  MatIcon,
  MatOption,
  MatPseudoCheckbox,
  MatRippleModule,
  MatSelect,
  MatSlider,
  MatSnackBarModule,
  MatTooltipModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { OutlineRectangle } from '@app-services/drawing/shapes/rectangle/outline-rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';
import { DrawingModalWindowComponent } from '../drawing-modal-window/drawing-modal-window.component';
import { DrawingZoneComponent } from '../drawing-zone/drawing-zone.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DrawingViewComponent } from './drawing-view.component';

const MOCK_WIDTH_RECTANGLE = 10;
const MOCK_HEIGHT_RECTANGLE = 10;
const MOCK_SCROLL = 10;

describe('DrawingViewComponent', () => {
  let component: DrawingViewComponent;
  let fixture: ComponentFixture<DrawingViewComponent>;
  let selectorTool: SelectorToolService;
  let toolProperties: ToolPropertiesService;
  let colorsService: ColorsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrawingViewComponent,
        SidebarComponent,
        ColorPickerComponent,
        DrawingModalWindowComponent,
        DrawingZoneComponent,
        MatDrawer,
        MatDrawerContainer,
        MatButtonToggleGroup,
        MatIcon,
        MatSlider,
        MatOption,
        MatSelect,
        MatDrawerContent,
        MatPseudoCheckbox,
        MatCheckbox
      ],
      imports: [
        MatTooltipModule,
        FormsModule,
        MatRippleModule,
        MatDialogModule,
        OverlayModule,
        MatFormFieldModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewComponent);
    selectorTool = TestBed.get(SelectorToolService);
    toolProperties = new ToolPropertiesService();
    colorsService = new ColorsService();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#scroll if target is not null should select scrollLeft and scrollTop of eventTarget be defined', () => {
    const event = new Event('mouseleave', );
    const selectedRectangle = new OutlineRectangle(colorsService, toolProperties, true);
    selectedRectangle.startingPoint = new Coordinates(0, 0);
    selectedRectangle.width = MOCK_WIDTH_RECTANGLE;
    selectedRectangle.height = MOCK_HEIGHT_RECTANGLE;
    const MOCK_EVENT = Object.defineProperty(event, 'target', {writable: false, value: selectedRectangle});
    window.scrollTo(MOCK_SCROLL, MOCK_SCROLL);
    component.scroll(MOCK_EVENT);
    expect(selectorTool.selector.scroll).toBeDefined();
  });

  it('#scroll if target is null select scrollLeft and scrollTop should be defined at 0', () => {
    const event = new Event('mouseleave', );
    const MOCK_EVENT = Object.defineProperty(event, 'event', {});
    window.scrollTo(0, 0);
    component.scroll(MOCK_EVENT);
    expect(selectorTool.selector.scroll).toBeDefined();
    expect(selectorTool.selector.scroll[0]).toBe(0);
    expect(selectorTool.selector.scroll[0]).toBe(0);
  });
});
