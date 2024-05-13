import { PLATFORM_ID, TransferState, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EngineService, EngineType, ListingStaticState } from './engine.service';
import { buildSSRSearchParameterSerializer } from '@coveo/headless/ssr';
import { isPlatformServer } from '@angular/common';

export const listingStateResolver: ResolveFn<Promise<any>|ListingStaticState|null> = (route, state) => {

  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);
  const engineService = inject(EngineService);
  const engineType:EngineType = 'listing';
  const staticStateKey = engineService.staticStateKeys.get(engineType)!;

  const searchParameters = {aq: `@author="${route.url}"`};
  console.log('searchParameters', searchParameters);

  const staticStateOptions = {
    controllers: {
      context: {
        initialState: {
          values: {testjfa:'value1'},
        },
      },
      searchParameterManager: {
        initialState: { parameters: searchParameters },
      }
    }
  }

  console.log("listingStateResolver:::");
  
  if(isPlatformServer(platformId)){
    
    console.log("this block runs only on server");
    console.log("server-side staticState FETCHING");
    console.log("route info", route.url, route.fragment, route.queryParams);
    
    return engineService.fetchStaticState(engineType, staticStateOptions);

  } else {

    if(transferState.hasKey(staticStateKey)) {
      return transferState.get(staticStateKey, null);
    } else {
      console.log("static state key not found, fetchStaticState");
      return engineService.fetchStaticState(engineType, staticStateOptions)
    }    
  }  
};

