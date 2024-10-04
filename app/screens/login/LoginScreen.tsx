import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/types';
import LoadingIndicator from '../../components/LoadingIndicator';
import CustomButton from '../../components/CustomButton';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const { login } = useAuth();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            await login(email, password);
            Alert.alert('Sucesso', 'Login realizado com sucesso!');
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            Alert.alert('Erro', 'Não foi possível realizar o login. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupNavigation = () => {
        navigation.navigate('Signup');
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <LoadingIndicator text="Verificando Credenciais" />
            ) : (
                <ScrollView>
                    <Image source={require('../../images/logo.png')} style={styles.logo} />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        mode="outlined"
                    />
                    <CustomButton
                        title="Login"
                        onPress={handleLogin}
                        icon="login"
                        style={styles.button}
                    />
                    <TouchableOpacity onPress={handleSignupNavigation}>
                        <Text style={styles.signupText}>Ainda não tem uma conta? Crie a sua!</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: width * 0.05,
        backgroundColor: '#fff',
    },
    logo: {
        width: width * 0.5,
        height: height * 0.2,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: height * 0.05,
    },
    input: {
        marginBottom: 16,
        color: '#000000',
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
    },
    signupText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#005780',
    },
});

export default LoginScreen;