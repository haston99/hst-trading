import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AdminRoute } from "@/components/AdminRoute"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import VerifyPage from "./pages/auth/VerifyPage"
import PortalLayout from "./pages/portal/PortalLayout"
import PortalDashboard from "./pages/portal/PortalDashboard"
import NewRequest from "./pages/portal/requests/NewRequest"
import RequestDetail from "./pages/portal/requests/RequestDetail"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminMessages from "./pages/admin/AdminMessages"
import AdminClients from "./pages/admin/AdminClients"
import ClientDetail from "./pages/admin/clients/ClientDetail"
import AdminRequestDetail from "./pages/admin/requests/AdminRequestDetail"
import TrendingManager from "./pages/admin/trending/TrendingManager"
import NewsManager from "./pages/admin/news/NewsManager"
import TrendsPage from "./pages/TrendsPage"
import NewsPage from "./pages/NewsPage"

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/verify" element={<VerifyPage />} />
            <Route path="/portal" element={
              <ProtectedRoute>
                <PortalLayout />
              </ProtectedRoute>
            }>
              <Route index element={<PortalDashboard />} />
              <Route path="requests/new" element={<NewRequest />} />
              <Route path="requests/:requestId" element={<RequestDetail />} />
            </Route>
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="requests" element={<AdminDashboard />} />
              <Route path="requests/:requestId" element={<AdminRequestDetail />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="clients/:clientId" element={<ClientDetail />} />
              <Route path="trending" element={<TrendingManager />} />
              <Route path="news" element={<NewsManager />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster position="top-right" />
    </>
  )
}

export default App
