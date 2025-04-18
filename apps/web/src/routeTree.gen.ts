/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AppRouteImport } from './routes/_app/route'
import { Route as ThreadsIndexImport } from './routes/threads/index'
import { Route as AppIndexImport } from './routes/_app/index'
import { Route as ThreadsNewImport } from './routes/threads/new'
import { Route as ThreadsThreadSlugImport } from './routes/threads/$threadSlug'
import { Route as TagsTagSlugImport } from './routes/tags/$tagSlug'
import { Route as CategoriesCategorySlugImport } from './routes/categories/$categorySlug'
import { Route as AppTagsImport } from './routes/_app/tags'
import { Route as AppProfileImport } from './routes/_app/profile'
import { Route as AppLoginImport } from './routes/_app/login'
import { Route as AppCategoriesImport } from './routes/_app/categories'

// Create/Update Routes

const AppRouteRoute = AppRouteImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const ThreadsIndexRoute = ThreadsIndexImport.update({
  id: '/threads/',
  path: '/threads/',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AppRouteRoute,
} as any)

const ThreadsNewRoute = ThreadsNewImport.update({
  id: '/threads/new',
  path: '/threads/new',
  getParentRoute: () => rootRoute,
} as any)

const ThreadsThreadSlugRoute = ThreadsThreadSlugImport.update({
  id: '/threads/$threadSlug',
  path: '/threads/$threadSlug',
  getParentRoute: () => rootRoute,
} as any)

const TagsTagSlugRoute = TagsTagSlugImport.update({
  id: '/tags/$tagSlug',
  path: '/tags/$tagSlug',
  getParentRoute: () => rootRoute,
} as any)

const CategoriesCategorySlugRoute = CategoriesCategorySlugImport.update({
  id: '/categories/$categorySlug',
  path: '/categories/$categorySlug',
  getParentRoute: () => rootRoute,
} as any)

const AppTagsRoute = AppTagsImport.update({
  id: '/tags',
  path: '/tags',
  getParentRoute: () => AppRouteRoute,
} as any)

const AppProfileRoute = AppProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AppRouteRoute,
} as any)

const AppLoginRoute = AppLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => AppRouteRoute,
} as any)

const AppCategoriesRoute = AppCategoriesImport.update({
  id: '/categories',
  path: '/categories',
  getParentRoute: () => AppRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppRouteImport
      parentRoute: typeof rootRoute
    }
    '/_app/categories': {
      id: '/_app/categories'
      path: '/categories'
      fullPath: '/categories'
      preLoaderRoute: typeof AppCategoriesImport
      parentRoute: typeof AppRouteImport
    }
    '/_app/login': {
      id: '/_app/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof AppLoginImport
      parentRoute: typeof AppRouteImport
    }
    '/_app/profile': {
      id: '/_app/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AppProfileImport
      parentRoute: typeof AppRouteImport
    }
    '/_app/tags': {
      id: '/_app/tags'
      path: '/tags'
      fullPath: '/tags'
      preLoaderRoute: typeof AppTagsImport
      parentRoute: typeof AppRouteImport
    }
    '/categories/$categorySlug': {
      id: '/categories/$categorySlug'
      path: '/categories/$categorySlug'
      fullPath: '/categories/$categorySlug'
      preLoaderRoute: typeof CategoriesCategorySlugImport
      parentRoute: typeof rootRoute
    }
    '/tags/$tagSlug': {
      id: '/tags/$tagSlug'
      path: '/tags/$tagSlug'
      fullPath: '/tags/$tagSlug'
      preLoaderRoute: typeof TagsTagSlugImport
      parentRoute: typeof rootRoute
    }
    '/threads/$threadSlug': {
      id: '/threads/$threadSlug'
      path: '/threads/$threadSlug'
      fullPath: '/threads/$threadSlug'
      preLoaderRoute: typeof ThreadsThreadSlugImport
      parentRoute: typeof rootRoute
    }
    '/threads/new': {
      id: '/threads/new'
      path: '/threads/new'
      fullPath: '/threads/new'
      preLoaderRoute: typeof ThreadsNewImport
      parentRoute: typeof rootRoute
    }
    '/_app/': {
      id: '/_app/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppRouteImport
    }
    '/threads/': {
      id: '/threads/'
      path: '/threads'
      fullPath: '/threads'
      preLoaderRoute: typeof ThreadsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface AppRouteRouteChildren {
  AppCategoriesRoute: typeof AppCategoriesRoute
  AppLoginRoute: typeof AppLoginRoute
  AppProfileRoute: typeof AppProfileRoute
  AppTagsRoute: typeof AppTagsRoute
  AppIndexRoute: typeof AppIndexRoute
}

const AppRouteRouteChildren: AppRouteRouteChildren = {
  AppCategoriesRoute: AppCategoriesRoute,
  AppLoginRoute: AppLoginRoute,
  AppProfileRoute: AppProfileRoute,
  AppTagsRoute: AppTagsRoute,
  AppIndexRoute: AppIndexRoute,
}

const AppRouteRouteWithChildren = AppRouteRoute._addFileChildren(
  AppRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof AppRouteRouteWithChildren
  '/categories': typeof AppCategoriesRoute
  '/login': typeof AppLoginRoute
  '/profile': typeof AppProfileRoute
  '/tags': typeof AppTagsRoute
  '/categories/$categorySlug': typeof CategoriesCategorySlugRoute
  '/tags/$tagSlug': typeof TagsTagSlugRoute
  '/threads/$threadSlug': typeof ThreadsThreadSlugRoute
  '/threads/new': typeof ThreadsNewRoute
  '/': typeof AppIndexRoute
  '/threads': typeof ThreadsIndexRoute
}

export interface FileRoutesByTo {
  '/categories': typeof AppCategoriesRoute
  '/login': typeof AppLoginRoute
  '/profile': typeof AppProfileRoute
  '/tags': typeof AppTagsRoute
  '/categories/$categorySlug': typeof CategoriesCategorySlugRoute
  '/tags/$tagSlug': typeof TagsTagSlugRoute
  '/threads/$threadSlug': typeof ThreadsThreadSlugRoute
  '/threads/new': typeof ThreadsNewRoute
  '/': typeof AppIndexRoute
  '/threads': typeof ThreadsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_app': typeof AppRouteRouteWithChildren
  '/_app/categories': typeof AppCategoriesRoute
  '/_app/login': typeof AppLoginRoute
  '/_app/profile': typeof AppProfileRoute
  '/_app/tags': typeof AppTagsRoute
  '/categories/$categorySlug': typeof CategoriesCategorySlugRoute
  '/tags/$tagSlug': typeof TagsTagSlugRoute
  '/threads/$threadSlug': typeof ThreadsThreadSlugRoute
  '/threads/new': typeof ThreadsNewRoute
  '/_app/': typeof AppIndexRoute
  '/threads/': typeof ThreadsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/categories'
    | '/login'
    | '/profile'
    | '/tags'
    | '/categories/$categorySlug'
    | '/tags/$tagSlug'
    | '/threads/$threadSlug'
    | '/threads/new'
    | '/'
    | '/threads'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/categories'
    | '/login'
    | '/profile'
    | '/tags'
    | '/categories/$categorySlug'
    | '/tags/$tagSlug'
    | '/threads/$threadSlug'
    | '/threads/new'
    | '/'
    | '/threads'
  id:
    | '__root__'
    | '/_app'
    | '/_app/categories'
    | '/_app/login'
    | '/_app/profile'
    | '/_app/tags'
    | '/categories/$categorySlug'
    | '/tags/$tagSlug'
    | '/threads/$threadSlug'
    | '/threads/new'
    | '/_app/'
    | '/threads/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AppRouteRoute: typeof AppRouteRouteWithChildren
  CategoriesCategorySlugRoute: typeof CategoriesCategorySlugRoute
  TagsTagSlugRoute: typeof TagsTagSlugRoute
  ThreadsThreadSlugRoute: typeof ThreadsThreadSlugRoute
  ThreadsNewRoute: typeof ThreadsNewRoute
  ThreadsIndexRoute: typeof ThreadsIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  AppRouteRoute: AppRouteRouteWithChildren,
  CategoriesCategorySlugRoute: CategoriesCategorySlugRoute,
  TagsTagSlugRoute: TagsTagSlugRoute,
  ThreadsThreadSlugRoute: ThreadsThreadSlugRoute,
  ThreadsNewRoute: ThreadsNewRoute,
  ThreadsIndexRoute: ThreadsIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_app",
        "/categories/$categorySlug",
        "/tags/$tagSlug",
        "/threads/$threadSlug",
        "/threads/new",
        "/threads/"
      ]
    },
    "/_app": {
      "filePath": "_app/route.tsx",
      "children": [
        "/_app/categories",
        "/_app/login",
        "/_app/profile",
        "/_app/tags",
        "/_app/"
      ]
    },
    "/_app/categories": {
      "filePath": "_app/categories.tsx",
      "parent": "/_app"
    },
    "/_app/login": {
      "filePath": "_app/login.tsx",
      "parent": "/_app"
    },
    "/_app/profile": {
      "filePath": "_app/profile.tsx",
      "parent": "/_app"
    },
    "/_app/tags": {
      "filePath": "_app/tags.tsx",
      "parent": "/_app"
    },
    "/categories/$categorySlug": {
      "filePath": "categories/$categorySlug.tsx"
    },
    "/tags/$tagSlug": {
      "filePath": "tags/$tagSlug.tsx"
    },
    "/threads/$threadSlug": {
      "filePath": "threads/$threadSlug.tsx"
    },
    "/threads/new": {
      "filePath": "threads/new.tsx"
    },
    "/_app/": {
      "filePath": "_app/index.tsx",
      "parent": "/_app"
    },
    "/threads/": {
      "filePath": "threads/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
