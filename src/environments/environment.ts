// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /**
   * The endpoint to the server returning Coveo search tokens.
   * Example: tokenEndpoint: 'https://acme.com/token',
   * If kept to undefined, `defaultTokenEndpoint` will be used fetch the search token from the local server within this project
   */
  customTokenEndpoint: undefined,
  /**
   * The default endpoint to the server returning Coveo search tokens.
   */
  defaultTokenEndpoint: 'http://localhost:3000/token',
  /**
   * The Plaform URL to use.
   * See https://docs.coveo.com/en/2976/coveo-solutions/deployment-regions-and-strategies
   */
  platformUrl: 'https://platform.cloud.coveo.com',
  /**
   * The unique identifier of the organization in which to generate a search token.
   * See https://docs.coveo.com/en/148/manage-an-organization/retrieve-the-organization-id
   */
  organizationId: 'searchuisamples',
  /**
   * The environment of the Coveo platform.
   * Can be `prod`, 'hipaa', `stg', 'dev',
   */
  platformEnvironment: 'prod',  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
