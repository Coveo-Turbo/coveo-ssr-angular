import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { listingStateResolver } from './listing-state.resolver';
import { ListingStaticState } from './engine.service';

describe('listingStateResolver', () => {
  const executeResolver: ResolveFn<Promise<any>|ListingStaticState|null> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => listingStateResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
