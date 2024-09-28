import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

interface ButtonProps {
    title: string;
    onPress: () => void;
    mode?: 'text' | 'outlined' | 'contained';
    loading?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, mode = 'contained', loading = false, disabled = false }) => {
    return (
        <PaperButton
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled}
            contentStyle={{ paddingVertical: 8 }}
        >
            {title}
        </PaperButton>
    );
};

export default Button;
