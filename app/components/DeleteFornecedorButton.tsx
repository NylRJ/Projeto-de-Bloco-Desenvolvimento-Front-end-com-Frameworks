import React from 'react';
import { Alert } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

import { MaterialIcons } from '@expo/vector-icons';
import FornecedorService from '../services/fornecedorService';

interface DeleteFornecedorButtonProps {
    fornecedorId: string;
    onDelete: () => void;
}

const DeleteFornecedorButton: React.FC<DeleteFornecedorButtonProps> = ({ fornecedorId, onDelete }) => {
    const handleDelete = async () => {
        try {
            await FornecedorService.deleteFornecedor(fornecedorId);
            Alert.alert('Sucesso', 'Fornecedor deletado com sucesso!');
            onDelete();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível deletar o fornecedor.');
            console.error('Erro ao deletar fornecedor:', error);
        }
    };

    return (
        <Button buttonColor='red' icon="delete" mode="contained" onPress={handleDelete}>
            Excluir
        </Button>

    );
};

export default DeleteFornecedorButton;
