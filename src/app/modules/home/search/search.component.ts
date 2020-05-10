import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {
  /**
   * Event emitter for when the user types a value in the search bar
   */
  @Output() typed = new EventEmitter();
  /**
   * Event emitter for when the user deletes the value in the search bar
   */
  @Output() empty = new EventEmitter();
  /**
   * Event emitter for when the user submit the value in the search bar
   */
  @Output() submitEvent = new EventEmitter();
  /**
   * form control
   */
  public search;
  /**
   * Send and event with the value of the search and a different event when the user deletes the value in the search bar
   * @param event value of the Search bar
   */
  apply(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.empty.emit(event);
    } else {
      this.typed.emit(event);
    }
  }

  /**
   * @ignore
   */
  constructor(
  ) {
  }

  /**
   * Initiate the form control of the search
   */
  ngOnInit(): void {
    this.search = new FormControl('');
  }

  /**
   * Emits an event with value of the search control.
   */
  applySubmit() {
    this.submitEvent.emit(this.search.value);
  }
}
