import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { listingStateResolver } from './listing-state.resolver';

describe('listingStateResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => listingStateResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
