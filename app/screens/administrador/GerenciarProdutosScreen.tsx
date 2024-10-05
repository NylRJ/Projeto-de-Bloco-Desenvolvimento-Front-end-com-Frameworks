import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ProdutoService from '../../services/produtoService';
import { ProdutoBase, RootStackParamList } from '../../types/types';
import CustomButton from '@/app/components/CustomButton';
import ConfirmModal from '@/app/components/ConfirmModal'; // Importe o modal de confirmação

type GerenciarFornecedoresScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GerenciarProdutosScreen'
>;

const GerenciarProdutosScreen: React.FC = () => {
    const navigation = useNavigation<GerenciarFornecedoresScreenNavigationProp>();
    const [produtos, setProdutos] = useState<ProdutoBase[]>([]);
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
    const [produtoIdToDelete, setProdutoIdToDelete] = useState<string | null>(null); // Estado para armazenar o ID do produto a ser excluído

    useEffect(() => {
        const unsubscribe = ProdutoService.listenToProdutos((updatedProdutos: ProdutoBase[]) => {
            setProdutos(updatedProdutos);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async () => {
        if (produtoIdToDelete) {
            try {
                await ProdutoService.deleteProduto(produtoIdToDelete);
                Alert.alert('Sucesso', 'Produto removido com sucesso!');
                setModalVisible(false); // Fechar o modal após a exclusão
            } catch (error) {
                console.error('Erro ao remover produto:', error);
                Alert.alert('Erro', 'Não foi possível remover o produto.');
            }
        }
    };

    const confirmDelete = (id: string) => {
        setProdutoIdToDelete(id); // Definir o ID do produto a ser excluído
        setModalVisible(true); // Exibir o modal
    };

    const renderItem = ({ item }: { item: ProdutoBase }) => (
        <Card style={styles.card}>
            {item.fotoUrl && (
                <Card.Cover
                    source={{ uri: item.fotoUrl }}
                    style={{ height: 150, width: 150, objectFit: 'contain', aspectRatio: 1 }}
                />
            )}
            <Card.Title title={item.nome} subtitle={item.especificacao} />
            <Card.Actions>
                <CustomButton
                    borderRadius={20}
                    backgroundColor="#0e4f66"
                    title="Editar"
                    icon="pencil"
                    onPress={() => navigation.navigate('EditProduto', { id: item.id })}
                />
                <CustomButton
                    borderRadius={20}
                    backgroundColor="#fc0828"
                    title="Excluir"
                    icon="trash-can"
                    onPress={() => confirmDelete(item.id!)} // Chama o modal de confirmação
                />
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                renderItem={renderItem}
                keyExtractor={(item) => (item.id ? item.id : Math.random().toString())} // Usar ID ou um fallback como `Math.random()`
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('AdicionarProdutoScreen')}
            />

            {/* Modal de confirmação de exclusão */}
            <View style={styles.modalContainer}>
                <ConfirmModal
                    visible={modalVisible}
                    onConfirm={handleDelete} // Chama a função de exclusão
                    onCancel={() => setModalVisible(false)} // Fecha o modal
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },

    modalContainer: {
        backgroundColor: 'transparent',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // Certifique-se de que o modal fique centralizado
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -150 }], // Ajuste para centralizar a partir do ponto correto
        width: 300, // Defina uma largura para o modal
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
