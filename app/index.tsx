import React from 'react';

import AppNavigation from './navigation/AppNavigation';

import { AuthProvider, useAuth } from './context/AuthContext';

import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { PreferencesProvider } from './context/ThemeContext';




const App = () => {
    return (
        <AuthProvider>
            <PreferencesProvider>

                <AppNavigation />

            </PreferencesProvider>
        </AuthProvider>
    );
};

export default App;
