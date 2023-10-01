import { Link } from 'react-router-dom'
import { PredictTicketsList } from '../../containers/predict-tickets-list'

export const PredictsListPage = () => {
    return (
        <div>
            <h1 className='text-3xl mb-10'>Заявки на предсказание</h1>

            <Link className='btn btn-primary' to='/predicts/new'>
                Создать заявку
            </Link>

            <PredictTicketsList className='my-10' />

            <Link className='btn btn-primary' to='/predicts/new'>
                Создать заявку
            </Link>
        </div>
    )
}
