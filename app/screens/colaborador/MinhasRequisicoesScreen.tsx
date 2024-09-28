import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, TextStyle, Platform } from 'react-native';
import { Card, Text, ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db, auth } from '../../services/firebaseConfig';
import { useAuth } from '@/app/context/AuthContext';
import RequisicaoComprasService from '../../services/RequisicaoComprasService';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import ConfirmModal from '@/app/components/ConfirmModal';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/types/types';
import { useNavigation } from '@react-navigation/native';


type MinhasRequisicoesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MinhasRequisicoesScreen'>;
const MinhasRequisicoesScreen: React.FC = () => {
    const userContext = useAuth().user
    const [requisicoes, setRequisicoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<MinhasRequisicoesScreenNavigationProp>();



    const [modalVisible, setModalVisible] = useState(false);
    const [requisicaoIdToDelete, setRequisicaoIdToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequisicoes = async () => {
            const colaboradorId = auth.currentUser?.uid;
            if (!colaboradorId) return;

            // Usa await para resolver a PromIse
            const unsubscribe = await RequisicaoComprasService.listenToRequisicoesByColaborador(colaboradorId, (updatedRequisicoes) => {
                setRequisicoes(updatedRequisicoes);
                setLoading(false);
            });


            return () => unsubscribe();
        };

        fetchRequisicoes();
    }, []);

    const handleDelete = async () => {
        if (requisicaoIdToDelete) {
            try {
                const colaboradorId = auth.currentUser?.uid;
                if (!colaboradorId) {
                    Alert.alert('Erro', 'Usuário não autenticado.');
                    return;
                }


                await RequisicaoComprasService.deleteRequisicao(colaboradorId, requisicaoIdToDelete);
                Alert.alert('Sucesso', 'Requisição excluída com sucesso.');
            } catch (error) {
                console.error('Erro ao excluir a requisição:', error);
                Alert.alert('Erro', 'Erro ao excluir a requisição.');
            }
        }

        setModalVisible(false);
    };

    const deletarRequisicao = (requisicaoId: string) => {
        setRequisicaoIdToDelete(requisicaoId);
        setModalVisible(true);
    };

    if (loading) {
        return <LoadingIndicator text='Lendo requisições....' />;
    }


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Minhas Requisições de Compras</Text>

            {requisicoes.length === 0 ? (
                <Text style={styles.noDataText}>Nenhuma requisição encontrada.</Text>
            ) : (
                requisicoes.map((requisicao) => (
                    <Card key={requisicao.id} style={styles.card}>
                        <Card.Title
                            title={requisicao.produtoNome}
                            subtitle={`Data: ${new Date(requisicao.data.seconds * 1000).toLocaleDateString()}`}
                            right={(props) => (
                                <>
                                    <IconButton
                                        {...props}
                                        icon={requisicao.status === 'Finalizada' ? 'check-circle' : 'progress-clock'}
                                        iconColor={getStatusColor(requisicao.status)}
                                    />
                                    <IconButton
                                        {...props}
                                        icon="delete"
                                        iconColor="red"
                                        onPress={() => deletarRequisicao(requisicao.id)}
                                    />
                                    <Button

                                        mode="contained"
                                        onPress={() => navigation.navigate('DetalhesRequisicaoScreen', {
                                            colaboradorId: requisicao.id_colaborador,
                                            requisicaoId: requisicao.id
                                        })}


                                        style={styles.cotacaoButton}
                                    >
                                        Detalhes
                                    </Button>
                                </>
                            )}
                        />
                        <Card.Content>
                            <Text style={styles.label}>Motivo:</Text>
                            <Text>{requisicao.motivo || 'Nenhum'}</Text>

                            <Text style={styles.label}>Quantidade:</Text>
                            <Text>{requisicao.quantidade}</Text>

                            <Text style={styles.label}>Status:</Text>
                            <Text style={getStatusStyle(requisicao.status)}>{requisicao.status}</Text>
                        </Card.Content>
                    </Card>
                ))
            )}
            <ConfirmModal
                visible={modalVisible}
                onConfirm={handleDelete}
                onCancel={() => setModalVisible(false)}
            />
        </ScrollView>
    );
};

const getStatusStyle = (status: string): TextStyle => {
    switch (status) {
        case 'Aberta':
            return { color: 'blue', fontWeight: '700' };
        case 'Cotando':
            return { color: 'orange', fontWeight: '700' };
        case 'Finalizada':
            return { color: 'green', fontWeight: '700' };
        default:
            return { color: 'black', fontWeight: '400' };
    }
};

const getStatusColor = (status: string): string => {
    switch (status) {
        case 'Aberta':
            return 'blue';
        case 'Cotando':
            return 'orange';
        case 'Finalizada':
            return 'green';
        default:
            return 'black';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    card: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    label: {
        fontWeight: '600',
        marginTop: 5,
    },
    cotacaoButton: {
        margin: 10,
        marginLeft: 20,

        backgroundColor: '#005780',

    },
});

export default MinhasRequisicoesScreen;