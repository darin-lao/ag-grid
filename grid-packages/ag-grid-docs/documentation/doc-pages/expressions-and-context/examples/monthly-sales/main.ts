import {
  GridApi,
  createGrid,
  ColDef,
  ColGroupDef,
  GridOptions,
  ICellRendererParams,
  IGroupCellRendererParams,
} from '@ag-grid-community/core';

var monthValueGetter =
  '(ctx.month < ctx.months.indexOf(colDef.field)) ? data[colDef.field + "_bud"] : data[colDef.field + "_act"]'
var monthCellClassRules = {
  'cell-act': 'ctx.month < ctx.months.indexOf(colDef.field)',
  'cell-bud': 'ctx.month >= ctx.months.indexOf(colDef.field)',
  'cell-negative': 'x < 0',
}
var yearToDateValueGetter =
  'var total = 0; ctx.months.forEach( function(monthName, monthIndex) { if (monthIndex<=ctx.month) { total += data[monthName + "_act"]; } }); return total; '
var accountingCellRenderer = function (params: ICellRendererParams) {
  if (params.value == null) {
    return ''
  } else if (params.value >= 0) {
    return params.value.toLocaleString()
  } else {
    return '(' + Math.abs(params.value).toLocaleString() + ')'
  }
}

const columnDefs: (ColDef | ColGroupDef)[] = [
  {
    field: 'country',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: 'Monthly Data',
    children: [
      {
        field: 'jan',
        cellRenderer: accountingCellRenderer,
        cellClass: 'cell-figure',
        valueGetter: monthValueGetter,
        cellClassRules: monthCellClassRules,
        aggFunc: 'sum',
      },

      {
        field: 'feb',
        cellRenderer: accountingCellRenderer,
        cellClass: 'cell-figure',
        valueGetter: monthValueGetter,
        cellClassRules: monthCellClassRules,
        aggFunc: 'sum',
      },

      {
        field: 'mar',
        cellRenderer: accountingCellRenderer,
        cellClass: 'cell-figure',
        valueGetter: monthValueGetter,
        cellClassRules: monthCellClassRules,
        aggFunc: 'sum',
      },

      {
        field: 'apr',
        cellRenderer: accountingCellRenderer,
        cellClass: 'cell-figure',
        valueGetter: monthValueGetter,
        cellClassRules: monthCellClassRules,
        aggFunc: 'sum',
      },

      {
        field: 'may',
        cellRenderer: accountingCellRenderer,
        cellClass: 'cell-figure',
        valueGetter: monthValueGetter,
        cellClassRules: monthCellClassRules,
        aggFunc: 'sum',
      },

      {
        field: 'jun',
        cellRenderer: accountingCellRenderer,
        cellClass: 'cell-figure',
        valueGetter: monthValueGetter,
        cellClassRules: monthCellClassRules,
        aggFunc: 'sum',
      },

      {
        headerName: 'YTD',
        cellClass: 'cell-figure',
        cellRenderer: accountingCellRenderer,
        valueGetter: yearToDateValueGetter,
        aggFunc: 'sum',
      },
    ],
  },
]

let gridApi: GridApi;
const context ={
  month: 0,
  months: [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ],
};
const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 120,
  },
  autoGroupColumnDef: {
    headerName: 'Location',
    field: 'city',
    minWidth: 260,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    } as IGroupCellRendererParams,
  },
  rowSelection: 'multiple',
  groupSelectsChildren: true,
  context: context
}

var monthNames = [
  'Budget Only',
  'Year to Jan',
  'Year to Feb',
  'Year to Mar',
  'Year to Apr',
  'Year to May',
  'Year to Jun',
  'Year to Jul',
  'Year to Aug',
  'Year to Sep',
  'Year to Oct',
  'Year to Nov',
  'Full Year',
]

function onChangeMonth(i: number) {
  var newMonth = (context.month += i)

  if (newMonth < -1) {
    newMonth = -1
  }
  if (newMonth > 5) {
    newMonth = 5
  }
  // Mutate the context object in place
  context.month = newMonth
  document.querySelector('#monthName')!.textContent = monthNames[newMonth + 1]
  gridApi!.refreshClientSideRowModel('aggregate')
  gridApi!.refreshCells()
}

function onQuickFilterChanged() {
  gridApi!.setGridOption(
    'quickFilterText',
    (document.getElementById('filter-text-box') as HTMLInputElement).value
  )
}


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  gridApi = createGrid(gridDiv, gridOptions);

  fetch('https://www.ag-grid.com/example-assets/monthly-sales.json')
    .then(response => response.json())
    .then(function (data) {
      gridApi!.setGridOption('rowData', data)
    })
})
