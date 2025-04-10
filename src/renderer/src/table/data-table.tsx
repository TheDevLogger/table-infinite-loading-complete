import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'
import { columnDefinitions } from './column-definitions'
import { makeData, User } from './fake-data'

export default function DataTable() {
  const [rowData] = useState<User[]>(makeData(100))

  const table = useReactTable({
    data: rowData,
    columns: columnDefinitions,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="m-1 -mt-6 bg-background flex flex-col items-center text-sm rounded-md gap-4">
      <span className="text-3xl font-bold">TODO: Add Infinite Scrolling</span>
      <div className="overflow-auto relative h-[600px] w-full border-2 rounded-md shadow-2xl ">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-emerald-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full hover:bg-emerald-500 shadow-lg">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="overflow-hidden flex items-center"
                      style={{
                        width: header.column.getSize()
                      }}
                    >
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full w-full">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className="relative "
            style={{
              height: `${table.getTotalSize()}px` //tells scrollbar how big the table is
            }}
          >
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id} className="flex w-full">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className="flex"
                        style={{
                          width: cell.column.getSize()
                        }}
                      >
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full w-full">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
