import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Card, Button, Appbar, FAB, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import FornecedorService from '../../services/fornecedorService';
import { Fornecedor } from '../../types/types';

type GerenciarFornecedoresScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GerenciarFornecedoresScreen'
>;

const GerenciarFornecedoresScreen: React.FC = () => {
    const navigation = useNavigation<GerenciarFornecedoresScreenNavigationProp>();
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

    useEffect(() => {
        const unsubscribe = FornecedorService.listenToFornecedores((updatedFornecedores: Fornecedor[]) => {
            setFornecedores(updatedFornecedores);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await FornecedorService.deleteFornecedor(id);
            setFornecedores(fornecedores.filter(fornecedor => fornecedor.id !== id));
            Alert.alert('Sucesso', 'Fornecedor removido com sucesso!');
        } catch (error) {
            console.error('Erro ao remover fornecedor:', error);
            Alert.alert('Erro', 'Não foi possível remover o fornecedor.');
        }
    };

    const renderItem = ({ item }: { item: Fornecedor }) => (
        <Card style={styles.card}>
            <Card.Title title={item.nome} subtitle={item.email} />
            <Card.Actions>
                <IconButton
                    icon="pencil"
                    onPress={() => navigation.navigate('EditFornecedor', { id: item.id! })}
                    style={styles.editButton}
                />
                <Button
                    onPress={() => handleDelete(item.id!)}
                    color="red"
                    style={styles.actionButton}
                >
                    Excluir
                </Button>
                <Button
                    onPress={() => navigation.navigate('AssociateProdutoScreen', { fornecedorId: item.id! })}
                    style={styles.actionButton}
                >
                    Associar Produto
                </Button>
            </Card.Actions>
        </Card>
    );

    const handleAddFornecedor = () => {
        navigation.navigate('AddFornecedor');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={fornecedores}
                renderItem={renderItem}
                keyExtractor={(item) => item.id ? item.id : Math.random().toString()}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={handleAddFornecedor}
                label="Adicionar Fornecedor"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        elevation: 3,
    },
    editButton: {
        backgroundColor: '#007bff',
        marginRight: 8,
    },
    actionButton: {
        marginRight: 8,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#005780',
    },
});

export default GerenciarFornecedoresScreen;
