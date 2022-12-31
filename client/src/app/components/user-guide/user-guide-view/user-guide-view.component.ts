import { Component, OnInit } from '@angular/core';
import { GuideInformationService } from '@app-services/guide-information/guide-information.service';
import {Subject} from '../../../../class/subject';

@Component({
  selector: 'app-user-guide-view',
  templateUrl: './user-guide-view.component.html',
  styleUrls: ['./user-guide-view.component.scss']
})
export class UserGuideViewComponent implements OnInit {

  information: Subject;

  constructor(private serviceSubject: GuideInformationService) {}

  ngOnInit(): void {
    this.serviceSubject.selectedSubjectObservable.subscribe((information: Subject) => this.information = information);
  }

  hasImage(information: Subject): boolean {
    return information.imageLink !== undefined;
  }
}
