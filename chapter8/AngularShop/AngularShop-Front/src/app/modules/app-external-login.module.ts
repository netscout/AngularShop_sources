import { NgModule } from '@angular/core';

import { SocialLoginModule, SocialAuthServiceConfig,
  GoogleLoginProvider } from "angularx-social-login";

let config = {
  autoLogin: false,
  providers:[
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        "..."
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
