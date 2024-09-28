import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { DataTable, TextInput, IconButton, Checkbox, Button } from 'react-native-paper';
import FornecedorService from '../../services/fornecedorService';
import RequisicaoComprasService from '../../services/RequisicaoComprasService';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import { useRoute, useNavigation } from '@react-navigation/native';

const CotacaoScreen: React.FC = () => {

    const route = useRoute();
    const navigation = useNavigation();
    const { colaboradorId, requisicaoId } = route.params as { colaboradorId: string, requisicaoId: string };

    const [produtos, setProdutos] = useState<any[]>([]);
    const [produtosSelecionados, setProdutosSelecionados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const produtosCompletos = await FornecedorService.getProdutosDeFornecedores();
                setProdutos(produtosCompletos);

                // Atualiza o status da requisição para 'Cotando' quando iniciar a tela
                await RequisicaoComprasService.updateRequisicaoStatus(colaboradorId, requisicaoId, 'Cotando');
            } catch (error) {
                console.error('Erro ao buscar produtos: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
    }, [colaboradorId, requisicaoId]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleSort = () => {
        setSortAsc(!sortAsc);
        const sortedProdutos = [...produtos].sort((a, b) =>
            sortAsc ? a.valor - b.valor : b.valor - a.valor
        );
        setProdutos(sortedProdutos);
    };

    const filteredProdutos = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-';
    };

    const handleProdutoSelecionado = (produto: any) => {
        if (produtosSelecionados.includes(produto)) {
            setProdutosSelecionados(produtosSelecionados.filter(p => p !== produto));
        } else {
            if (produtosSelecionados.length < 3) {
                setProdutosSelecionados([...produtosSelecionados, produto]);
            } else {
                Alert.alert('Limite de seleção', 'Você só pode selecionar até 3 produtos.');
            }
        }
    };

    const handleSalvarCotacao = async () => {


        try {

            //produtosSelecionados.map((p) => console.log(p))
            await Promise.all(produtosSelecionados.map(async (produto) => {

                await RequisicaoComprasService.createCotacao(requisicaoId, colaboradorId, {
                    id_produto: produto.id,
                    produtoName: produto.nome,
                    valor: produto.valor,
                    quantidade: produto.quantidade,
                });
            }));


            if (produtosSelecionados.length === 3) {
                console.log("atualizando")
                await RequisicaoComprasService.updateRequisicaoStatus(colaboradorId, requisicaoId, 'Finalizada');
            }

            Alert.alert('Cotação salva com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar cotação: ', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar a cotação.');
        }
    };

    if (loading) {
        return <LoadingIndicator text="Buscando Cotações" />;
    }

    return (
        <View style={styles.container}>
            <TextInput
                label="Buscar produto"
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchInput}
                mode="outlined"
            />

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Produto</DataTable.Title>
                    <DataTable.Title onPress={handleSort}>
                        Preço <IconButton icon={sortAsc ? 'arrow-up' : 'arrow-down'} size={20} />
                    </DataTable.Title>
                    <DataTable.Title>Fornecedor</DataTable.Title>
                    <DataTable.Title>Selecionar</DataTable.Title>
                </DataTable.Header>

                {filteredProdutos.map((produto, index) => (
                    <DataTable.Row key={index}>
                        <DataTable.Cell>{produto.nome}</DataTable.Cell>
                        <DataTable.Cell>{formatCurrency(produto.valor)}</DataTable.Cell>
                        <DataTable.Cell>{produto.fornecedor}</DataTable.Cell>
                        <DataTable.Cell>
                            <Checkbox
                                status={produtosSelecionados.includes(produto) ? 'checked' : 'unchecked'}
                                onPress={() => handleProdutoSelecionado(produto)}
                            />
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>

            <Button
                mode="contained"
                onPress={handleSalvarCotacao}
                disabled={produtosSelecionados.length === 0}
                style={styles.saveButton}
            >
                Salvar Cotação
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    searchInput: {
        marginBottom: 20,
    },
    saveButton: {
        marginTop: 20,
    },
});

export default CotacaoScreen;
