import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import authService from '../../services/authService';

interface LoginFormProps {
    onLoginSuccess: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            const user = await authService.login(email, password);
            onLoginSuccess(user);
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            {/* ... (restante do código do componente LoginForm) */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});

export default LoginForm;