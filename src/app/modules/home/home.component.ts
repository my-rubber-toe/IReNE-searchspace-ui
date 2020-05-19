/*
  Author: Alejandro Vasquez Nuñez <alejandro.vasquez@upr.edu>
*/
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
  ) {
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

  /**
   * Used by the search bar for redirecting to /documents and sending the values as query parameters.
   * @param event value in the search bar
   */
  sendSubmit(event: Event) {
    this.router.navigate(['/documents'], {queryParams: {search: event}});
  }
}
