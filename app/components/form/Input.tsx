import React from 'react';
import { TextInput as PaperInput } from 'react-native-paper';

interface InputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    disabled?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const Input: React.FC<InputProps> = ({ label, value, onChangeText, placeholder, secureTextEntry = false, disabled = false, keyboardType = 'default' }) => {
    return (
        <PaperInput
            label={label}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            disabled={disabled}
            keyboardType={keyboardType}
            mode="outlined"
            style={{ marginBottom: 16 }}
        />
    );
};

export default Input;
