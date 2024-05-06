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
  SearchEngineDefinition,
  defineSearchEngine,
} from '@coveo/headless/ssr';
import {environment} from '../environments/environment';

export type SearchStaticState = InferStaticState<ReturnType<SearchService["getEngineService"]>>;
export type SearchHydratedState = InferHydratedState<ReturnType<SearchService['getEngineService']>>;

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _token!: string;
  // private _config!: any;
  private _staticState!: SearchStaticState;
  public constructor() {
  }

  public async init(accessToken: string) {
    this._token = accessToken;
    // this._config = await this.fetchConfig()
  }

  fetchConfig = async () => {
    const res = await fetch(this.configEndpoint);
    const data = await res.json();
    const config = data.config;
    return config;
  }

  // // Function to fetch static state
  // fetchStaticState(){
  //   return this.engineDefinition.fetchStaticState({
  //     controllers: {
  //         context: {
  //           initialState: {
  //             values: {testjfa:'value1'},
  //           },
  //         },
  //         // searchParameterManager: {
  //         //   initialState: {parameters: searchParameters},
  //         // },
  //       }
  //   });
  // }

  // Function to fetch static state
  public fetchStaticState = (options: any) => {
    return this.engineDefinition.fetchStaticState(options);
  }

  // Function to hydrate static state
  public hydrateStaticState = (state: any) => {
    return this.engineDefinition.hydrateStaticState(state);
  }

  get staticState() {
    return this._staticState;
  }

  get staticStateEndpoint() {
    return `${this.searchEndpoint}/state`;
  };

  get configEndpoint() {
    return `${this.searchEndpoint}/config`;
  };
  get searchEndpoint() {
    return environment.searchEndpoint;
  };

  get tokenEndpoint() {
    return environment.defaultTokenEndpoint;
  }

  get engineDefinition() {
    return defineSearchEngine(this.config(this._token));
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
