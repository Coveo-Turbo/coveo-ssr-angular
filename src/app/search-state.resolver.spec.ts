import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { searchStateResolver } from './search-state.resolver';
import { SearchStaticState } from './engine.service';

describe('searchStateResolver', () => {
  const executeResolver: ResolveFn<Promise<any>|SearchStaticState|null> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => searchStateResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
