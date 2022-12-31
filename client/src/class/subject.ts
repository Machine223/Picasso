export class Subject {

  subjectTitle: string;
  description: string;
  imageLink ?: string;
  shortcut ?: string;

  constructor(subjectTitle: string, description: string, imageLink?: string, shortcut?: string) {
    this.subjectTitle = subjectTitle;
    this.description = description;
    this.imageLink = imageLink;
    this.shortcut = shortcut;
  }
}
