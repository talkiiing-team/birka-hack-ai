import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from './layouts/default-layout'
import { ErrorPage } from './pages/error-page'
import { MainPage } from './pages/main-page'
import { AnomaliesListPage } from './pages/anomalies/anomalies-list-page'
import { AnomalyDetailsPage } from './pages/anomalies/anomaly-details-page'
import { PredictDetailsPage } from './pages/predicts/predict-details-page'
import { PredictsListPage } from './pages/predicts/predicts-list-page'
import { TrainStatusPage } from './pages/train/train-status-page'
import { PredictCreatePage } from './pages/predicts/predict-create-page'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <MainPage />,
            },

            {
                path: 'predicts',
                children: [
                    {
                        path: '',
                        element: <PredictsListPage />,
                    },

                    {
                        path: 'new',
                        element: <PredictCreatePage />,
                    },

                    {
                        path: ':id',
                        element: <PredictDetailsPage />,
                    },
                ],
            },

            {
                path: 'anomalies',
                children: [
                    {
                        path: '',
                        element: <AnomaliesListPage />,
                    },

                    {
                        path: ':id',
                        element: <AnomalyDetailsPage />,
                    },
                ],
            },

            {
                path: 'train',
                element: <TrainStatusPage />,
            },
        ],
    },
])
