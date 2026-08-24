import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/components/RequireAuth.tsx'
import { AdminLayout } from '@/layouts/AdminLayout.tsx'
import { MainLayout } from '@/layouts/MainLayout.tsx'
import { paths } from '@/lib/paths.ts'
import { LegacyOrNotFound } from '@/pages/NotFound/index.tsx'
import type { ComponentType } from 'react'

function lazyPage(importer: () => Promise<{ default: ComponentType }>) {
  return {
    lazy: async () => {
      const { default: Component } = await importer()
      return { Component }
    },
  }
}

export const router = createBrowserRouter([
  {
    path: '/admin/login',
    ...lazyPage(() => import('@/pages/admin/Login/index.tsx')),
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin',
            element: <Navigate to={paths.adminArticles} replace />,
          },
          {
            path: '/admin/articles',
            ...lazyPage(() => import('@/pages/admin/Articles/index.tsx')),
          },
          {
            path: '/admin/articles/:id/edit',
            ...lazyPage(() => import('@/pages/admin/ArticleEdit/index.tsx')),
          },
          {
            path: '/admin/publish',
            ...lazyPage(() => import('@/pages/admin/Publish/index.tsx')),
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        ...lazyPage(() => import('@/pages/Home/index.tsx')),
      },
      {
        path: 'page/:id',
        ...lazyPage(() => import('@/pages/Home/index.tsx')),
      },
      {
        path: 'article/:id',
        ...lazyPage(() => import('@/pages/ArticleDetails/index.tsx')),
      },
      {
        path: 'search',
        ...lazyPage(() => import('@/pages/Search/index.tsx')),
      },
      {
        path: 'category/:navId',
        ...lazyPage(() => import('@/pages/Category/index.tsx')),
      },
      {
        path: '*',
        element: <LegacyOrNotFound />,
      },
    ],
  },
])
