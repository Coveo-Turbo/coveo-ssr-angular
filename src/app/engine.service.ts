import {Injectable, makeStateKey, TransferState, StateKey} from '@angular/core';
import {
  Controller,
  ControllerDefinitionsMap,
  SearchEngine,
  SearchEngineDefinitionOptions,
  getOrganizationEndpoints,
  PlatformEnvironment,
  getSampleSearchEngineConfiguration,
  defineFacet,
  defineResultList,
  defineSearchBox,
  defineContext,
  defineSearchParameterManager,
  defineUrlManager,
  InferStaticState,
  InferHydratedState,
  InferControllersMapFromDefinition,
  SearchEngineDefinition,
  defineResultsPerPage,
  defineSearchEngine,
  defineQuerySummary,
  definePager,
  defineSort,
  SearchEngineConfiguration,
  InferControllerStaticStateMapFromDefinitions,
  InferControllerFromDefinition,
} from '@coveo/headless/ssr';
import {environment} from '../environments/environment';

export type SearchStaticState = InferStaticState<ReturnType<EngineService["getSearchEngineDefinition"]>>;
export type SearchHydratedState = InferHydratedState<ReturnType<EngineService['getSearchEngineDefinition']>>;

export type ListingStaticState = InferStaticState<ReturnType<EngineService["getListingEngineDefinition"]>>;
export type ListingHydratedState = InferHydratedState<ReturnType<EngineService['getListingEngineDefinition']>>;


interface ConfigOptions {
  type: EngineType,
  token: string
}

export type EngineType = 'search' | 'listing';

type StaticStateMap = {
  search: SearchStaticState;
  listing: ListingStaticState;
};

type HydratedStateMap = {
  search: SearchHydratedState;
  listing: ListingHydratedState;
};

type EngineDefinitionMap = {
  search: ReturnType<EngineService['getSearchEngineDefinition']>;
  listing: ReturnType<EngineService['getListingEngineDefinition']>;
};
@Injectable({
  providedIn: 'root',
})
export class EngineService {

  private searchEngineDefinition!: SearchEngineDefinition<{
    context: ReturnType<typeof defineContext>,
    searchBox: ReturnType<typeof defineSearchBox>,
    resultList: ReturnType<typeof defineResultList>,
    querySummary: ReturnType<typeof defineQuerySummary>,
    pager: ReturnType<typeof definePager>,
    resultsPerPage: ReturnType<typeof defineResultsPerPage>,
    sort: ReturnType<typeof defineSort>,
    urlManager: ReturnType<typeof defineUrlManager>,
    authorFacet: ReturnType<typeof defineFacet>,
    sourceFacet: ReturnType<typeof defineFacet>,
    searchParameterManager: ReturnType<typeof defineSearchParameterManager>
  }>;

  private listingEngineDefinition!: SearchEngineDefinition<{
    context: ReturnType<typeof defineContext>,
    resultList: ReturnType<typeof defineResultList>,
    pager: ReturnType<typeof definePager>,
    resultsPerPage: ReturnType<typeof defineResultsPerPage>,
    sort: ReturnType<typeof defineSort>,
    searchParameterManager: ReturnType<typeof defineSearchParameterManager>
  }>;
  
  public constructor(private transferState:TransferState) {}

  public async init(accessToken: string) {
    this.searchEngineDefinition = defineSearchEngine(this.config({ type: 'search', token: accessToken }));
    this.listingEngineDefinition = defineSearchEngine(this.config({ type: 'listing', token: accessToken }));
  }

  // Function to fetch static state
  public fetchStaticState = (engineType:EngineType, options:any) => {
    const engineDefinition = this.engineDefinitions.get(engineType)!;
    const {fetchStaticState} = engineDefinition
    return fetchStaticState(options).then((staticState) => {
      console.log("staticState FETCHED", staticState);
      staticState
      console.log('transferState server before', this.transferState)
      this.transferState.set(this.staticStateKeys.get(engineType)!, staticState);
      return staticState;
    });
  }

  // Function to hydrate static state
  public hydrateStaticState = (engineType:EngineType, state: any) => {
    const engineDefinition = this.engineDefinitions.get(engineType)!;
    const {hydrateStaticState} = engineDefinition as ReturnType<EngineService["getSearchEngineDefinition"]>;
    return hydrateStaticState(state);
  }

  get tokenEndpoint() {
    return environment.defaultTokenEndpoint;
  }

  get staticStateKeys() {
    return new Map<EngineType, StateKey<any>>([
      ['search', makeStateKey<SearchStaticState>("SearchStaticState")],
      ['listing', makeStateKey<ListingStaticState>("ListingStaticState")]
    ]) 
    // return {
    //   'search': this.searchStaticStateKey,
    //   'listing': this.listingStaticStateKey
    // }
  }

  getSearchControllers = () => {
    return {
      context: defineContext(),
      searchBox: defineSearchBox(),
      resultList: defineResultList(),
      querySummary: defineQuerySummary(),
      pager: definePager({options: {numberOfPages: 3} }),
      resultsPerPage: defineResultsPerPage(),
      sort: defineSort(),
      urlManager: defineUrlManager(),
      authorFacet: defineFacet({ options: { field: "author" } }),
      sourceFacet: defineFacet({ options: { field: "source" } }),
      searchParameterManager: defineSearchParameterManager()
    }
  }

  getListingControllers = () => {
    return {
      context: defineContext(),
      resultList: defineResultList(),
      pager: definePager({options: {numberOfPages: 3} }),
      resultsPerPage: defineResultsPerPage(),
      sort: defineSort(),
      searchParameterManager: defineSearchParameterManager()
    }
  }

  get engineControllers() {
    return new Map<EngineType, Function>([
      ['search',this.getSearchControllers],
      ['listing', this.getListingControllers]
    ]) 
  }

  get engineConfigurations(){
    return new Map<EngineType, Function>([
      ['search', this.getSearchEngineConfiguration], 
      ['listing', this.getListingEngineConfiguration]
    ]);
  }

  config(options: ConfigOptions) {
    return {
      configuration: {
        ...this.engineConfigurations.get(options.type)?.(options.token)
      },
      controllers: {
        ...this.engineControllers.get(options.type)?.()
      },
    } satisfies SearchEngineDefinitionOptions<
      ControllerDefinitionsMap<SearchEngine, Controller>
    >;
  }

  // config(options: ConfigOptions) {
  //   return {
  //     [EngineType.search]: {
  //       configuration: {
  //         ...this.engineConfigurations.search(options.token)
  //       },
  //       controllers: {
  //         ...this.engineControllers.search()
  //       }
  //     },
  //     [EngineType.listing]: {
  //       configuration: {
  //         ...this.engineConfigurations.listing(options.token)
  //       },
  //       controllers: {
  //         ...this.engineControllers.listing()
  //       }
  //     }
  //   } 
  // }

  getSearchEngineConfiguration(token?: string) : SearchEngineConfiguration {
    return {
      ...getSampleSearchEngineConfiguration(),
      analytics: {enabled: false},
      search: {
        searchHub: 'default'
      }
    }
  }

  getListingEngineConfiguration(token?: string): SearchEngineConfiguration {
    return {
      ...getSampleSearchEngineConfiguration(),
      analytics: {enabled: false},
      search: {
        searchHub: 'listing'
      }
    }
  }

  getListingEngineDefinition = () => {
    return this.listingEngineDefinition;
  }

  getSearchEngineDefinition = () => {
    return this.searchEngineDefinition;
  }

  get engineDefinitions() {
    return new Map<EngineType, EngineDefinitionMap[EngineType]>([
      ['search', this.searchEngineDefinition], 
      ['listing', this.listingEngineDefinition]
    ]);
  }

}


