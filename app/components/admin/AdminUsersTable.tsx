import { UserLight } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ColumnDef, ColumnFiltersState, createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowDownUp, ArrowRight, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RotateCcw, ThumbsDown, ThumbsUp, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  users?: UserLight[];
  withDeleted?: boolean;
  setWithDeleted?: (value: boolean | ((prev: boolean) => boolean)) => void;
  mutateUsers?: () => void;
  handleDisableUser?: (userId: string) => void;
  handleApproveUser?: (userId: string, approve: boolean) => void;
  handleRecoverUser?: (userId: string) => void;
};

function AdminUsersTable({ 
  users = [], 
  withDeleted = false,
  setWithDeleted = ()=>{},
  mutateUsers = ()=>{}, 
  handleDisableUser = ()=>{}, 
  handleApproveUser = ()=>{},
  handleRecoverUser = ()=>{},
}: Props) {

  const [filtering, setFiltering] = useState("");
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<UserLight>();

  // Make some columns!
  const columns: ColumnDef<UserLight, any>[] = [
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: info => info.getValue() ?? '',
    }),
    columnHelper.accessor('name', {
      header: () => 'Nome',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('surname', {
      header: () => 'Cognome',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('company', {
      header: () => 'Azienda',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => row.is_admin ? 'Amministratore' : 'Utente', {
      id: 'role',
      header: () => 'Permessi',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => row.is_new ? 'Si' : 'No', {
      id: 'new',
      header: () => 'Nuovo',
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Azioni',
      cell: (props: any) => (
        <div className="flex space-x-2">
          <Link href={`/admin/users/${props.row.original.id}`} >
            <Button className="py-1 px-4"><ArrowRight /></Button>
          </Link>
          {props.row.original.is_new 
            ? <>
                <Button className="py-1 px-4" onClick={()=>{handleApproveUser(props.row.original.id, true)}}>
                  <ThumbsUp />
                </Button>
                <Button className="py-1 px-4" onClick={()=>{handleApproveUser(props.row.original.id, false)}}>
                  <ThumbsDown />
                </Button>
              </>
            : (props.row.original.is_deleted 
              ? <Button className="py-1 px-4" onClick={()=>{handleRecoverUser(props.row.original.id)}}>
                  <RotateCcw />
                </Button>
              : <Button className="py-1 px-4" onClick={()=>{handleDisableUser(props.row.original.id)}}>
                  <X />
                </Button>
            )
          }
        </div>
      )
    }),
  ]

  const table = useReactTable({ 
    data: users,
    columns,
    state: {
      sorting,
      globalFilter: filtering,
      // columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    // onGlobalFilterChanged: setFiltering,
    // onGlobalFilterChange: setFiltering,
    // onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <div className="flex items-center justify-end gap-4">
        <div className="flex gap-2">
          <input type="checkbox" name="with_deleted" id="with_deleted" checked={withDeleted} onChange={()=>{setWithDeleted((prev) => !prev)}} />
          <label htmlFor="with_deleted" className="font-semibold">Eliminati</label>
        </div>
        <input 
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)} 
          placeholder="Ricerca globale..."
          className="border rounded focus:outline-none p-2"
        />
      </div>

      <div className="border rounded-lg p-4 mt-4 overflow-auto">
        <table className="w-full max-w-screen-xl">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="pb-2">
                    <div className={"flex items-center space-x-1" + (header.column.getCanSort() ? " cursor-pointer" : "")}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : ()=>{}}
                    >
                      {!!header.column.getCanSort() ? ({
                          asc: <ArrowUp />,
                          desc: <ArrowDown />,
                        }[header.column.getIsSorted() as 'asc' | 'desc'] ?? <ArrowDownUp />) 
                        : null
                      }
                      {header.isPlaceholder ? null : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex items-center justify-between gap-2 self-stretch">

          <div className="p-2">
            <select
              className="select select-sm select-bordered w-full max-w-xs"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Mostra {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>
            </div>
            <span className="flex items-center gap-1">
              | Vai alla pagina:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e : any) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                min={1}
                max={table.getPageCount()}
                className="input input-sm input-bordered w-16 pl-2"
              />
            </span>
            <button
              className="btn btn-sm btn-ghost enabled:hover:bg-primary-500 enabled:hover:text-primary-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}>
              <ChevronsLeft />
            </button>
            <button
              className="btn btn-sm btn-ghost enabled:hover:bg-primary-500 enabled:hover:text-primary-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ChevronLeft />
            </button>
            <button
              className="btn btn-sm btn-ghost enabled:hover:bg-primary-500 enabled:hover:text-primary-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <ChevronRight />
            </button>
            <button
              className="btn btn-sm btn-ghost enabled:hover:bg-primary-500 enabled:hover:text-primary-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              <ChevronsRight />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminUsersTable