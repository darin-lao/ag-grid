const gridOptions = {
    columnDefs: [
        {field: 'athlete', minWidth: 150},
        {field: 'age', minWidth: 50, filter: 'agNumberColumnFilter'},
        {field: 'country', width: 120},
        {field: 'year', width: 90},
        {field: 'date', width: 110},
        {field: 'sport', width: 110},
        {field: 'gold', width: 110, aggFunc: 'sum'},
        {field: 'silver', width: 110, aggFunc: 'sum'},
        {field: 'bronze', width: 110, aggFunc: 'sum'}
    ],
    defaultColDef: {
        editable: true,
        sortable: true,
        flex: 1,
        minWidth: 100,
        filter: true,
        resizable: true,
    },
    ensureDomOrder: true,
    suppressColumnVirtualisation: true,
    rowBuffer: 600
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then(response => response.json())
        .then(data => gridOptions.api.setRowData(data.slice(0, 600)));
});
