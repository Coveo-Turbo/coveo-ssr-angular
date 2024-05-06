import { CommonModule, isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID, inject } from '@angular/core';
import {QuerySummaryState, QuerySummary as QuerySummaryController} from '@coveo/headless/ssr';


@Component({
  selector: 'app-query-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './query-summary.component.html',
  styleUrl: './query-summary.component.scss'
})
export class QuerySummaryComponent {

  @Input() controller?: QuerySummaryController; 
  @Input() staticState!: QuerySummaryState;

  private unsubscribe!: Function | undefined;
  state!: QuerySummaryState;

  constructor(@Inject(PLATFORM_ID) private platformId: Object){}

  ngOnChanges() {
    if(this.controller){
      console.log('Received querySummary controller: ', this.controller);
      this.unsubscribe = this.controller.subscribe(() => this.state = {
          ...this.state,
          ...this.controller?.state,
        }
      )
    }
  }
  public ngOnInit() {
    this.state = {...this.staticState }
  }
  ngOnDestroy(): void {
    this.unsubscribe?.()
  }

  public isCSR() {
    // return isPlatformBrowser(this.platformId);
    return true;
  }
}
