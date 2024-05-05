import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ResultListComponent } from '../result-list/result-list.component';
import { SearchService, SearchHydratedState, SearchStaticState} from '../search.service';
// import { SearchHydratedState, SearchStaticState, hydrateStaticState } from '../core/engine';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchBoxComponent,
    ResultListComponent
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  @Input() staticState!: SearchStaticState;
  hydratedState?: SearchHydratedState;

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object, 
    private searchService: SearchService) {
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformID)){
      this.hydrateState();
    }
  }

  private async hydrateState() {
    console.log('hydrateState...');
    if (this.staticState) {
      const { context, searchParameterManager } = this.staticState.controllers;
      const result = await this.searchService.hydrateStaticState({
        searchAction: this.staticState.searchAction,
        controllers: {
          context: {
            initialState: context.state,
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
  }

  public isReady() {
    return !!this.hydratedState;
  }
}
