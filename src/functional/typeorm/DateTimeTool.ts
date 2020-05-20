import { format } from 'date-fns'

export namespace DateTimeTool {

    export function dateTime(date: Date): String {
        return format(date, 'yyyy-MM-dd HH:mm:ss.SSS')
    }
}