import { PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SearchService, SearchStaticState } from './search.service';
import { isPlatformServer } from '@angular/common';
import { buildSSRSearchParameterSerializer } from '@coveo/headless/ssr';

const fragmenKey = makeStateKey<string>("fragment");
export const searchStateResolver: ResolveFn<Promise<any>|SearchStaticState|null> = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);
  const searchService = inject(SearchService);
  if(isPlatformServer(platformId)){
    console.log("this block runs only on server");
    console.log("server-side staticState FETCHING");
    console.log("route fragment", route.fragment, route.queryParams);
    const {toSearchParameters} = buildSSRSearchParameterSerializer();
    const searchParameters = toSearchParameters(new URLSearchParams(route.queryParams!));
    console.log('searchParameters', searchParameters);
    return searchService.fetchStaticState({
      controllers: {
        context: {
          initialState: {
            values: {testjfa:'value1'},
          },
        },
        urlManager: {
          initialState: {fragment: objectToQueryString(route.queryParams) || ''},
        },
        searchParameterManager: {
          initialState: {parameters: searchParameters},
        }
      }
    }).then((searchStaticState) => {
      console.log("server-side staticState FETCHED", searchStaticState);
      console.log('transferState server before', transferState)
      transferState.set(searchService.staticStateKey, searchStaticState);
      // console.log('transferState server after', transferState)
      return searchStaticState;
      
    })
  } else {
    transferState.set(fragmenKey, route.fragment);
    return transferState.get(searchService.staticStateKey, null);
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
