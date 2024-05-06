import {Component, Input, OnInit} from '@angular/core';
import { SearchHydratedState, SearchStaticState} from '../search.service';
import { FacetComponent } from '../facet/facet.component';

@Component({
  selector: 'app-facet-list',
  templateUrl: './facet-list.component.html',
  styleUrls: ['./facet-list.component.scss'],
  standalone: true,
  imports: [
    FacetComponent
  ],
})
export class FacetListComponent implements OnInit {

  @Input() staticState!: SearchStaticState;
  @Input() hydratedState?: SearchHydratedState;

  public constructor() {}

  public ngOnInit(): void {}
}
