import React, { createContext, useState, useCallback, useMemo, useContext, ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import lightTheme, { darkTheme } from '../theme/Theme'; // Importa os temas claro e escuro

// Define o tipo para as propriedades do provedor
type PreferencesProviderProps = {
    children: ReactNode;
};

type PreferencesContextType = {
    toggleTheme: () => void;
    isThemeDark: boolean;
};

// Cria o contexto para alternância de tema
export const PreferencesContext = createContext<PreferencesContextType>({
    toggleTheme: () => { },
    isThemeDark: false,
});

export const PreferencesProvider = ({ children }: PreferencesProviderProps) => {
    const [isThemeDark, setIsThemeDark] = useState(false);

    // Alterna o estado do tema
    const toggleTheme = useCallback(() => {
        setIsThemeDark((prevTheme) => !prevTheme);
    }, []);

    const preferences = useMemo(() => ({
        toggleTheme,
        isThemeDark,
    }), [toggleTheme, isThemeDark]);

    // Escolhe o tema com base no estado
    const theme = isThemeDark ? darkTheme : lightTheme;

    return (
        <PreferencesContext.Provider value={preferences}>
            <PaperProvider theme={theme}>
                <NavigationContainer independent={true} theme={theme}>
                    {children}
                </NavigationContainer>
            </PaperProvider>
        </PreferencesContext.Provider>
    );
};

// Hook para acessar o contexto de tema
export const useThemeContext = () => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('useThemeContext deve ser usado dentro de um PreferencesProvider');
    }
    return context;
};
