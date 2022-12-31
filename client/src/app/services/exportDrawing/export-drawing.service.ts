import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EmailRequestClientServer } from '../../../../../common/communication/email-request-client-server';
import { ExtensionType, FilterType } from '../../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ExportDrawingService {
  extensionTypeArray: string [] = [
    ExtensionType.svg, ExtensionType.png, ExtensionType.jpeg
  ];
  filterTypeArray: string [] = [
    FilterType.none, FilterType.blur, FilterType.sepia,
    FilterType.hueRotate, FilterType.grayscale, FilterType.invert
  ];
  extensionType: string;
  filterType: string;
  name: string;
  email: string;
  filter: ReplaySubject<string>;
  mapFilter: Map<string , () => void>;

  constructor(public http: HttpClient,
              public snackBar: MatSnackBar) {
    this.filter = new ReplaySubject<string>(1);
    this.extensionType = ExtensionType.svg;
    this.filterType = FilterType.none;
    this.initFilterMap();
  }

  initFilterMap(): void {
    this.mapFilter = new Map<string , () => void>();
    this.mapFilter.set(FilterType.none, () => {this.filter.next('none'); });
    this.mapFilter.set(FilterType.blur, () => {this.filter.next('blur(7px)'); });
    this.mapFilter.set(FilterType.sepia, () => {this.filter.next('sepia(100%)'); });
    this.mapFilter.set(FilterType.grayscale, () => {this.filter.next('grayscale(1)'); });
    this.mapFilter.set(FilterType.hueRotate, () => {this.filter.next('hue-rotate(130deg)'); });
    this.mapFilter.set(FilterType.invert, () => {this.filter.next('invert(90%)'); });
  }

  getFilter(filter: string): void {
    (this.mapFilter.get(filter) || (() => null))();
  }

  async sendEmail(image: string): Promise<void> {
    if (!this.validateName()) {
      alert('Exportation impossible. Veuillez vous assurer que vos entrées respectent le format mentionné ci-dessus et recommencez.');
      return;
    }
    const extension = this.extensionType === ExtensionType.svg ? 'svg+xml' : this.extensionType;
    const emailRequest = {
      emailAddress: this.email,
      image,
      filename: this.name + '.' + this.extensionType,
      imageType: 'image/' + extension
    };
    return this.sendEmailRequest(emailRequest);
  }

  async sendEmailRequest(inputDrawing: EmailRequestClientServer): Promise<void> {
    this.http.post('http://localhost:3000/email-handler/email', inputDrawing, {observe: 'response', responseType: 'text'})
      .pipe(tap((_) => this.snackBar.open('Courriel envoyé.', 'Close', {duration: 3000})),
        catchError(this.handleError.bind(this))).subscribe();
  }

  validateName(): boolean {
    return this.name !== '' && this.name !== undefined;
  }

  getUserErrorMessage(error: string): string {
    const errorNumber = error.replace(/[^0-9]/g, '');
    const mapMessage = new Map<string, string>();
    mapMessage.set('422', 'Impossible de procéder à l\'envoie à cette adresse');
    mapMessage.set('429', 'Limite du nombre de courriel par heure dépassée');
    mapMessage.set('413', 'Image trop grosse pour envoyer par courriel');
    return mapMessage.get(errorNumber) || 'Courriel impossible a envoyé';
  }

  handleError(error: HttpErrorResponse): Observable<never[]> {
    this.snackBar.open(this.getUserErrorMessage(error.message), 'Close', {duration: 3000});
    return of([]);
  }

}
