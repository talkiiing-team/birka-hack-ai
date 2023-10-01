import { Bar, Line, Pie } from 'react-chartjs-2'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import { getPredict } from '../../api/get-predict'
import { useMemo } from 'react'

const RANGE_COEF = 0.3

const getOptions = ({ name }: { name: string }) => ({
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,

            labels: {
                filter(item: any) {
                    // Logic to remove a particular legend item goes here
                    return !item.text.includes('!')
                },
            },
        },
        title: {
            display: true,
            text: name,
        },
    },
    elements: {
        point: {
            radius: 0,
        },
    },
})

const BAR_LABELS = ['a', 'b', 'c', 'd']

const BAR_DATA = {
    labels: BAR_LABELS,
    datasets: [
        {
            label: 'Dataset 1',
            data: BAR_LABELS.map(() => Math.random()),
            backgroundColor: 'rgba(90, 99, 132, 0.5)',
        },
    ],
}

export const PredictDetailsPage = () => {
    const { id = '0' } = useParams()

    const { data } = useSWR(`predict-${id}`, () => getPredict(parseInt(id)), {
        revalidateOnFocus: false,
    })

    const chartData = useMemo(() => {
        if (!data) {
            return null
        }

        return {
            labels: data.result.predict.dates.map(date =>
                date.toLocaleString(),
            ),

            datasets: [
                {
                    label: '!min',
                    data: data.result.predict.target_count.map(
                        count => count - count * RANGE_COEF,
                    ),
                    backgroundColor: 'rgba(90, 90, 90, 0.1)',
                },

                {
                    label: '!max',
                    data: data.result.predict.target_count.map(
                        count => count + count * RANGE_COEF,
                    ),
                    backgroundColor: 'rgba(90, 90, 90, 0.1)',
                },

                {
                    label: 'Исторические данные',
                    data: data.result.predict.target_count.map((count, i) =>
                        data.result.predict.is_new[i] ? null : count,
                    ),
                    borderColor: 'rgba(90, 99, 132, 1)',
                },

                {
                    label: 'Прогноз',
                    data: data.result.predict.target_count.map((count, i) =>
                        data.result.predict.is_new[i] ? count : null,
                    ),
                    borderColor: 'rgba(190, 50, 50,1)',
                },
            ],
        }
    }, [data])

    const histogramData = useMemo(() => {
        if (!data) return null

        const newData = data.result.predict.target_count.filter(
            (_, i) => data.result.predict.is_new[i],
        )

        const sortedData = [...newData].sort()

        const histogramData: number[] = []
        const histogramLabels: number[] = []

        const overallDataCount = sortedData.length
        const groups = 10

        for (let i = 0; i < groups; i++) {
            const currentIndex = Math.floor((overallDataCount / groups) * i)
            const nextIndex =
                Math.floor((overallDataCount / groups) * (i + 1)) - 1
            console.log(currentIndex, nextIndex)

            histogramLabels.push(sortedData[currentIndex])
            histogramData.push(
                sortedData.filter(
                    count =>
                        count >= sortedData[currentIndex] &&
                        count < sortedData[nextIndex],
                ).length,
            )
        }

        return {
            labels: histogramLabels,
            datasets: [
                {
                    label: 'Распределение кол-ва новых сообщений',
                    data: histogramData,
                },
            ],
        }
    }, [data])

    const predictedFrom = useMemo(() => {
        if (!data) return ''

        return (
            data.result.predict.dates
                .find((_date, i) => data.result.predict.is_new[i])
                ?.toLocaleString() ?? ''
        )
    }, [data])

    return (
        <div className='w-full h-full max-w-full max-h-full grid grid-cols-3 grid-rows-3 gap-5'>
            {chartData && (
                <div className='p-3 rounded-md bg-base-200 col-span-2 row-span-3'>
                    <Line
                        data={chartData}
                        options={getOptions({ name: 'Количество сообщений' })}
                    />
                </div>
            )}

            {data && (
                <div className='p-3 rounded-md bg-base-200 col-span-1 row-span-1'>
                    <p>
                        <small>
                            Заявка #{data.id} от{' '}
                            {new Date(data.createdAtUtc).toLocaleString()}
                        </small>
                    </p>
                    <p>Прогноз производился начиная от {predictedFrom}</p>
                    <p>
                        Суммарно за 100 минут прогнозируется, что будет получено
                        сообщений о обработке багажа:{' '}
                        <span className='font-bold'>
                            {data.result.sum_count_new_bsm}
                        </span>
                    </p>
                    <p>
                        Медиана количества сообщений за 100 минут:{' '}
                        <span className='font-bold'>
                            {data.result.mean_count_new_bsm}
                        </span>
                    </p>
                </div>
            )}

            {histogramData && (
                <div className='p-3 rounded-md bg-base-200 row-span-2'>
                    <Bar
                        data={histogramData}
                        options={getOptions({
                            name: 'Распределение количества сообщений',
                        })}
                    />
                </div>
            )}

            {/*             
            <div className='p-3 rounded-md bg-base-200 col-span-1 row-span-1'>
                <Pie data={BAR_DATA} options={BAR_OPTIONS} />
            </div>
            <div className='p-3 rounded-md bg-base-200 col-span-1 row-span-1'>
                <Line data={BAR_DATA} options={BAR_OPTIONS} />
            </div>
            <div className='p-3 rounded-md bg-base-200 col-span-1 row-span-1'>
                <Bar data={BAR_DATA} options={BAR_OPTIONS} />
            </div>
            <div className='p-3 rounded-md bg-base-200 col-span-2 row-span-1'>
                <Line data={BAR_DATA} options={BAR_OPTIONS} />
            </div> */}
        </div>
    )
}
