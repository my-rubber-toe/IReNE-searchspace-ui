import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'preview'
})
/**
 * Pipe to bypass html sanitizer on ckeditor data.
 */
export class PreviewPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}

  /**
   * Bypass the html sanitizer so css can be duplicated for view the document exactly like CkEditor.
   * @param value Data to bypass the the sanitizer
   */
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

}
