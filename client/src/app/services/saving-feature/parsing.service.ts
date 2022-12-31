import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParsingService {
  svgBody: string;
  gTagsBody: string;
  base64data: string;
  name: string;
  xml: string;
  context2D: CanvasRenderingContext2D;
  image: HTMLImageElement;

  constructor() {
    this.name = '';
    this.image = new Image();
  }

  // Source: https://stackoverflow.com/questions/57346889/how-to-return-base64-data-from-a-fetch-promise
  extractSVG(): void {
    const blob = this.createBlob();
    let base64data: string;
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        base64data = reader.result as string;
        resolve();
      };
    }).then(() => {
      this.base64data = base64data;
    });
  }

  createBlob(): File {
    // Serializing HTML to XML (Source: https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)
    const htmlTranscript = new XMLSerializer().serializeToString(document);
    this.svgBody = this.getSvgTagsBody(htmlTranscript);   // For instant preview
    this.gTagsBody = this.getInnerSvgTagsBody(this.svgBody);   // For database
    // Source: https://dev.to/benjaminblack/using-a-string-of-svg-as-an-image-source-8mo
    const blob = new Blob([this.svgBody], { type: 'image/svg+xml' });
    return blob as File;
  }

  getSvgTagsBody(htmlTranscript: string): string {
    const openingTag = '<svg';
    const closingTag = '</svg>';
    let writing = false;
    let extract = '';

    for (let i = 0; i < htmlTranscript.length; i++) {
      if (!writing && htmlTranscript.substr(i, openingTag.length) === openingTag) {
        writing = true;
        extract += htmlTranscript[i];
      } else if (writing) {
        if (htmlTranscript.substr(i, closingTag.length) === closingTag) {
          extract += htmlTranscript.substr(i, closingTag.length);
          break;
        }
        extract += htmlTranscript[i];
      }
    }
    return extract;
  }

  getInnerSvgTagsBody(svgTagsBody: string): string {
    const closingTag = '</svg>';
    let writing = false;
    let extract = '';
    for (let i = 0; i < svgTagsBody.length; i++) {
      if (!writing && svgTagsBody[i] === '>') {
        writing = true;
      } else if (writing) {
        if (svgTagsBody.substr(i, closingTag.length) !== closingTag) {
          extract += svgTagsBody[i];
        } else {
          break;
        }
      }
    }
    return extract;
  }

  updateCanvasSVG(contextUpdate: CanvasRenderingContext2D): void {
    this.context2D = contextUpdate;
  }

  updateImage(image: HTMLImageElement): void {
    this.image = image;
    this.parsingImage();
  }

  updateSerializer(xml: string): void {
    this.xml = xml;
  }

  parsingImage(): void {
    this.image.src = 'data:image/svg+xml;base64,' + btoa(this.xml);
  }
}
