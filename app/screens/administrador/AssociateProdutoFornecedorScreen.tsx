import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import ProdutoService from '../../services/produtoService';
import CategoriaService from '../../services/categoriaService';
import { ProdutoBase, ProdutoFornecedor } from '../../types/types';
import { useRoute } from '@react-navigation/native';

const AssociateProdutoFornecedorScreen = () => {
    const route = useRoute();
    const { fornecedorId } = route.params as { fornecedorId: string };
    const [produtos, setProdutos] = useState<ProdutoBase[]>([]);
    const [filteredProdutos, setFilteredProdutos] = useState<ProdutoBase[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [quantity, setQuantity] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        const fetchProdutos = async () => {
            const allProdutos = await ProdutoService.getProdutos();
            const produtosComCategorias = await Promise.all(
                allProdutos.map(async (produto) => {
                    const categoriaNome = await CategoriaService.getCategoriaNome(produto.categoriaId);
                    return {
                        ...produto,
                        categoriaNome, // Adiciona o nome da categoria ao produto
                    };
                })
            );
            setProdutos(produtosComCategorias);
            setFilteredProdutos(produtosComCategorias);
        };
        fetchProdutos();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            const filtered = produtos.filter(produto =>
                produto.nome.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProdutos(filtered);
        } else {
            setFilteredProdutos(produtos);
        }
    };

    const handleAssociate = async (produtoId: string) => {
        try {
            const produtoFornecedor: ProdutoFornecedor = {
                id: produtoId,
                quantidade: parseInt(quantity),
                valor: parseFloat(value),
            };

            await ProdutoService.associarProdutoFornecedor(fornecedorId, produtoFornecedor);
            alert('Produto associado com sucesso!');
            setQuantity('')
            setValue('')

        } catch (error) {
            alert('Erro ao associar produto.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Pesquisar produto"
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <TextInput
                style={styles.input}
                placeholder="Quantidade"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Valor"
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
            />

            <DataTable>
                <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title>Nome do Produto</DataTable.Title>
                    <DataTable.Title>Categoria</DataTable.Title>
                    <DataTable.Title>Ação</DataTable.Title>
                </DataTable.Header>

                {filteredProdutos.map((produto) => (
                    <DataTable.Row key={produto.id} style={styles.tableRow}>
                        <DataTable.Cell>{produto.nome}</DataTable.Cell>
                        <DataTable.Cell>{produto.categoriaNome}</DataTable.Cell>
                        <DataTable.Cell>
                            <Button
                                title="Associar"
                                onPress={() => handleAssociate(produto.id)}
                                color="#007bff"
                            />
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
    },
    tableRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default AssociateProdutoFornecedorScreen;
