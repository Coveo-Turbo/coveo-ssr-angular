import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { searchStateResolver } from './search-state.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    providers:[],
    resolve:{staticState: searchStateResolver}
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: 'Error'
  }
];
