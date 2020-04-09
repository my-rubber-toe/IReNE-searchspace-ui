import {Injectable} from '@angular/core';

import {AuthService, GoogleLoginProvider} from 'angularx-social-login';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SingupService {
  fakeBackend = 'http://localhost:4200/api';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private socialAuthService: AuthService,
    private http: HttpClient,
  ) {}

  public signUp() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => {
        // on success this will return user data from google.
        console.log('success', userData);
        Swal.fire(
          `Hi ${userData.firstName}, Creating Request.\n Please wait`
        );
        Swal.showLoading();
        this.collabRequest(userData.firstName, userData.lastName, userData.email)
          .subscribe(
            x => {
              Swal.fire('Access Request', 'Access Request created', 'success');
              this.signOut();
            },
            (error) => {
              Swal.fire(
                'Request Failed',
                'Request already exists',
                'error'
              );
              console.log(error);
            });
      }
    );
  }
  private  collabRequest(firstName: string, lastName: string, email: string) {
    /**
     *  Send the info for creating a  Collaborator request
     */
    return this.http.post(`${this.fakeBackend}/collabrequest/create`, {firstName , lastName, email }, this.httpOptions);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }
}
