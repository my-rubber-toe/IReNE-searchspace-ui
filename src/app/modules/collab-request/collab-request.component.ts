import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SingupService} from '../../shared/services/singup.service';

@Component({
  selector: 'app-collab-request',
  templateUrl: './collab-request.component.html',
  styleUrls: ['./collab-request.component.scss']
})
export class CollabRequestComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  firstName = new FormControl('', [Validators.required, Validators.minLength(1)]);
  lastName = new FormControl('', [Validators.required, Validators.minLength(1)]);

  signUp() {
    this.singupService.signUp();
  }

  constructor(
    private singupService: SingupService,
  ) { }

  ngOnInit(): void {
  }
}
