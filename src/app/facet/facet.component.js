"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacetComponent = void 0;
const core_1 = require("@angular/core");
const headless_1 = require("@coveo/headless");
let FacetComponent = class FacetComponent {
    constructor(engineService) {
        this.engineService = engineService;
    }
    selectionChange(change) {
        change.options.forEach((option) => {
            this.headlessFacet.toggleSelect(option.value);
        });
    }
    showMore() {
        this.headlessFacet.showMoreValues();
    }
    showLess() {
        this.headlessFacet.showLessValues();
    }
    canShowLess() {
        return this.headlessFacet.state.canShowLessValues;
    }
    canShowMore() {
        return this.headlessFacet.state.canShowMoreValues;
    }
    isFacetValueSelected(value) {
        return this.headlessFacet.isValueSelected(value);
    }
    get facetValues() {
        return this.headlessFacet.state.values;
    }
    initializeController() {
        this.headlessFacet = (0, headless_1.buildFacet)(this.engineService.get(), {
            options: {
                numberOfValues: 5,
                field: this.field,
            },
        });
    }
    ngOnInit() {
        this.initializeController();
    }
};
__decorate([
    (0, core_1.Input)()
], FacetComponent.prototype, "field", void 0);
__decorate([
    (0, core_1.Input)()
], FacetComponent.prototype, "title", void 0);
FacetComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-facet',
        templateUrl: './facet.component.html',
        styleUrls: ['./facet.component.scss'],
    })
], FacetComponent);
exports.FacetComponent = FacetComponent;
//# sourceMappingURL=facet.component.js.map