import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import LoadingIndicator from '../../components/LoadingIndicator';

const PasswordRecoveryScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordRecovery = async () => {
        if (!email) {
            Alert.alert('Erro', 'Por favor, insira seu e-mail.');
            return;
        }

        try {
            setIsLoading(true);
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Sucesso', 'Link de recuperação de senha enviado para seu e-mail.');
        } catch (error) {
            console.error('Erro ao enviar o e-mail de recuperação de senha:', error);
            Alert.alert('Erro', 'Não foi possível enviar o e-mail de recuperação de senha.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingIndicator text="Enviando link de recuperação..." />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Senha</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                mode="outlined"
            />
            <Button
                mode="contained"
                onPress={handlePasswordRecovery}
                style={styles.button}
            >
                Enviar Link de Recuperação
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});

export default PasswordRecoveryScreen;
