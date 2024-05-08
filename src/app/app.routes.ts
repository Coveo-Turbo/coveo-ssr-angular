import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { searchStateResolver } from './search-state.resolver';
import { SearchComponent } from './search/search.component';
import { ListingComponent } from './listing/listing.component';
import path from 'path';
import { listingStateResolver } from './listing-state.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    providers:[],
  },
  {
    path: 'search',
    component: SearchComponent,
    title: 'Search page',
    providers:[],
    resolve:{ staticState: searchStateResolver }
  },
  {
    path: 'bbc',
    children: [
      { path: '', redirectTo: '/news', pathMatch: 'full' },
      { path: 'news', component: ListingComponent, resolve:{ staticState: listingStateResolver }},
      { path: 'trending', component: ListingComponent, resolve:{ staticState: listingStateResolver }},
      { path: 'newsnight', component: ListingComponent, resolve:{ staticState: listingStateResolver }}
    ]
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: 'Error'
  }
];
