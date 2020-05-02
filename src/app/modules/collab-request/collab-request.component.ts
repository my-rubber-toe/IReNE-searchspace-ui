import {Component, OnInit} from '@angular/core';
// @ts-ignore
import {SingupService} from '../../shared/services/singup.service';

@Component({
  selector: 'app-collab-request',
  templateUrl: './collab-request.component.html',
  styleUrls: ['./collab-request.component.scss']
})
export class CollabRequestComponent implements OnInit {
  /**
   * Calling the Sign Up service
   */
  signUp() {
    this.singupService.signUp();
  }

  constructor(
    private singupService: SingupService,
  ) {
  }

  ngOnInit(): void {
  }
}
