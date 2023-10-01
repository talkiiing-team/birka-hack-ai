import { FC, HTMLAttributes } from 'react'
import { PredictTicketPreview, PredictTicketStatus } from '../domain/predicts'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline'

export type PredictTicketPreviewCardProps = {
    preview: PredictTicketPreview
} & HTMLAttributes<HTMLAnchorElement>

export const PredictTicketPreviewCard: FC<PredictTicketPreviewCardProps> = ({
    preview,
    className,
    ...attrs
}) => {
    const statusInfo = {
        [PredictTicketStatus.Error]: {
            className: 'text-error',
            text: 'Ошибка',
            icon: XMarkIcon,
        },
        [PredictTicketStatus.InProgress]: {
            className: 'text-warning',
            text: 'В процессе',
            icon: ClockIcon,
            iconClassName: 'animate-pulse',
        },
        [PredictTicketStatus.Success]: {
            className: 'text-success',
            text: 'Готово',
            icon: CheckIcon,
        },
    }[preview.status]

    const StatusInfoIcon = statusInfo.icon

    const linkTo = `/predicts/${preview.id}`

    const dateFormatted = new Date(preview.createdAtUtc).toLocaleString()

    return (
        <Link
            className={clsx(
                className,
                'card card-compact w-96 bg-base-200 shadow-md',
                'hover:brightness-105 transition-all',
            )}
            to={linkTo}
            {...attrs}
        >
            <div className='card-body'>
                <h2 className='card-title'>Заявка #{preview.id}</h2>
                <p>от {dateFormatted}</p>
                <p
                    className={clsx(
                        statusInfo.className,
                        'flex flex-row items-center',
                    )}
                >
                    {statusInfo.text}
                    <StatusInfoIcon
                        className={clsx(
                            statusInfo.iconClassName,
                            'w-4 h-4 ml-2',
                        )}
                    />
                </p>
            </div>
        </Link>
    )
}
