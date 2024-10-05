
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface ButtonComponentProps {
    onPress: () => void;
    label: string;
    mode?: 'text' | 'outlined' | 'contained';
    icon?: string;
    color?: string;
    loading?: boolean;
    disabled?: boolean;
    style?: object;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
    onPress,
    label,
    mode = 'contained',
    icon,
    color = '#6200ee',
    loading = false,
    disabled = false,
    style = {}
}) => {
    return (
        <Button
            icon={icon}
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled}
            style={[styles.button, style]}
            contentStyle={styles.content}
            color={color}
        >
            {label}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 10,
        borderRadius: 5,
    },
    content: {
        height: 50,
    }
});

export default ButtonComponent;
