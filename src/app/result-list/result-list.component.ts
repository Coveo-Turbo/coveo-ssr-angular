import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {ResultListState, ResultList as ResultListController} from '@coveo/headless/ssr';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.scss'
})
export class ResultListComponent {
  @Input() controller?: ResultListController; 
  @Input() staticState!: ResultListState;

  private unsubscribe!: Function | undefined;
  state!: ResultListState;

  ngOnChanges() {
    if(this.controller){
      console.log('Received result-list controller: ', this.controller);
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

}
