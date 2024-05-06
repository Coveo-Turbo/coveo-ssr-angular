import { Component, Input, input } from '@angular/core';
// import {buildSearchBox, SearchBox, SearchBoxOptions} from '@coveo/headless';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {SearchBoxState, SearchBox as SearchBoxController} from '@coveo/headless/ssr';
import {FormControl} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent {
  @Input() controller?: SearchBoxController; 
  @Input() staticState!: SearchBoxState;

  private unsubscribe!: Function | undefined;
  state!: SearchBoxState;
 
  public myControl = new FormControl();
  public suggestions: {
    highlightedValue: string;
    rawValue: string;
  }[] | undefined = [];

  public constructor() {}

  ngOnChanges() {
    if(this.controller){
      console.log('Received search-box controller: ', this.controller);
      this.unsubscribe = this.controller.subscribe(() => this.state = {
          ...this.state,
          ...this.controller?.state,
        }
      )
    }
  }

  public onSelect(value: string) {
    this.controller?.selectSuggestion(value);
  }

  public onInput() {
    this.controller?.updateText(this.myControl.value);
  }

  public search() {
    if (!this.controller?.state.isLoading) {
      this.controller?.submit();
    }
  }

  public ngOnInit() {
    this.state = {...this.staticState }
    // this.unsubscribe = this.controller?.subscribe?.(() => this.state = {
    //   ...this.state,
    //   ...this.controller?.state 
    // });
  }

  ngOnDestroy(): void {
    this.unsubscribe?.()
  }

  public isHydrated() {
    return !!this.controller;
  }
}

