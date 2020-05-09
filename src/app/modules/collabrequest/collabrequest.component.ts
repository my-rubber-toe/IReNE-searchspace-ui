import {Component, OnInit} from '@angular/core';
import {SingupService} from '../../shared/services/singup.service';

@Component({
  selector: 'app-collab-request',
  templateUrl: './collabrequest.component.html',
  styleUrls: ['./collabrequest.component.scss']
})
export class CollabrequestComponent implements OnInit {
  private success: boolean;
  constructor(
    private singupService: SingupService,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Calling the Sign Up service
   */
 signUp() {
   this.singupService.signUp();

  }
}
