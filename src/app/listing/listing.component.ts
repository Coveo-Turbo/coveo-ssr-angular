import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, TransferState } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buildSSRSearchParameterSerializer } from '@coveo/headless/ssr';
import { ResultListComponent } from '../result-list/result-list.component';
import { EngineService, EngineType, ListingHydratedState, ListingStaticState } from '../engine.service';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [
    CommonModule,
    ResultListComponent
  ],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss'
})
export class ListingComponent implements OnInit {

  engineType:EngineType = 'listing';
  staticState!: ListingStaticState;
  hydratedState?: ListingHydratedState;
  ready: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private activatedRoute: ActivatedRoute,
    private transferState: TransferState, 
    private engineService: EngineService){
    this.ready = false;
  }
  ngOnInit(): void {
    console.log('transferState:::', this.transferState)
    const staticState = this.transferState.get(this.engineService.staticStateKeys.get(this.engineType)!, null);
    console.log("staticState RETRIEVED",staticState)
    if(staticState){
      this.staticState = staticState;
      this.ready = true;
    }

    if (isPlatformBrowser(this.platformID)) {
      this.hydrateState();

    }
  }
  
  private async hydrateState() {
    console.log('hydrateState...');

    if (this.staticState) {
      const { context, searchParameterManager} = this.staticState.controllers;
      const engineType: EngineType = 'listing'
      const result = await this.engineService.hydrateStaticState(engineType, {
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

      if(JSON.stringify(searchParameterManager.state.parameters) !== JSON.stringify(this.searchParameters)){
        this.hydratedState.controllers.searchParameterManager.synchronize(this.searchParameters);
      };
    }
  }

  get searchParameters() {
    return {aq: `@author="${this.activatedRoute.snapshot.url.toString()}"`}
  }
  public isReady() {
    return this.ready;
  }

}
