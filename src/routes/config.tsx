import React, { lazy, ReactNode, Suspense } from 'react'

import type { RouteObject } from 'react-router-dom'

import Loading from '@/components/Loading'
import AppLayout from '@/layouts/AppLayout'
import Aggregation from '@/static/Aggregation'
import LocalCompute from '@/static/LocalCompute'
import LookupOnlineStore from '@/static/LookupOnlineStore'
import ModelService from '@/static/ModelService'
import MovieDetails from '@/static/ModelService/components/MovieDetails'

const Home = lazy(() => import('@/static/Home'))

const InvokeExternalApi = lazy(() => import('@/static/ExternalApi'))

const FeathrChat = lazy(() => import('@/static/FeathrChat'))

const Page404 = lazy(() => import('@/static/404'))

const lazyLoad = (children: ReactNode): ReactNode => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export const routers: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        path: '/',
        element: lazyLoad(<Home />)
      },
      {
        index: true,
        path: '/lookup-online-store',
        element: lazyLoad(<LookupOnlineStore />)
      },
      {
        index: true,
        path: '/local-compute',
        element: lazyLoad(<LocalCompute />)
      },
      {
        index: true,
        path: '/invoke-external-api',
        element: lazyLoad(<InvokeExternalApi />)
      },
      {
        path: '/aggregation',
        element: lazyLoad(<Aggregation />)
      },
      {
        path: '/model-service',
        element: lazyLoad(<ModelService />)
      },
      {
        path: '/movie-details/:id',
        element: lazyLoad(<MovieDetails />)
      },
      {
        path: '/feathr-chat',
        element: lazyLoad(<FeathrChat />)
      },
      {
        path: '/404',
        element: lazyLoad(<Page404 />)
      },
      {
        path: '*',
        element: lazyLoad(<Page404 />)
      }
    ]
  }
]
