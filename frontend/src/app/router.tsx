import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router'
import Layout from '@/shared/components/Layout'
import ChatWindow from '@/features/chat/components/ChatWindow'
import PdfPage from '@/features/pdf-extractor/components/PdfPage'
import DashboardPage from '@/features/dashboard/components/DashboardPage'

const rootRoute = createRootRoute({
  component: Layout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/chat' })
  },
})

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatWindow,
})

const pdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pdf',
  component: PdfPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const routeTree = rootRoute.addChildren([indexRoute, chatRoute, pdfRoute, dashboardRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
