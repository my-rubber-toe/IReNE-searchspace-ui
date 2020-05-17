import {Component, Inject, Injectable} from '@angular/core';
import {AuthService, GoogleLoginProvider, SocialUser} from 'angularx-social-login';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
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
   * Use google sign in to retrieve the information to create a Collaborator Request and sent the Google token for validation
   * on backend
   */
  public signUp() {
    localStorage.clear();
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(error => {}
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
              (e: HttpErrorResponse) => {
                if (e.status === 409) {
                  this.dialog.open(DialogDataComponent, {
                    data: {
                      success: false,
                      message: 'This Request has been created already, please wait for the decision of the administrators.',
                    }
                  });
                } else {
                  if (e.status === 400) {
                    this.dialog.open(DialogDataComponent, {
                      data: {
                        success: false,
                        message: 'Invalid email, only emails from UPR are allowed',
                      }
                    });
                  } else {
                    this.dialog.open(DialogDataComponent, {
                      data: {
                        success: false,
                        message: 'The request can not be created. Please contact an administrator',
                      }
                    });
                  }
              }
              });
          this.signOut();
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
  message: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.success = data.success;
    this.message = data.message;
  }
}
