import { NgModule } from '@angular/core';

import { SocialLoginModule, SocialAuthServiceConfig,
  GoogleLoginProvider } from "angularx-social-login";

let config = {
  autoLogin: false,
  providers:[
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        "481313592668-lt1n7101b05j6hvep9ingj6891ncu0sq.apps.googleusercontent.com"
        )
    }
  ]
};

export function provideConfig() {
  return config as SocialAuthServiceConfig;
}

@NgModule({
  imports: [
    SocialLoginModule
  ],
  providers: [
    {
      provide: "SocialAuthServiceConfig",
      useFactory: provideConfig
    }
  ]
})
export class ExternalLoginModule { }
