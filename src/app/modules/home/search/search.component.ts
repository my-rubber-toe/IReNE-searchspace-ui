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
   * Event emitter for when the user types a value in the searchbar
   */
  @Output() typed = new EventEmitter();
  /**
   * Event emitter for when the user deletes the value in the searchbar
   */
  @Output() empty = new EventEmitter();
  /**
   * form control
   */
  public search;

  /**
   * Send and event with the value of the search and a different event when the user deletes the value in the searchbar
   * @param event value of the Searchbar
   */
  apply(event: Event) {
    if ((event.target as HTMLInputElement).value === '') {
      this.empty.emit(event);
    } else {
      this.typed.emit(event);
    }
  }

  constructor() {
  }

  ngOnInit(): void {
    this.search = new FormControl('');
  }

}
