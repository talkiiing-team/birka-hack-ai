import { FormEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const PredictCreateForm = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const submitForm = (e: FormEvent) => {
        e.preventDefault()

        const file = ref.current?.files?.item(0) as File

        const formData = new FormData()

        formData.append('train', file!, 'train')

        setIsLoading(true)

        axios
            .post('https://api.birka.talkiiing.ru/v1/predicts', formData, {
                headers: {
                    'Content-Type': `multipart/form-data`,
                },
            })
            .then(() => navigate('/predicts'))
        // .catch(() => window.location.reload())
    }

    const ref = useRef<HTMLInputElement | null>(null)

    return (
        <form
            onSubmit={submitForm}
            className='flex flex-col space-y-4 max-w-[20rem]'
        >
            {isLoading ? (
                <p>
                    Ожидайте загрузки файла. Это может занять до нескольких
                    минут. Далее вы будете перенаправлены на страницу со всеми
                    заявками, где появится вновь созданная заявка.
                </p>
            ) : (
                <p>
                    Выберите или перетащите файл в поле ниже, затем нажмите
                    кнопку "Создать заявку". Будет создана заявка на
                    предсказание. По истечении некоторого времени можно будет
                    посмотреть результаты.
                </p>
            )}

            <input
                type='file'
                ref={ref}
                className='file-input file-input-bordered file-input-primary w-full max-w-xs'
            />

            <button className='btn' type='submit' disabled={isLoading}>
                Создать заявку
            </button>
        </form>
    )
}
