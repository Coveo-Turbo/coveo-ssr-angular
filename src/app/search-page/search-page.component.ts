import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ResultListComponent } from '../result-list/result-list.component';
import { SearchService, SearchHydratedState, SearchStaticState} from '../search.service';
import { ActivatedRoute, Router } from '@angular/router';
import {UrlManager as UrlManagerController} from '@coveo/headless/ssr';
import { FacetListComponent } from '../facet-list/facet-list.component';
import { QuerySummaryComponent } from '../query-summary/query-summary.component';
import { SortComponent } from '../sort/sort.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchBoxComponent,
    ResultListComponent,
    FacetListComponent,
    QuerySummaryComponent,
    SortComponent
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  @Input() staticState!: SearchStaticState;
  hydratedState?: SearchHydratedState;
  private urlManager!: UrlManagerController;
  private unsubscribeUrlManager!: Function | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object, 
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformID)){
      window.addEventListener('hashchange', this.onHashChange);
      this.hydrateState();
      
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeUrlManager?.()
  }

  private get fragment() {
    return decodeURIComponent(window.location.hash.slice(1));
  }
  private onHashChange = () => {
    this.hydratedState?.controllers.urlManager.synchronize(this.fragment);
  };

  private async hydrateState() {
    console.log('hydrateState...');
    
    if (this.staticState) {
      const { context, searchParameterManager, urlManager, sort } = this.staticState.controllers;
      const result = await this.searchService.hydrateStaticState({
        searchAction: this.staticState.searchAction,
        controllers: {
          context: {
            initialState: context.state,
          },
          urlManager: {
            initialState: urlManager.state
          },
          sort: {
            initialState: sort.state
          },
          searchParameterManager: {
            initialState: searchParameterManager.state,
          },
        },
      });

      this.hydratedState = {
        engine: result.engine,
        controllers: result.controllers
      };
    }

    
    this.unsubscribeUrlManager = this.hydratedState?.controllers.urlManager.subscribe(() => this.updateHash());
    // this.hydratedState?.controllers.urlManager.synchronize(this.fragment);
  }

  private updateHash() {
    history.pushState(
      null,
      document.title,
      `${this.router.url.split('#')[0]}#${this.hydratedState?.controllers.urlManager.state.fragment}`
    );
  }
}
