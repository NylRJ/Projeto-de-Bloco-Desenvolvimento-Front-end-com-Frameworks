import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import FornecedorService from '../../services/fornecedorService';

const CadastrarContatoScreen: React.FC = () => {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const route = useRoute();
    const { fornecedorId } = route.params as { fornecedorId: string };

    const navigation = useNavigation();

    const handleSalvarContato = async () => {
        if (!nome || !telefone || !email) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const contatoData = {
                nome,
                telefone,
                email,
            };
            await FornecedorService.createContatoForFornecedor(fornecedorId, contatoData);
            Alert.alert('Sucesso', 'Contato cadastrado com sucesso!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Erro ao cadastrar o contato.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Nome"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
                mode="outlined"
            />
            <TextInput
                label="Telefone"
                value={telefone}
                onChangeText={setTelefone}
                style={styles.input}
                mode="outlined"
                keyboardType="phone-pad"
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
            />
            <Button
                mode="contained"
                onPress={handleSalvarContato}
                loading={loading}
                disabled={loading}
                style={styles.button}
            >
                Salvar Contato
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
});

export default CadastrarContatoScreen;
