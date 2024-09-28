import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import FornecedorService from '../../services/fornecedorService';
import { Fornecedor } from '../../types/types';
import LoadingIndicator from '../../components/LoadingIndicator';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import CustomButton from '../../components/CustomButton';

const EditFornecedorScreen: React.FC = () => {
    const route = useRoute();
    const { id } = route.params as { id: string };
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const [fornecedor, setFornecedor] = useState<Partial<Fornecedor>>({
        id: '',
        nome: '',
        cnpj_cpf: '',
        endereco: '',
        email: '',
        status: '',
        tipo: '',
    });

    useEffect(() => {
        const fornecedorRef = doc(db, 'fornecedores', id);
        const unsubscribe = onSnapshot(fornecedorRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const fornecedorData = docSnapshot.data() as Fornecedor;

                setFornecedor({
                    id: fornecedorData.id || '',
                    nome: fornecedorData.nome || '',
                    cnpj_cpf: fornecedorData.cnpj_cpf || '',
                    endereco: fornecedorData.endereco || '',
                    email: fornecedorData.email || '',
                    status: fornecedorData.status || '',
                    tipo: fornecedorData.tipo || '',
                });
            } else {
                Alert.alert('Erro', 'Fornecedor não encontrado.');
            }
        }, (error) => {
            console.error('Erro ao carregar fornecedor:', error);
            Alert.alert('Erro', 'Não foi possível carregar o fornecedor.');
        });

        return () => unsubscribe();
    }, [id]);

    const handleSave = async () => {
        if (!fornecedor.nome) {
            Alert.alert('Erro', 'O nome do fornecedor é obrigatório.');
            return;
        }

        try {
            setIsLoading(true);

            await FornecedorService.updateFornecedor(id, fornecedor);
            Alert.alert('Sucesso', 'Fornecedor atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar fornecedor:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o fornecedor.');
        } finally {
            setIsLoading(false);
            navigation.goBack();
        }
    };

    return (
        <View style={{ padding: 20 }}>
            {isLoading ? <LoadingIndicator text='Carregando fornecedor...' /> : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Fornecedor"
                        value={fornecedor.nome || ''}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, nome: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="CNPJ/CPF"
                        value={fornecedor.cnpj_cpf || ''}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, cnpj_cpf: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Endereço"
                        value={fornecedor.endereco || ''}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, endereco: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={fornecedor.email || ''}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, email: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Status (Ativo/Inativo)"
                        value={fornecedor.status || ''}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, status: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Tipo (Física/Jurídica)"
                        value={fornecedor.tipo || ''}
                        onChangeText={(text) => setFornecedor({ ...fornecedor, tipo: text })}
                    />

                    <CustomButton title="Salvar" onPress={handleSave} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default EditFornecedorScreen;
