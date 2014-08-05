define(function (require) {

    _.mixin({
        splitInRows: function (arr, columnsInRow, rowCallback) {
            var rowCount = Math.ceil(arr.length / columnsInRow),
                splitData = {
                    rows: []
                };
            
            _.times(rowCount, function (rowIndex) {
                var row = splitData.rows[rowIndex] = {
                    columns: []
                };
                
                var itemsCovered = rowIndex * columnsInRow,
                    rowItems = arr.slice(itemsCovered, itemsCovered + columnsInRow);
                
                _.each(rowItems, function (item, index) {
                    row.columns.push(rowCallback(item, index, rowItems));
                });
            });
            
            return splitData;
        }
    });

    return _;
});
