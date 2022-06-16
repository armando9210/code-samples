export const GRID_FILTER11 = 'STRING_FILTER1';
export const GRID_FILTER12 = 'STRING_FILTER2';
export const GRID_FILTER13 = 'STRING_FILTER3';
export const GRID_FILTER21 = 'NUMBER_FILTER1';

export const filterTypes =  {
  [GRID_FILTER11]: {
    type: 'string',
    emptyValue: '',
    operators: [
      {name: 'contains', fn: () => true},
    ],
  },
  [GRID_FILTER12]: {
    type: 'string',
    emptyValue: '',
    operators: [
      {name: 'eq', fn: () => true},
    ],
  },
  [GRID_FILTER13]: {
    type: 'string',
    emptyValue: '',
    operators: [
      {name: 'contains', fn: () => true},
      {name: 'eq', fn: () => true},
    ],
  },
  [GRID_FILTER21]: {
    type: 'number',
    emptyValue: null,
    operators: [
      {name: 'gte', fn: () => true},
      {name: 'lte', fn: () => true},
    ],
  },
};
