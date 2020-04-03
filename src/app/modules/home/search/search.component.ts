import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {not} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  hintDescription = 'Advance Search';
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
