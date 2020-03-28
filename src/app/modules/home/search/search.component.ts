import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() typed = new EventEmitter();
  apply(event: Event) {
    this.typed.emit(event);
  }
  constructor() {
  }

  ngOnInit(): void {
  }

}
