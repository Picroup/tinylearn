import { LessThan, MoreThan } from 'typeorm'
import { format } from 'date-fns'

// TypeORM Query Operators
export const MoreThanDate = (date: Date) => MoreThan(sqlDateTime(date))
export const LessThanDate = (date: Date) => LessThan(sqlDateTime(date))

export function sqlDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss.SSS')
}