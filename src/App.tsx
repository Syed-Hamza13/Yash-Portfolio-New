import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'

// Public Pages
import HomePage from '@/pages/public/HomePage'
import PortfolioPage from '@/pages/public/PortfolioPage'
import ProjectDetailPage from '@/pages/public/ProjectDetailPage'

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminProjectsPage from '@/pages/admin/AdminProjectsPage'
import AdminProjectFormPage from '@/pages/admin/AdminProjectFormPage'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage'
import AdminContentPage from '@/pages/admin/AdminContentPage'
import AdminExperiencePage from '@/pages/admin/AdminExperiencePage'
import AdminEducationPage from '@/pages/admin/AdminEducationPage'
import AdminSkillsPage from '@/pages/admin/AdminSkillsPage'
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage'

export default function App() {
  return (
    <Routes>
      {/* Public Client Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<PortfolioPage />} />
        <Route path="work/:slug" element={<ProjectDetailPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="projects/new" element={<AdminProjectFormPage />} />
        <Route path="projects/:id/edit" element={<AdminProjectFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="experience" element={<AdminExperiencePage />} />
        <Route path="education" element={<AdminEducationPage />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
