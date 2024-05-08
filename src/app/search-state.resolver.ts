import { PLATFORM_ID, TransferState, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EngineService, EngineType, SearchStaticState } from './engine.service';
import { isPlatformServer } from '@angular/common';
import { buildSSRSearchParameterSerializer } from '@coveo/headless/ssr';

export const searchStateResolver: ResolveFn<Promise<any>|SearchStaticState|null> = (route, state) => {

  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);
  const engineService = inject(EngineService);
  const engineType:EngineType = 'search';
  const searchStaticStateKey = engineService.staticStateKeys.get(engineType)!;

  const {toSearchParameters} = buildSSRSearchParameterSerializer();
  const searchParameters = toSearchParameters(new URLSearchParams(route.fragment! || route.queryParams!));
  console.log('searchParameters', searchParameters);

  const staticStateOptions = {
    controllers: {
      context: {
        initialState: {
          values: {testjfa:'value1'},
        },
      },
      urlManager: {
        initialState: { fragment: route.fragment || objectToQueryString(route.queryParams) || '' },
      },
      searchParameterManager: {
        initialState: { parameters: searchParameters },
      },
      // resultsPerPage: {
      //   initialState: { numberOfResults: 10 },
      // },
      // sort:{
      //   initialState: {
      //     criterion: sortCriterias[0].criterion
      //   }
      // }
    }
  }

  console.log("searchStateResolver:::");
  
  if(isPlatformServer(platformId)){
    
    console.log("this block runs only on server");
    console.log("server-side staticState FETCHING");
    console.log("route fragment", route.fragment, route.queryParams);
    
    return engineService.fetchStaticState(engineType, staticStateOptions);

  } else {

    if(transferState.hasKey(searchStaticStateKey)) {
      return transferState.get(searchStaticStateKey, null);
    } else {
      return engineService.fetchStaticState(engineType, staticStateOptions)
    }    
  }  
};

const objectToQueryString = (params: {[key: string]: any}) => {
  const queryParams = new URLSearchParams();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      queryParams.set(key, params[key]);
    }
  }
  return queryParams.toString();
}
