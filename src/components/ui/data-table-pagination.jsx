import React from "react";
import { Button } from "./button";

export default function DataTablePagination({ table }) {
    const { pageIndex, pageSize } = table.getState().pagination;
    const totalPages = table.getPageCount();

    return (
        <div className="flex items-center justify-between p-4">
            <select
                value={pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border rounded p-1"
            >
                {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                        Show {size}
                    </option>
                ))}
            </select>

            <div className="flex items-center justify-end space-x-2 py-4">
                <span>
                    Page <strong>{pageIndex + 1}</strong> of <strong>{totalPages}</strong>
                </span>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => table.setPageIndex(pageIndex - 1)}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => table.setPageIndex(pageIndex + 1)}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
