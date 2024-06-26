import {Router} from '@angular/router';
import {Injectable, APP_INITIALIZER} from '@angular/core';
import { EngineService } from './engine.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  public constructor(
    private engineService: EngineService,
    private route: Router
  ) {}

  public async init() {
    // Fetch Token here!! 
    // const res = await fetch(this.engineService.tokenEndpoint);
    // const data = await res.json();
    // const {token} = data;

    // if (!token) {
    //   this.route.navigate(['error'], {state: {errorMessage: data.message}});
    //   return;
    // }
    this.engineService.init('token');
  }
}

export const InitProvider = {
  provide: APP_INITIALIZER,
  useFactory: (initService: InitService) => () => initService.init(),
  deps: [InitService],
  multi: true,
};
