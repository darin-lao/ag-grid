import {
  GridApi,
  createGrid,
  GridOptions,
  IMultiFilter,
  IMultiFilterParams,
  ISetFilter,
  ITextFilterParams,
} from '@ag-grid-community/core';

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    {
      field: 'athlete',
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['apply', 'clear'],
            } as ITextFilterParams,
          },
          {
            filter: 'agSetColumnFilter',
          },
        ],
      } as IMultiFilterParams,
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 200,
    menuTabs: ['filterMenuTab'],
  },
}

function getTextModel() {
  gridApi!.getColumnFilterInstance<IMultiFilter>('athlete').then(multiFilterInstance => {
    const textFilter = multiFilterInstance!.getChildFilterInstance(0)!;
    console.log('Current Text Filter model: ', textFilter.getModel());
  });
}

function getSetMiniFilter() {
  gridApi!.getColumnFilterInstance<IMultiFilter>('athlete').then(multiFilterInstance => {
    var setFilter = multiFilterInstance!.getChildFilterInstance(1) as ISetFilter;
    console.log('Current Set Filter search text: ', setFilter.getMiniFilter());
  });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  gridApi = createGrid(gridDiv, gridOptions);

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then((data: IOlympicData[]) => gridApi!.setGridOption('rowData', data))
})
