import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthRoutes from '../routes/auth.routes';
import AdminRoutes from '../routes/admin.routes';
import ColaboradorRoutes from '../routes/collaborator.routes';

const AppNavigation: React.FC = () => {
    const { user }: any = useAuth();

    const renderRoutes = () => {
        if (user?.papel === 'Administrador') {
            return <AdminRoutes />;
        } else if (user?.papel === 'Colaborador') {
            return <ColaboradorRoutes />;
        } else {
            return <AuthRoutes />;
        }
    };

    return (
        <NavigationContainer independent={true}>
            {renderRoutes()}
        </NavigationContainer>
    );
};

export default AppNavigation;
