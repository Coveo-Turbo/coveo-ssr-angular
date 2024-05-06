import { OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { FacetValue } from '@coveo/headless';
import { EngineService } from '../engine.service';
export declare class FacetComponent implements OnInit {
    private engineService;
    field: string;
    title: string;
    private headlessFacet;
    constructor(engineService: EngineService);
    selectionChange(change: MatSelectionListChange): void;
    showMore(): void;
    showLess(): void;
    canShowLess(): boolean;
    canShowMore(): boolean;
    isFacetValueSelected(value: FacetValue): boolean;
    get facetValues(): FacetValue[];
    private initializeController;
    ngOnInit(): void;
}
