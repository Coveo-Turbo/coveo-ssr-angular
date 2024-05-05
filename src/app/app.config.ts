import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { InitProvider } from './init.service';

export const appConfig: ApplicationConfig = {
  providers: [
    InitProvider,
    provideRouter(routes), 
    provideAnimations(),
    provideClientHydration()]
};
