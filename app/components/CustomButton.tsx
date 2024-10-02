import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

type CustomButtonProps = {
    onPress: () => void;
    title: string;
    icon?: string;
    mode?: 'text' | 'outlined' | 'contained';  // Define o estilo do botão
    disabled?: boolean;
    color?: string;
    backgroundColor?: string;  // Permite definir a cor de fundo
    borderRadius?: number;     // Permite definir o raio das bordas
    style?: ViewStyle;
};

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    title,
    icon,
    mode = 'contained',      // Define o modo padrão como 'contained'
    disabled = false,        // Define o estado padrão como ativo
    color = '#ffffff',   // Cor do texto ou ícone, padrão branco
    backgroundColor = '#0e4f66',  // Cor de fundo padrão
    borderRadius = 5,        // Raio de borda padrão
    style = {},
}) => {
    return (
        <Button
            mode={mode}
            icon={icon}
            onPress={onPress}
            disabled={disabled}
            style={[styles.button, { backgroundColor, borderRadius }, style]} // Aplica a cor de fundo e borda
            contentStyle={styles.buttonContent}
            labelStyle={[styles.buttonLabel, { color: color }]}  // Aplica a cor do texto
        >
            {title}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {

        marginVertical: 10,
        elevation: 2,
    },
    buttonContent: {
        paddingVertical: 10,
    },
    buttonLabel: {
        fontSize: 16,
    },
});

export default CustomButton;
