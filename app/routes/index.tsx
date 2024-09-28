import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AdminRoutes from './admin.routes';
import AuthRoutes from './auth.routes';
import CollaboratorRoutes from './collaborator.routes';

const Routes: React.FC = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            {user?.papel === 'admin' ? <AdminRoutes /> : user?.papel === 'collaborator' ? <CollaboratorRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    );
};

export default Routes;
