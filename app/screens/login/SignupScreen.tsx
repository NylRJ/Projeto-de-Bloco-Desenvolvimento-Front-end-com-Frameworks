import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image, Dimensions, ScrollView } from 'react-native';
import { Text, TextInput, Appbar } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/types';
import CustomButton from '../../components/CustomButton';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
    const { signup } = useAuth();
    const navigation = useNavigation<SignupScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Colaborador');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        try {
            await signup(email, password, name, role);
            Alert.alert('Sucesso', 'Conta criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            Alert.alert('Erro', 'Não foi possível criar a conta. Verifique suas informações.');
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Criar Conta" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Image source={require('../../images/logo.png')} style={styles.logo} />
                    <TextInput
                        label="Nome"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        mode="outlined"
                    />
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
                    <TextInput
                        label="Confirme sua Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        style={styles.input}
                        mode="outlined"
                    />

                    <CustomButton
                        title="Criar Conta"
                        onPress={handleSignup}
                        icon="account-plus"
                        style={{ marginTop: 16, paddingVertical: 8 }}
                    />
                </View>
            </ScrollView>
        </>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
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
});

export default SignupScreen;
