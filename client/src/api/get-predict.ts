import axios from 'axios'
import {
    Predict,
    PredictTicketStatus,
    uglyDateIntoDate,
} from '../domain/predicts'

export const getPredict = (id: number): Promise<Predict> => {
    return axios
        .get<{
            id: number
            status: 'at_work' | 'failed' | 'done'
            ts: string
            result: {
                predict: {
                    target_count: number[]
                    dates: number[][]
                    is_new: boolean[]
                }

                sum_count_new_bsm: number
                mean_count_new_bsm: number
            }
        }>(`https://api.birka.talkiiing.ru/v1/predicts/${id}`)
        .then(d => d.data)
        .then(d => ({
            id: d.id,
            status: {
                at_work: PredictTicketStatus.InProgress,
                done: PredictTicketStatus.Success,
                failed: PredictTicketStatus.Error,
            }[d.status],
            createdAtUtc: new Date(Date.parse(d.ts)).getTime(),
            result: {
                ...d.result,

                predict: {
                    ...d.result.predict,
                    dates: d.result.predict.dates.map(uglyDateIntoDate),
                },
            },
        }))
}
