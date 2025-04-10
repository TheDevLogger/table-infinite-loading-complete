import { ColumnDef } from '@tanstack/react-table'
import { User } from './fake-data'

export const columnDefinitions: ColumnDef<User>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    size: 40
  },
  {
    id: 'firstName',
    accessorKey: 'firstName',
    cell: (info) => info.getValue()
  },
  {
    id: 'lastName',
    accessorKey: 'lastName',
    cell: (info) => info.getValue()
  },
  {
    id: 'email',
    accessorKey: 'email',
    cell: (info) => info.getValue()
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    cell: (info) => info.getValue()
  },
  {
    id: 'website',
    accessorKey: 'website',
    cell: (info) => info.getValue()
  },
  {
    id: 'company',
    accessorKey: 'company',
    cell: (info) => info.getValue()
  }
]
