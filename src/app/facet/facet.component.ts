import { CommonModule } from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectionListChange, MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card'
import {FacetState, Facet as FacetController, FacetValue} from '@coveo/headless/ssr';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatCardModule
  ],

})
export class FacetComponent implements OnInit {
  @Input()
  public title!: string;
  @Input() controller?: FacetController; 
  @Input() staticState!: FacetState;

  private unsubscribe!: Function | undefined;
  state!: FacetState;


  public constructor() {}

  public selectionChange(change: MatSelectionListChange) {
    change.options.forEach((option) => {
      this.controller?.toggleSelect(option.value);
    });
  }

  public showMore() {
    this.controller?.showMoreValues();
  }

  public showLess() {
    this.controller?.showLessValues();
  }

  public canShowLess() {
    return this.controller?.state.canShowLessValues;
  }

  public canShowMore() {
    return this.controller?.state.canShowMoreValues;
  }

  public isFacetValueSelected(value: FacetValue): boolean {
    return !!this.controller?.isValueSelected(value);
  }

  public get facetValues(): FacetValue[] {
    return this.state.values || [];
  }

  ngOnChanges() {
    if(this.controller){
      console.log('Received facet controller: ', this.controller);
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
