import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import {
    SavingFeatureConfirmationDialogComponent
} from '@app-components/saving-feature/saving-feature-confirmation-dialog/saving-feature-confirmation-dialog.component';
import { SavingFeatureDialogComponent } from '@app-components/saving-feature/saving-feature-dialog/saving-feature-dialog.component';
import { VideoDisplayerComponent } from '@app-components/user-guide/video-displayer/video-displayer.component';
import { NewDrawingAlertDialogComponent } from '@app-new-drawing/new-drawing-alert-dialog/new-drawing-alert-dialog.component';
import { NewDrawingCreationDialogComponent } from '@app-new-drawing/new-drawing-creation-dialog/new-drawing-creation-dialog.component';
import { DrawingViewReuseStrategy } from '../class/drawing-view-reuse-strategy';
import { AppComponent } from './components/app/app.component';
import { ColorEditPaletteComponent } from './components/color-edit/color-edit-palette/color-edit-palette.component';
import { ColorEditSliderComponent } from './components/color-edit/color-edit-slider/color-edit-slider.component';
import { ColorEditComponent } from './components/color-edit/color-edit.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DrawingModalWindowComponent } from './components/drawing-view/drawing-modal-window/drawing-modal-window.component';
import { DrawingViewComponent } from './components/drawing-view/drawing-view/drawing-view.component';
import { DrawingZoneComponent } from './components/drawing-view/drawing-zone/drawing-zone.component';
import { SidebarComponent } from './components/drawing-view/sidebar/sidebar.component';
import { EmailConfirmationComponent } from './components/export-drawing/email-confirmation/email-confirmation.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { KeyboardEventComponent } from './components/keyboard-event/keyboard-event.component';
import { RequestLoadingComponent } from './components/saving-feature/request-state-dialogs/request-loading/request-loading.component';
import { StartingMenuComponent } from './components/starting-menu/starting-menu.component';
import { SubjectNavComponent } from './components/user-guide/subject-nav/subject-nav.component';
import { UserGuideViewComponent } from './components/user-guide/user-guide-view/user-guide-view.component';
import { UserGuideComponent } from './components/user-guide/user-guide/user-guide.component';

const appRoutes: Routes = [
    { path: 'user-guide', component: UserGuideComponent },
    { path: 'drawing-view', component: DrawingViewComponent, data: {reuse: true} },
    { path: 'starting-menu', pathMatch: 'full', component: StartingMenuComponent },
    { path: '', redirectTo: '/starting-menu', pathMatch: 'full' },
];

@NgModule({
    declarations: [
        AppComponent,
        DrawingModalWindowComponent,
        DrawingZoneComponent,
        NewDrawingAlertDialogComponent,
        NewDrawingCreationDialogComponent,
        SidebarComponent,
        StartingMenuComponent,
        SubjectNavComponent,
        UserGuideComponent,
        UserGuideViewComponent,
        DrawingViewComponent,
        ColorPickerComponent,
        ColorEditComponent,
        ColorEditSliderComponent,
        ColorEditPaletteComponent,
        KeyboardEventComponent,
        SavingFeatureDialogComponent,
        SavingFeatureConfirmationDialogComponent,
        VideoDisplayerComponent,
        GalleryComponent,
        RequestLoadingComponent,
        VideoDisplayerComponent,
        RequestLoadingComponent,
        ExportDrawingComponent,
        EmailConfirmationComponent
    ],
    imports: [
        RouterModule.forRoot(appRoutes),
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatRadioModule,
        MatRippleModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RouterModule,
        MatIconModule,
        FormsModule,
        OverlayModule,
        MatCheckboxModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: DrawingViewReuseStrategy },
    ],
    bootstrap: [AppComponent],
    exports: [RouterModule, MatFormFieldModule, MatInputModule],
    entryComponents: [
        NewDrawingAlertDialogComponent,
        NewDrawingCreationDialogComponent,
        GalleryComponent,
        SavingFeatureDialogComponent,
        SavingFeatureConfirmationDialogComponent,
        RequestLoadingComponent,
        ColorEditComponent,
        ExportDrawingComponent,
        EmailConfirmationComponent
    ]
})
export class AppModule {}
