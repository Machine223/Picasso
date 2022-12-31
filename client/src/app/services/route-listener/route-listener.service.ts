import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// reference : https://blog.hackages.io/our-solution-to-get-a-previous-route-with-angular-5-601c16621cf0
@Injectable({
  providedIn: 'root'
})
export class RouteListenerService {

  previousUrl: string;

  constructor(private router: Router) {}

  loadRouting(): void {
    this.router.events.pipe(filter
      ((event) => event instanceof  NavigationEnd)).subscribe(({url}: NavigationEnd) => {this.previousUrl = url; });
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

}
