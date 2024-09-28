import React from 'react';

import AppNavigation from './navigation/AppNavigation';

import { AuthProvider, useAuth } from './context/AuthContext';

import { PaperProvider } from 'react-native-paper';

import theme from './theme/Theme';
import { NavigationContainer } from '@react-navigation/native';




const App = () => {
    return (
        <AuthProvider>
            <PaperProvider theme={theme}>

                <AppNavigation />

            </PaperProvider>
        </AuthProvider>
    );
};

export default App;
