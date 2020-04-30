import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DefaultModule} from './layouts/default/default.module';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import { PreviewModule } from './layouts/preview/preview.module';
import {SocialLoginModule, AuthServiceConfig, LoginOpt} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
};

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('209439887125-id2acbns7n6ne7aoko5e6su20oqnk300.apps.googleusercontent.com',
      googleLoginOptions)
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DefaultModule,
    HttpClientModule,
    MatNativeDateModule,
    PreviewModule,
    SocialLoginModule,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
