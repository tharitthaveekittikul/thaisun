import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const DataTable = ({ rows, columns, loading, sx, handleRowEditCommit }) => {
  const [pageSize, setPageSize] = useState(5);
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      sx={sx}
      onCellEditCommit={handleRowEditCommit}
      //   checkboxSelection
      pagination
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      rowsPerPageOptions={[5, 10, 15]}
      getRowId={(row) => row.key}
      disableColumnSelector
      disableDensitySelector
      disableColumnFilter
      components={{ Toolbar: GridToolbar }}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
    />
  );
};

export default DataTable;
