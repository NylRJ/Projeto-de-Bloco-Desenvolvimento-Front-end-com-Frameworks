import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Card, Button, FAB } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ProdutoService from '../../services/produtoService';
import { ProdutoBase } from '../../types/types';
import { RootStackParamList } from '../../types/types';
import { onSnapshot } from 'firebase/firestore';
import CustomButton from '@/app/components/CustomButton';


type GerenciarFornecedoresScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GerenciarProdutosScreen'
>;

const GerenciarProdutosScreen: React.FC = () => {
    const navigation = useNavigation<GerenciarFornecedoresScreenNavigationProp>();
    const [produtos, setProdutos] = useState<ProdutoBase[]>([]);

    useEffect(() => {

        const unsubscribe = ProdutoService.listenToProdutos((updatedProdutos: ProdutoBase[]) => {
            setProdutos(updatedProdutos);
        });


        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            if (id) {
                await ProdutoService.deleteProduto(id);
                Alert.alert('Sucesso', 'Produto removido com sucesso!');
            } else {
                console.error('ID do produto não encontrado');
                Alert.alert('Erro', 'ID do produto não foi encontrado.');
            }
        } catch (error) {
            console.error('Erro ao remover produto:', error);
            Alert.alert('Erro', 'Não foi possível remover o produto.');
        }
    };


    const renderItem = ({ item }: { item: ProdutoBase }) => (
        <Card style={styles.card}>

            {item.fotoUrl && (
                <Card.Cover
                    source={{ uri: item.fotoUrl }}
                    style={{ height: 150, width: 150, objectFit: 'contain', aspectRatio: 1 }} />
            )}
            <Card.Title title={item.nome} subtitle={item.especificacao} />
            <Card.Actions>

                <CustomButton
                    borderRadius={20}
                    backgroundColor='#0e4f66'
                    title='Editar'
                    icon='pencil'
                    onPress={() => navigation.navigate('EditProduto', { id: item.id })}
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

    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id ? item.id : Math.random().toString()} // Usar ID ou um fallback como `Math.random()`
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('AdicionarProdutoScreen')}
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
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#005780',
    },
});

export default GerenciarProdutosScreen;
