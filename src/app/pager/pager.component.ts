import { Component, Input } from '@angular/core';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {PagerState, Pager as PagerController, ResultsPerPageState, ResultsPerPage as ResultsPerPageController} from '@coveo/headless/ssr';
import { SearchHydratedState, SearchStaticState } from '../engine.service';

@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss'
})
export class PagerComponent {
  @Input() staticState!: SearchStaticState;
  @Input() hydratedState?: SearchHydratedState;

  private unsubscribePager!: Function | undefined;
  private unsubscribeResultsPerPage!: Function | undefined;

  pagerController!: PagerController | undefined;
  resultsPerPageController!: ResultsPerPageController | undefined;

  pagerState!: PagerState;
  resultPerPageState!: ResultsPerPageState;

  public get pager(): PagerState {
    return this.pagerState;
  }
  public get resultPerPage(): ResultsPerPageState {
    return this.resultPerPageState;
  }

  public onPageEvent(event: PageEvent) {
    if (!this.resultsPerPageController?.isSetTo(event.pageSize)) {
      // If page size change
      this.resultsPerPageController?.set(event.pageSize);
    } else {
      this.pagerController?.selectPage(event.pageIndex + 1);
    }
  }

  public get pageSize() {
    return this.resultPerPage.numberOfResults;
  }

  public get pageCount() {
    return this.pager.maxPage;
  }

  public get pageIndex() {
    return this.pager.currentPage - 1;
  }

  ngOnChanges() {
  
    this.pagerController = this.hydratedState?.controllers.pager;
    this.resultsPerPageController = this.hydratedState?.controllers.resultsPerPage;

    if(this.pagerController){
      console.log('Received pager controller: ', this.pagerController);
      this.unsubscribePager = this.pagerController.subscribe(() => this.pagerState = {
          ...this.pagerState,
          ...this.pagerController?.state,
        }
      )
    }

    if(this.resultsPerPageController){
      console.log('Received resultsPerPage controller: ', this.resultsPerPageController);
      this.unsubscribeResultsPerPage = this.resultsPerPageController.subscribe(() => this.resultPerPageState = {
          ...this.resultPerPageState,
          ...this.resultsPerPageController?.state,
        }
      )
    }
  }
  public ngOnInit() {
   
    this.pagerState = {...this.staticState.controllers.pager.state }
    this.resultPerPageState = {...this.staticState.controllers.resultsPerPage.state }
  }
  ngOnDestroy(): void {
    this.unsubscribePager?.();
    this.unsubscribeResultsPerPage?.();
  }
  
}
