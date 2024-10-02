import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colaboradorService from '../../services/administradorService';
import CustomButton from '@/app/components/CustomButton';

const CreateAdministradorScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const navigation = useNavigation();

    const handleCreateColaborador = async () => {
        if (!email || !senha || !nome) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        try {
            await colaboradorService.criarColaborador(email, senha, nome);
            Alert.alert('Sucesso', 'Colaborador criado com sucesso!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Erro ao criar o colaborador.');
            console.error('Erro ao criar colaborador:', error);
        }
    };


    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />
            <TextInput
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                style={styles.input}
            />
            <CustomButton
                title="Criar Colaborador"
                onPress={handleCreateColaborador}
                icon="plus"
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
});

export default CreateAdministradorScreen;
