import { PredictCreateForm } from '../../containers/predict-create-form'

export const PredictCreatePage = () => {
    return (
        <div className='min-h-full min-w-[20rem] flex flex-col'>
            <h1 className='text-2xl mb-3'>Создание и загрузка файла</h1>

            <PredictCreateForm />
        </div>
    )
}
