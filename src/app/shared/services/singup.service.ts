import {Injectable} from '@angular/core';
import {AuthService, GoogleLoginProvider} from 'angularx-social-login';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import Swal from 'sweetalert2';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SingupService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private socialAuthService: AuthService,
    private http: HttpClient,
  ) {}

  /**
   * Use google sing in to retrive the information to create a Collaborator Request
   */
  public signUp() {
    localStorage.clear();
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => {
        // on success this will return user data from google.
        Swal.fire(
          `Hi ${userData.firstName}, Creating Request.\n Please wait`
        );
        Swal.showLoading();
        this.collabRequest(userData.firstName, userData.lastName, userData.email, userData.idToken)
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
            });
      }
    );
  }
  /**
   *  Send the info for creating a  Collaborator request
   */
  private collabRequest(firstName: string, lastName: string, email: string, idToken: string) {
    return this.http.post(`${environment.serverUrl}/collab-request/`, {firstName , lastName, email, idToken }, this.httpOptions);
  }

  /**
   * Sign outs the user after retrieving the information
   */
  signOut(): void {
    this.socialAuthService.signOut();
  }
}
