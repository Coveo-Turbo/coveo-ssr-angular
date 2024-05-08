import { SortOrder, buildRelevanceSortCriterion, buildDateSortCriterion, SortByRelevancy, SortByDate } from '@coveo/headless/ssr';

export const sortCriterias = [
  {
    caption: 'Relevance',
    criterion: buildRelevanceSortCriterion(),
    toString: function () { return this.criterion.by.toString() }
  },
  {
    caption: 'Date Descending',
    criterion: buildDateSortCriterion(SortOrder.Descending),
    toString: function () { return `${this.criterion.by.toString()} ${this.criterion.order.toString()}` }
  },
  {
    caption: 'Date Ascending',
    criterion: buildDateSortCriterion(SortOrder.Ascending),
    toString: function () { return `${this.criterion.by.toString()} ${this.criterion.order.toString()}` }
  },
]
