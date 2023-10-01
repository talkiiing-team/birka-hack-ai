export const enum PredictTicketStatus {
    InProgress = 'InProgress',
    Error = 'Error',
    Success = 'Success',
}

export type PredictTicketPreview = {
    id: number
    status: PredictTicketStatus
    createdAtUtc: number
}

export type Predict = PredictTicketPreview & {
    result: {
        predict: {
            target_count: number[]
            dates: Date[]
            is_new: boolean[]
        }

        sum_count_new_bsm: number
        mean_count_new_bsm: number
    }
}

export const uglyDateIntoDate = ([month, day, hour, minute]: number[]) => {
    const date = new Date()

    date.setFullYear(2023, month - 1, day)
    date.setDate(day)
    date.setMonth(month - 1)
    date.setHours(hour)
    date.setMinutes(minute)

    return date
}
