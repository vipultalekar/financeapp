import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GlobalLoader } from '@/components/ui/GlobalLoader';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <GlobalLoader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
