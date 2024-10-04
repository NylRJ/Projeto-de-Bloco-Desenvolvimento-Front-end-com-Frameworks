import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

type CustomButtonProps = {
    onPress: () => void;
    title: string;
    icon?: string;
    mode?: 'text' | 'outlined' | 'contained';
    disabled?: boolean;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    style?: ViewStyle;
};

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    title,
    icon,
    mode = 'contained',
    disabled = false,
    color = '#ffffff',
    backgroundColor = '#0e4f66',
    borderRadius = 5,
    style = {},
}) => {
    return (
        <Button
            mode={mode}
            icon={icon}
            onPress={onPress}
            disabled={disabled}
            style={[styles.button, { backgroundColor, borderRadius }, style]}
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
