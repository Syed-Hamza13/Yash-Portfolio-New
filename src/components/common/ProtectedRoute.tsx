import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoadingState from '@/components/common/LoadingState'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Checking authentication..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
