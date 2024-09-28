import React, { useState } from 'react';
import { DataTable } from 'react-native-paper';
import { View, Button, StyleSheet } from 'react-native';
import { ProdutoBase } from '../types/types';

interface ProductTableProps {
    produtos: ProdutoBase[];
    onSelectProduct: (produto: ProdutoBase) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ produtos, onSelectProduct }) => {
    const [selectedProducts, setSelectedProducts] = useState<ProdutoBase[]>([]);

    const handleSelectProduct = (produto: ProdutoBase) => {
        const isSelected = selectedProducts.includes(produto);
        if (isSelected) {
            setSelectedProducts(prev => prev.filter(p => p.id !== produto.id));
        } else {
            setSelectedProducts(prev => [...prev, produto]);
        }
        onSelectProduct(produto);
    };

    return (
        <View style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Nome do Produto</DataTable.Title>
                    <DataTable.Title>Categoria</DataTable.Title>
                    <DataTable.Title>Selecionar</DataTable.Title>
                </DataTable.Header>

                {produtos.map(produto => (
                    <DataTable.Row key={produto.id}>
                        <DataTable.Cell>{produto.nome}</DataTable.Cell>
                        <DataTable.Cell>{produto.categoriaId}</DataTable.Cell>
                        <DataTable.Cell>
                            <Button
                                title={selectedProducts.includes(produto) ? 'Selecionado' : 'Selecionar'}
                                onPress={() => handleSelectProduct(produto)}
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
        padding: 20,
    },
});

export default ProductTable;
