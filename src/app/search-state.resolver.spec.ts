import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { searchStateResolver } from './search-state.resolver';

describe('searchStateResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => searchStateResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
