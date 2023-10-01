import axios from 'axios'
import { PredictTicketPreview, PredictTicketStatus } from '../domain/predicts'

export const getPredicts = (): Promise<PredictTicketPreview[]> => {
    return axios
        .get<
            {
                id: number
                status: 'at_work' | 'failed' | 'done'
                ts: string
            }[]
        >('https://api.birka.talkiiing.ru/v1/predicts')
        .then(data => data.data)
        .then(previews =>
            previews
                .map(preview => ({
                    id: preview.id,
                    status: {
                        at_work: PredictTicketStatus.InProgress,
                        done: PredictTicketStatus.Success,
                        failed: PredictTicketStatus.Error,
                    }[preview.status],
                    createdAtUtc: new Date(Date.parse(preview.ts)).getTime(),
                }))
                .reverse(),
        )
}
