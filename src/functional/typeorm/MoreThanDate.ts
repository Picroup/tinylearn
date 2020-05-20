import { LessThan, MoreThan } from 'typeorm'
import { format } from 'date-fns'

// TypeORM Query Operators
export const MoreThanDate = (date: Date) => MoreThan(format(date, 'yyyy-MM-dd HH:mm:ss.SSS'))
export const LessThanDate = (date: Date) => LessThan(format(date, 'yyyy-MM-dd HH:mm:ss.SSS'))
