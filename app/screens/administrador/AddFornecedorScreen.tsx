import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FornecedorService from '../../services/fornecedorService';
import { Fornecedor } from '../../types/types';
import LoadingIndicator from '../../components/LoadingIndicator';

const AddFornecedorScreen: React.FC = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const [fornecedor, setFornecedor] = useState<Fornecedor>({
        id: '',
        nome: '',
        cnpj_cpf: '',
        endereco: '',
        email: '',
        status: 'Ativo',
        tipo: '',
    });
    const handleSave = async () => {
        if (!fornecedor.nome || !fornecedor.cnpj_cpf) {
            Alert.alert('Erro', 'Nome e CNPJ/CPF são obrigatórios.');
            return;
        }

        try {
            setIsLoading(true);
            await FornecedorService.addFornecedor(fornecedor);
            Alert.alert('Sucesso', 'Fornecedor adicionado com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao adicionar fornecedor:', error);
            Alert.alert('Erro', 'Não foi possível adicionar o fornecedor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? <LoadingIndicator text="Adicionando fornecedor..." /> : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Fornecedor"
                        value={fornecedor.nome}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, nome: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="CNPJ/CPF"
                        value={fornecedor.cnpj_cpf}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, cnpj_cpf: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Endereço"
                        value={fornecedor.endereco}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, endereco: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={fornecedor.email}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, email: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Tipo (Fisico ou Juridico)"
                        value={fornecedor.tipo}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, tipo: text })}
                    />
                    <Button title="Salvar" onPress={handleSave} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default AddFornecedorScreen;
