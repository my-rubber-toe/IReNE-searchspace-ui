import {Component, Inject, Injectable} from '@angular/core';
import {AuthService, GoogleLoginProvider, SocialUser} from 'angularx-social-login';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SingupService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };
  activeDialog;

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
      (userData: SocialUser) => {
        if (userData instanceof SocialUser) {
          const emailValidator = new FormControl(userData.email, Validators.pattern('^[\\.a-z0-9]*(@upr\\.edu)$'));
          if (!emailValidator.hasError('pattern')) {
          this.activeDialog = this.dialog.open(ConfirmDataComponent, {
            data: {
              message: 'Your full name in the account is: ' + userData.firstName + ' ' + userData.lastName + '. Do you want to' +
                ' create the request with this name?',
              changeName: false,
            },
            disableClose: true
          }).afterClosed().subscribe((result) => {
              if (result === false) {
                this.activeDialog = this.dialog.open(ConfirmDataComponent, {
                  data: {
                    changeName: !result,
                  },
                  disableClose: true
                }).afterClosed().subscribe((response) => {
                  userData.firstName = response.firstName;
                  userData.lastName = response.lastName;
                  this.createRequest(userData);
                });
              } else {
                this.createRequest(userData);
              }
            }
          );
        } else {
            this.dialog.open(DialogDataComponent, {
              data: {
                success: false,
                message: 'Invalid email, only emails from UPR are allowed',
              }
            });
            this.signOut();
          }
        }
      }
    );
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

  private createRequest(userData: SocialUser) {
    if (userData instanceof SocialUser) {
      this.collabRequest(userData.firstName, userData.lastName, userData.email, userData.idToken)
        .subscribe(
          x => {
            this.dialog.open(DialogDataComponent, {
              data: {
                success: true,
              }
            });
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
            this.signOut();
          });
    }
  }
}

@Component({
  selector: 'app-dialog-data-component',
  templateUrl: 'dialog-data.html',
})
export class DialogDataComponent {
  success: any;
  message: any;

  constructor(public dialogRef: MatDialogRef<DialogDataComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.success = data.success;
    this.message = data.message;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-confirm-data-component',
  templateUrl: 'confirm-data.html',
})
export class ConfirmDataComponent {
  message: any;
  changeName: boolean;
  user = {
    firstName : '',
    lastName : ''
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.message = data.message;
    this.changeName = data.changeName;
  }
}
