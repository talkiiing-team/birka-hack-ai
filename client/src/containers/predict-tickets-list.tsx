import useSWR from 'swr'
import { getPredicts } from '../api/get-predicts'
import { PredictTicketPreviewCard } from '../components/predict-ticket-preview-card'
import { Loader } from '../components/loader'
import { FC, HTMLAttributes } from 'react'
import clsx from 'clsx'

export type PredictTicketListProps = HTMLAttributes<HTMLDivElement>

export const PredictTicketsList: FC<PredictTicketListProps> = ({
    className,
    ...attrs
}) => {
    const { data, error, isLoading } = useSWR('tickets-list', getPredicts, {
        refreshInterval: 3000,
    })

    return (
        <div className={clsx(className, 'flex flex-col space-y-4')} {...attrs}>
            {data?.map(preview => (
                <PredictTicketPreviewCard key={preview.id} preview={preview} />
            ))}

            {isLoading && <Loader />}
        </div>
    )
}
