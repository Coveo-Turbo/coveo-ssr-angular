import {Request, Response, NextFunction} from 'express';
import { SearchStaticState, fetchStaticState } from './engine';
import {
  defineSearchEngine,
  InferStaticState,
  InferHydratedState,
  Controller,
  ControllerDefinitionsMap,
  SearchEngine,
  SearchEngineDefinitionOptions,
  getSampleSearchEngineConfiguration,
  defineFacet,
  defineResultList,
  defineSearchBox,
  defineContext,
  defineSearchParameterManager,
} from '@coveo/headless/ssr';


export function fetchSearchStaticState(
  req: Request,
  res: Response,
  next: NextFunction
) {

  fetchStaticState({
    controllers: {
      context: {
        initialState: {
          values: {testjfa:'value1'},
        },
      },
      // searchParameterManager: {
      //   initialState: {parameters: searchParameters},
      // },
    },
  }).then((data: SearchStaticState)=> {
    req.body.searchStaticState = {...data};
    next();
  }).catch((err) => {
    next(err);
  });
}

export function prepareSearchEngineConfig(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const config = {
    configuration: {
      ...getSampleSearchEngineConfiguration(),
      analytics: {enabled: false},
    },
    controllers: {
      context: defineContext(),
      searchBox: defineSearchBox(),
      resultList: defineResultList(),
      authorFacet: defineFacet({ options: { field: "author" } }),
      sourceFacet: defineFacet({ options: { field: "source" } }),
      // searchParameterManager: defineSearchParameterManager()
    },
  } satisfies SearchEngineDefinitionOptions<
    ControllerDefinitionsMap<SearchEngine, Controller>
  >;

  req.body.searchEngineConfig = config;
  next();
}
