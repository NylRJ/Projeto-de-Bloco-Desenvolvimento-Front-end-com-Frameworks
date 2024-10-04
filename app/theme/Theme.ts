import { DefaultTheme as PaperLightTheme, MD3DarkTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import merge from 'deepmerge';

// Adaptação do tema para combinar o React Native Paper e React Navigation
import { adaptNavigationTheme } from 'react-native-paper';

const { LightTheme: NavigationLightTheme, DarkTheme: NavigationDarkThemeAdapted } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

// Tema Claro
export const lightTheme = merge(PaperLightTheme, {
    ...NavigationLightTheme,
    colors: {
        ...NavigationLightTheme.colors,
        primary: '#005780', // Azul Principal
        accent: '#4CAF50',  // Verde para ações
        background: '#FFFFFF', // Fundo branco padrão
        surface: '#FFFFFF',   // Cor de superfície
        text: '#000000',      // Texto preto
        placeholder: '#5E6A71', // Cinza escuro para placeholders
        disabled: '#B0BEC5',  // Cinza claro para botões desativados
    },
});

// Tema Escuro
export const darkTheme = merge(MD3DarkTheme, {
    ...NavigationDarkThemeAdapted,
    colors: {
        ...NavigationDarkThemeAdapted.colors,
        primary: '#bb86fc',   // Roxo para o tema escuro
        accent: '#03dac6',    // Cores secundárias no tema escuro
        background: '#121212', // Fundo padrão escuro
        surface: '#121212',    // Superfícies escuras
        text: '#ffffff',       // Texto branco
        placeholder: '#888888', // Placeholder cinza claro
        disabled: '#3e3e3e',   // Cinza para botões desativados
    },
});

// Exporta o tema claro como padrão
export default lightTheme;
