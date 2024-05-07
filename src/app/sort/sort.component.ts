import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {SortState, Sort as SortController, SortByDate, SortOrder} from '@coveo/headless/ssr';
import { sortCriterias } from '../utils/sortUtils';

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss'
})
export class SortComponent {

  @Input() controller?: SortController; 
  @Input() staticState!: SortState;

  private unsubscribe!: Function | undefined;
  state!: SortState;

  public selectionChange(change: MatSelectChange) {
    this.controller?.sortBy(change.value);
  }

  public get sortCriterias() {
    return sortCriterias;
  }

  public get selected() {
    return sortCriterias.find((s) => s.toString() === this.state.sortCriteria)?.criterion;
  }

  ngOnChanges() {
    if(this.controller){
      console.log('Received sort controller: ', this.controller, this.controller.state, sortCriterias[1]);
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
