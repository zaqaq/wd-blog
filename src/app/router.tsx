import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/components/RequireAuth.tsx'
import { AdminArticleFormSkeleton } from '@/components/Skeleton/AdminArticleFormSkeleton.tsx'
import { AdminArticlesSkeleton } from '@/components/Skeleton/AdminArticlesSkeleton.tsx'
import { ArticleDetailHydrateFallback } from '@/components/Skeleton/ArticleDetailSkeleton.tsx'
import { ArticleListSkeleton } from '@/components/Skeleton/ArticleListSkeleton.tsx'
import { AdminLayout } from '@/layouts/AdminLayout.tsx'
import { MainLayout } from '@/layouts/MainLayout.tsx'
import { paths } from '@/lib/paths.ts'
import { LegacyOrNotFound } from '@/pages/NotFound/index.tsx'
import type { ComponentType } from 'react'

function lazyPage(
  importer: () => Promise<{ default: ComponentType }>,
  HydrateFallback: ComponentType = () => null,
) {
  return {
    lazy: async () => {
      const { default: Component } = await importer()
      return { Component }
    },
    HydrateFallback,
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
            ...lazyPage(
              () => import('@/pages/admin/Articles/index.tsx'),
              AdminArticlesSkeleton,
            ),
          },
          {
            path: '/admin/articles/:id/edit',
            ...lazyPage(
              () => import('@/pages/admin/ArticleEdit/index.tsx'),
              AdminArticleFormSkeleton,
            ),
          },
          {
            path: '/admin/publish',
            ...lazyPage(
              () => import('@/pages/admin/Publish/index.tsx'),
              AdminArticleFormSkeleton,
            ),
          },
          {
            path: '/admin/site',
            ...lazyPage(
              () => import('@/pages/admin/SiteSettings/index.tsx'),
              AdminArticleFormSkeleton,
            ),
          },
          {
            path: '/admin/nav',
            ...lazyPage(
              () => import('@/pages/admin/Nav/index.tsx'),
              AdminArticlesSkeleton,
            ),
          },
          {
            path: '/admin/tags',
            ...lazyPage(
              () => import('@/pages/admin/Tags/index.tsx'),
              AdminArticlesSkeleton,
            ),
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
        ...lazyPage(
          () => import('@/pages/Home/index.tsx'),
          ArticleListSkeleton,
        ),
      },
      {
        path: 'page/:id',
        ...lazyPage(
          () => import('@/pages/Home/index.tsx'),
          ArticleListSkeleton,
        ),
      },
      {
        path: 'article/:id',
        ...lazyPage(
          () => import('@/pages/ArticleDetails/index.tsx'),
          ArticleDetailHydrateFallback,
        ),
      },
      {
        path: 'search',
        ...lazyPage(
          () => import('@/pages/Search/index.tsx'),
          ArticleListSkeleton,
        ),
      },
      {
        path: 'category/:navId',
        ...lazyPage(
          () => import('@/pages/Category/index.tsx'),
          ArticleListSkeleton,
        ),
      },
      {
        path: 'tag',
        ...lazyPage(
          () => import('@/pages/Tag/index.tsx'),
          ArticleListSkeleton,
        ),
      },
      {
        path: '*',
        element: <LegacyOrNotFound />,
      },
    ],
  },
])
