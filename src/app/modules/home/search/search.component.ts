import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() typed = new EventEmitter();
  @Output() empty = new EventEmitter();
  public search;
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
