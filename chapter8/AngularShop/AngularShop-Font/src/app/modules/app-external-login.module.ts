import { NgModule } from '@angular/core';

import { SocialLoginModule, AuthServiceConfig,
  GoogleLoginProvider } from "angularx-social-login";

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      "167144325628-qb33vqa1fau09m2ndie53f1qqndo48f0.apps.googleusercontent.com"
      )
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})
export class ExternalLoginModule { }
