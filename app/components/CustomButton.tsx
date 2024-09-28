import React from 'react';
import { Button, IconButton, MD3Colors } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

type CustomButtonProps = {
    onPress: () => void;
    title: string;
    icon?: string;
    mode?: 'text' | 'outlined' | 'contained';  // Define o estilo do botão
    disabled?: boolean;
    color?: string;
    style?: ViewStyle;

};

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    title,
    icon,
    mode = 'contained',      // Define o modo padrão como 'contained'
    disabled = false,        // Define o estado padrão como ativo
    color = '#ffffff'        // Cor do texto ou ícone, padrão branco
}) => {
    return (
        <Button
            mode={mode}
            icon={icon}
            onPress={onPress}
            disabled={disabled}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={[styles.buttonLabel, { color: color }]}
        >
            {title}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 10,
        borderRadius: 5,
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
