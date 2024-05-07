import {Injectable, makeStateKey} from '@angular/core';
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
} from '@coveo/headless/ssr';
import {environment} from '../environments/environment';

export type SearchStaticState = InferStaticState<ReturnType<SearchService["getEngineService"]>>;
export type SearchHydratedState = InferHydratedState<ReturnType<SearchService['getEngineService']>>;

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  private engineDefinition!: SearchEngineDefinition<{
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
  
  public constructor() {}

  public async init(accessToken: string) {
    this.engineDefinition = defineSearchEngine(this.config(accessToken));
  }

  // Function to fetch static state
  public fetchStaticState = (options: any) => {
    return this.engineDefinition.fetchStaticState(options);
  }

  // Function to hydrate static state
  public hydrateStaticState = (state: any) => {
    return this.engineDefinition.hydrateStaticState(state);
  }

  get tokenEndpoint() {
    return environment.defaultTokenEndpoint;
  }

  get staticStateKey() {
    return makeStateKey<SearchStaticState>("SearchStaticState");
  }

  config(token?: string) {
    return {
      configuration: {
        ...getSampleSearchEngineConfiguration(),
        analytics: {enabled: false},
      },
      controllers: {
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
      },
    } satisfies SearchEngineDefinitionOptions<
      ControllerDefinitionsMap<SearchEngine, Controller>
    >;
  }

  getEngineService = () => {
    return this.engineDefinition;
  }

}
