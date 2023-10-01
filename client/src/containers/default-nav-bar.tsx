import { Link } from 'react-router-dom'
import { TagIcon } from '@heroicons/react/24/outline'

const ROUTES: { name: string; to: string }[] = [
    {
        to: '/predicts',
        name: 'Предсказание сообщений о багаже',
    },
    {
        to: '/anomalies',
        name: 'Выявление аномалий',
    },
    {
        to: '/train',
        name: 'Обучение модели',
    },
]

export const DefaultNavBar = () => {
    return (
        <div className='min-h-full bg-base-200 text-base-content'>
            <Link to='/' className='flex justify-center py-24'>
                <TagIcon className='text-base' width={24} height={24} />
            </Link>

            <ul className='menu p-4 w-80 '>
                {ROUTES.map(({ name, to }) => (
                    <li key={to}>
                        <Link to={to}>{name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
