import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, TextStyle } from 'react-native';
import { Card, Text, ActivityIndicator, IconButton, Button } from 'react-native-paper';
import RequisicaoComprasService from '../../services/RequisicaoComprasService';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/app/types/types';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import CustomButton from '@/app/components/CustomButton';

type AdminRequisicoesScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'AdminRequisicoesScreen'
>;


const AdminRequisicoesScreen: React.FC = () => {
    const navigation = useNavigation<AdminRequisicoesScreenNavigationProp>();
    const [requisicoes, setRequisicoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = RequisicaoComprasService.listenToAllRequisicoes((updatedRequisicoes) => {
            setRequisicoes(updatedRequisicoes);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const initCotacao = async (requisicaoId: string, colaboradorId: string) => {
        await RequisicaoComprasService.updateRequisicaoStatus(colaboradorId, requisicaoId, 'Cotando');
        navigation.navigate('CotacaoScreen', {
            requisicaoId: requisicaoId,
            colaboradorId: colaboradorId,
        });

    };


    if (loading) {
        return <LoadingIndicator text='Buscando Requisições...' />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Requisições de Compras</Text>

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

                                    <Button
                                        mode="contained"
                                        onPress={() => initCotacao(requisicao.id, requisicao.id_colaborador)

                                        }
                                        disabled={requisicao.status === 'Finalizada'}
                                        style={styles.cotacaoButton}
                                    >
                                        {requisicao.status === 'Finalizada' ? 'Finalizada' : 'Iniciar Cotação'}
                                    </Button>

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
    button: {
        marginVertical: 10,
    },
});

export default AdminRequisicoesScreen;
