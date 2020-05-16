import {Component, Inject, Injectable} from '@angular/core';
import {AuthService, GoogleLoginProvider, SocialUser} from 'angularx-social-login';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class SingupService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };
  private success: boolean;

  constructor(
    private socialAuthService: AuthService,
    private http: HttpClient,
    public dialog: MatDialog,
  ) {
  }

  /**
   * Use google sing in to retrieve the information to create a Collaborator Request and sent the Google token for validation
   * on backend
   */
  public signUp() {
    localStorage.clear();
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(reason => {}
    ).then(
      (userData) => {
        if (userData instanceof SocialUser) {
          this.collabRequest(userData.firstName, userData.lastName, userData.email, userData.idToken)
            .subscribe(
              x => {
                this.success = true;
                this.dialog.open(DialogDataComponent, {
                  data: {
                    success: true,
                  }
                });
                this.signOut();
              },
              () => {
                this.dialog.open(DialogDataComponent, {
                  data: {
                    success: false,
                  }
                });
                this.signOut();
              });
        }
      }
    ).finally(() => {
      return this.success;
    });
  }

  /**
   * Sign outs the user after retrieving the information
   */
  signOut(): void {
    this.socialAuthService.signOut();
  }

  /**
   *  Send the info for creating a  Collaborator request
   */
  private collabRequest(firstName: string, lastName: string, email: string, idToken: string) {
    return this.http.post(`${environment.serverUrl}/collab-request/`, {firstName, lastName, email, idToken}, this.httpOptions);
  }
}

@Component({
  selector: 'app-dialog-data-component',
  templateUrl: 'dialog-data.html',
})
export class DialogDataComponent {
  success: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,) {
    this.success = data.success;
  }
}
