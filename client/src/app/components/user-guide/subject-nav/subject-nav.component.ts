import { Component, OnInit } from '@angular/core';
import { GuideInformationService } from '@app-services/guide-information/guide-information.service';
import { RouteListenerService } from '@app-services/route-listener/route-listener.service';
import {Subject } from '../../../../class/subject';

@Component({
  selector: 'subject-nav',
  templateUrl: './subject-nav.component.html',
  styleUrls: ['./subject-nav.component.scss']
})
export class SubjectNavComponent implements OnInit {

  isHovering: boolean[];
  selectedSubject: Subject;
  previousRoute: string;

  constructor(private guideInformationService: GuideInformationService, private routeListener: RouteListenerService) {
    this.previousRoute = this.routeListener.getPreviousUrl();
    this.isHovering = [false, false, false, false];
  }

  setHover(num: number, bool: boolean): void {
    this.isHovering[num] = bool;
  }

  ngOnInit(): void {
    this.guideInformationService.selectedSubjectObservable.subscribe((information: Subject) => this.selectedSubject = information);
  }
}
