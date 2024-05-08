import { Component, TransferState } from '@angular/core';
import { EngineService, SearchStaticState } from '../engine.service';
import { SearchPageComponent } from '../search-page/search-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    SearchPageComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  staticState!: SearchStaticState;
  ready: boolean;

  constructor(
    private transferState:TransferState,  
    private engineService: EngineService){
    this.ready = false;
  }

  async ngOnInit(): Promise<void> {

    console.log('transferState:::', this.transferState)
    const staticState = this.transferState.get(this.engineService.staticStateKeys.get('search')!, null);
    console.log("staticState RETRIEVED",staticState)
    if(staticState){
      this.staticState = staticState;
      this.ready = true;
    }
  }

  public isReady() {
    return this.ready;
  }
}
