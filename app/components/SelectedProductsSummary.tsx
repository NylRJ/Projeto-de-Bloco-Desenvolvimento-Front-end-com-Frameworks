import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ProdutoBase } from '../types/types';

interface SelectedProductsSummaryProps {
    selectedProducts: ProdutoBase[];
    onFinalizeSelection: () => void;
}

const SelectedProductsSummary: React.FC<SelectedProductsSummaryProps> = ({ selectedProducts, onFinalizeSelection }) => {
    return (
        <View style={styles.container}>
            <Text>Produtos Selecionados:</Text>
            {selectedProducts.map(produto => (
                <Text key={produto.id}>
                    {produto.nome} - Categoria: {produto.categoriaId}
                </Text>
            ))}
            <Button title="Finalizar Seleção" onPress={onFinalizeSelection} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 20,
    },
});

export default SelectedProductsSummary;
