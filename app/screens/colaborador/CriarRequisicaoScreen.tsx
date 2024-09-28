import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Button, Alert } from 'react-native';
import { DataTable, Checkbox, Text } from 'react-native-paper';
import ProdutoService from '../../services/produtoService';
import RequisicaoService from '../../services/RequisicaoComprasService';
import { auth } from '../../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '@/app/components/CustomButton';

const CriarRequisicaoScreen: React.FC = () => {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [filteredProdutos, setFilteredProdutos] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [quantidade, setQuantidade] = useState<string>('');
    const [motivo, setMotivo] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchProdutos = async () => {
            const fetchedProdutos = await ProdutoService.getProdutos();
            setProdutos(fetchedProdutos);
            setFilteredProdutos(fetchedProdutos);
        };
        fetchProdutos();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProdutos(filtered);
    };

    const handleSelectProduct = (produtoId: string) => {
        if (selectedProduct === produtoId) {
            setSelectedProduct(null);
        } else {
            setSelectedProduct(produtoId);
        }
    };

    const handleConfirmSelection = async () => {
        if (!selectedProduct) {
            Alert.alert('Erro', 'Nenhum produto selecionado.');
            return;
        }

        if (!quantidade || !motivo) {
            Alert.alert('Erro', 'Por favor, adicione uma quantidade e um motivo.');
            return;
        }

        try {
            const colaboradorId = auth.currentUser?.uid;
            if (!colaboradorId) {
                throw new Error('Colaborador não autenticado.');
            }


            const produto = produtos.find((p: any) => p.id === selectedProduct);

            await RequisicaoService.createRequisicao({
                id_colaborador: colaboradorId,
                produtoId: produto.id,
                produtoNome: produto.nome,
                quantidade: parseInt(quantidade),
                motivo,
                status: 'Aberta',
                data: new Date(),
            });

            Alert.alert('Sucesso', 'Requisição criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao criar a requisição:', error);
            Alert.alert('Erro', 'Erro ao criar a requisição.');
        }
    };

    return (
        <ScrollView>
            <TextInput
                placeholder="Quantidade"
                value={quantidade}
                onChangeText={setQuantidade}
                keyboardType="numeric"
                style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
            />
            <TextInput
                placeholder="Motivo"
                value={motivo}
                onChangeText={setMotivo}
                style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
            />

            <TextInput
                placeholder="Pesquisar Produto"
                value={searchQuery}
                onChangeText={handleSearch}
                style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
            />

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Selecionar</DataTable.Title>
                    <DataTable.Title>Nome do Produto</DataTable.Title>
                    <DataTable.Title>Descrição</DataTable.Title>
                </DataTable.Header>

                {filteredProdutos.map(produto => (
                    <DataTable.Row key={produto.id}>
                        <DataTable.Cell>
                            <Checkbox
                                status={selectedProduct === produto.id ? 'checked' : 'unchecked'}
                                onPress={() => handleSelectProduct(produto.id)}
                            />
                        </DataTable.Cell>
                        <DataTable.Cell>{produto.nome}</DataTable.Cell>
                        <DataTable.Cell>{produto.descricao}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
            <CustomButton
                title="Iniciar requisição"
                onPress={handleConfirmSelection}
                icon="cart"
            />

        </ScrollView>
    );
};

export default CriarRequisicaoScreen;
