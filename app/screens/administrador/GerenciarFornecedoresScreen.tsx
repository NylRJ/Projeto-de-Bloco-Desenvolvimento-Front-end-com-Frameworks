import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, useWindowDimensions } from 'react-native';
import { Card, Button, FAB } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import FornecedorService from '../../services/fornecedorService';
import { Fornecedor } from '../../types/types';
import CustomButton from '@/app/components/CustomButton';

type GerenciarFornecedoresScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GerenciarFornecedoresScreen'
>;

const GerenciarFornecedoresScreen: React.FC = () => {
    const navigation = useNavigation<GerenciarFornecedoresScreenNavigationProp>();
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

    // Usa useWindowDimensions para obter as dimensões da janela
    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Define como mobile para telas menores que 768px

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
        <Card style={isMobile ? styles.mobileCard : styles.webCard}>
            <Card.Title title={item.nome} subtitle={item.email} />
            <Card.Actions style={isMobile ? styles.mobileActions : styles.webActions}>
                <CustomButton
                    borderRadius={20}
                    backgroundColor='#0e4f66'
                    title='Produto'
                    icon='plus-circle-outline'
                    onPress={() => navigation.navigate('AssociateProdutoScreen', { fornecedorId: item.id! })}
                />

                <CustomButton
                    borderRadius={20}
                    backgroundColor='#0e4f66'
                    title='Editar'
                    icon='pencil'
                    onPress={() => navigation.navigate('EditFornecedor', { id: item.id! })}
                />
                <CustomButton
                    borderRadius={20}
                    backgroundColor='#fc0828'
                    title='Excluir'
                    icon='trash-can'
                    onPress={() => handleDelete(item.id!)}
                />
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
                style={isMobile ? styles.mobileFab : styles.webFab}
                icon="plus"
                onPress={handleAddFornecedor}
                label={isMobile ? "" : "Fornecedor"} // O FAB só terá rótulo no web

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
    mobileCard: {
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        elevation: 3,
        paddingHorizontal: 10,
    },
    webCard: {
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        elevation: 3,
        paddingHorizontal: 20, // Mais espaçamento no web
    },
    mobileActions: {
        flexDirection: 'column', // Botões empilhados no mobile
        alignItems: 'stretch',
        marginVertical: 10,
    },
    webActions: {
        flexDirection: 'row', // Botões lado a lado no web
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    mobileFab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#005780',
    },
    webFab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        backgroundColor: '#005780',
    },
});

export default GerenciarFornecedoresScreen;
