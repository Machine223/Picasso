import { Component, Input } from '@angular/core';
import { Subject } from '../../../../class/subject';

@Component({
  selector: 'app-video-displayer',
  templateUrl: './video-displayer.component.html',
  styleUrls: ['./video-displayer.component.scss']
})
export class VideoDisplayerComponent    {
  @Input() informationSubject: Subject;

  hasVideo(): boolean {
    return this.informationSubject.imageLink !== undefined;
  }
}
