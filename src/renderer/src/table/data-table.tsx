import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { columnDefinitions } from './column-definitions'
import { fetchData, UserApiResponse } from './fake-data'

const fetchSize = 50

export default function DataTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<UserApiResponse>({
    queryKey: ['users'],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * fetchSize
      const fetchedData = await fetchData(start, fetchSize)
      return fetchedData
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  })

  const rowData = useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data])
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = rowData.length

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  )

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  const table = useReactTable({
    data: rowData,
    columns: columnDefinitions,
    getCoreRowModel: getCoreRowModel()
  })

  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 10
  })

  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <div className="m-1 -mt-6 bg-background flex flex-col items-center text-sm rounded-md gap-4">
      <span className="text-3xl font-bold">TODO: Add Infinite Scrolling</span>
      <span className="font-bold p-2">
        {rowData.length} of {totalDBRowCount} rows fetched
      </span>
      <div
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        ref={tableContainerRef}
        className="overflow-auto relative h-[600px] w-full border-2 rounded-md shadow-2xl "
      >
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
            className="relative" 
            style={{
              height: `${rowVirtualizer.getTotalSize()}px` //tells scrollbar how big the table is
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <TableRow
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  className="flex absolute w-full"
                  style={{
                    transform: `translateY(${virtualRow.start}px)` 
                  }}
                >
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
function useref<T>(arg0: null) {
  throw new Error('Function not implemented.')
}
