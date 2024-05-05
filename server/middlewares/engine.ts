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

const engineDefinition = defineSearchEngine(config);

export type SearchStaticState = InferStaticState<typeof engineDefinition>;
export type SearchHydratedState = InferHydratedState<typeof engineDefinition>;

export const {fetchStaticState, hydrateStaticState} = engineDefinition;