import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = ({ rows, columns, loading, sx }) => {
  const [pageSize, setPageSize] = useState(5);
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      sx={sx}
      //   checkboxSelection
      pagination
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      rowsPerPageOptions={[5, 10, 15]}
      getRowId={(row) => row.key}
    />
  );
};

export default DataTable;
