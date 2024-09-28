import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import authService from '../../services/authService';

interface SignupFormProps {
    onSignupSuccess: (user: any) => void; // Defina o tipo correto para o usuário
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        try {
            const user = await authService.signup(email, password);
            onSignupSuccess(user);
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            {/* ... (código do componente SignupForm) */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});

export default SignupForm;