import { PLATFORM_ID, TransferState, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SearchService, SearchStaticState } from './search.service';
import { isPlatformServer } from '@angular/common';
import { buildSSRSearchParameterSerializer } from '@coveo/headless/ssr';


export const searchStateResolver: ResolveFn<Promise<any>|SearchStaticState|null> = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);
  const searchService = inject(SearchService);
  if(isPlatformServer(platformId)){
    console.log("this block runs only on server");
    console.log("staticState FETCHING");
    console.log("route fragment", route.fragment);
    const {toSearchParameters} = buildSSRSearchParameterSerializer();
    const searchParameters = toSearchParameters(new URLSearchParams({'q': 'test'}));
    console.log('searchParameters', searchParameters);
    return searchService.fetchStaticState({
      controllers: {
        context: {
          initialState: {
            values: {testjfa:'value1'},
          },
        },
        searchParameterManager: {
          initialState: {parameters: searchParameters},
        }
      }
    }).then((searchStaticState) => {
      console.log("staticState FETCHED", searchStaticState);
      // console.log('transferState server before', transferState)
      transferState.set(searchService.staticStateKey, searchStaticState);
      // console.log('transferState server after', transferState)
      return searchStaticState;
      
    })
  } else {
    return transferState.get(searchService.staticStateKey, null);
  }  
};
