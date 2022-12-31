import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../common/communication/drawing';
import { SavedDrawingsService } from '../saved-drawings/saved-drawings.service';

// Source: Most of this code is inspired of the MongoDB tutorial, provided on Moodle

@Injectable({
  providedIn: 'root'
})
export class DatabaseRequestsService {

  constructor(
    public http: HttpClient,
    private savedDrawingsService: SavedDrawingsService) { }

  async sendDrawing(newDrawing: Drawing, oldDrawing: Drawing, isExistingDrawing: boolean): Promise<void> {
    return isExistingDrawing ? this.updateDrawing([newDrawing, oldDrawing]) : this.createDrawing(newDrawing);
  }

  async createDrawing(inputDrawing: Drawing): Promise<void> {
    this.http.post('http://localhost:3000/database/addDrawing', inputDrawing, {observe: 'response', responseType: 'text'})
    .subscribe((res) => {
      (res.body === 'CREATED') ? Promise.resolve() : Promise.reject();
    });
  }

  async updateDrawing(inputDrawings: Drawing[]): Promise<void> {
    this.http.patch('http://localhost:3000/database/updateDrawing', inputDrawings, {observe: 'response', responseType: 'text'})
    .subscribe((res) => {
      (res.body === 'OK') ? Promise.resolve() : Promise.reject();
    });
  }

  async getDrawings(): Promise<void> {
    this.http.get<Drawing[]>('http://localhost:3000/database/getAllDrawings')
    .subscribe((data) => {
      this.savedDrawingsService.updateSavedDrawings(data);
      Promise.resolve();
    });
  }

  async deleteDrawing(inputDrawing: Drawing): Promise<void> {
    const url = 'http://localhost:3000/database/:' + inputDrawing.name;
    this.http.delete(url, {observe: 'response', responseType: 'text'})
    .subscribe((res) => {
      (res.body === 'OK') ? Promise.resolve() : Promise.reject();
    });
  }
}
