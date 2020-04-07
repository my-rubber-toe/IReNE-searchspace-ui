import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-collab-request',
  templateUrl: './collab-request.component.html',
  styleUrls: ['./collab-request.component.scss']
})
export class CollabRequestComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  firstName = new FormControl('', [Validators.required, Validators.minLength(1)]);
  lastName = new FormControl('', [Validators.required, Validators.minLength(1)]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor() { }

  ngOnInit(): void {
  }

}
