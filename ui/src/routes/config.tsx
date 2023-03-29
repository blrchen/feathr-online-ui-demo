import React, { lazy, ReactNode, Suspense } from 'react'

import type { RouteObject } from 'react-router-dom'

import Loading from '@/components/Loading'
import AppLayout from '@/layouts/AppLayout'
import Aggregation from '@/pages/Aggregation'
import LocalCompute from '@/pages/LocalCompute'
import LookupOnlineStore from '@/pages/LookupOnlineStore'
import ModelService from '@/pages/ModelService'
import MovieDetails from '@/pages/ModelService/components/MovieDetails'

const Home = lazy(() => import('@/pages/Home'))

const InvokeExternalApi = lazy(() => import('src/pages/ExternalApi'))

const Page404 = lazy(() => import('@/pages/404'))

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
