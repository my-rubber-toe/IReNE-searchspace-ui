import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'preview'
})
export class PreviewPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

}
