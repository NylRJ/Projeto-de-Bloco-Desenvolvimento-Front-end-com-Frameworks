

import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#005780', // Azul Principal
        accent: '#4CAF50', // Verde
        background: '#FFFFFF', // Fundo branco padrão
        surface: '#FFFFFF', // Cor de superfície, pode ser branco
        text: '#000000', // Preto
        placeholder: '#5E6A71', // Cinza Escuro
        disabled: '#B0BEC5', // Cinza Claro
    },
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#bb86fc',
        accent: '#03dac6',
        background: '#121212',
        surface: '#121212',
        text: '#ffffff',
        disabled: '#3e3e3e',
    },
};


export default lightTheme;  
