import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Card, DataTable } from 'react-native-paper';
import RequisicaoComprasService from '../services/RequisicaoComprasService';
import CustomButton from '../components/CustomButton';
import { RequisicaoCompras, RootStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import LoadingIndicator from '../components/LoadingIndicator';
import { useAuth } from '@/app/context/AuthContext';

type DetalhesRequisicaoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CotacaoScreen'>;

const DetalhesRequisicaoScreen: React.FC = () => {
    const route = useRoute();
    const { colaboradorId, requisicaoId } = route.params as { colaboradorId: string, requisicaoId: string };
    const [requisicao, setRequisicao] = useState<any>(null);
    const [colaborador, setColaborador] = useState<any>(null);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<DetalhesRequisicaoScreenNavigationProp>();
    const user = useAuth().user;

    useEffect(() => {
        const unsubscribe = RequisicaoComprasService.listenToRequisicao(colaboradorId, requisicaoId, (requisicaoData) => {
            setRequisicao(requisicaoData);
        });

        const fetchData = async () => {
            try {
                const colaboradorData = await RequisicaoComprasService.getColaboradorDetails(colaboradorId);
                const produtosData = await RequisicaoComprasService.getProdutosByRequisicao(colaboradorId, requisicaoId);
                setColaborador(colaboradorData);
                setProdutos(produtosData);
                produtosData.map((p: any) => console.log(p))
            } catch (error) {
                console.error('Erro ao buscar dados da requisição: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => unsubscribe(); // Certifique-se de limpar o listener
    }, [colaboradorId, requisicaoId]);

    const iniciarCotacao = async (requisicaoId: string, colaboradorId: string) => {
        await RequisicaoComprasService.updateRequisicaoStatus(colaboradorId, requisicaoId, 'Cotando');
        navigation.navigate('CotacaoScreen', {
            requisicaoId: requisicaoId,
            colaboradorId: colaboradorId,
        });
    };

    if (loading) {
        return <LoadingIndicator text='Buscando dados...' />;
    }

    if (!requisicao || !colaborador) {
        return (
            <View>
                <Text>Erro ao carregar os dados.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <View>
                        <Text style={styles.title}>Detalhes da Requisição</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Nome do Colaborador:</Text>
                        <Text style={styles.value}>{colaborador.nome}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Motivo:</Text>
                        <Text style={styles.value}>{requisicao.motivo}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={getStatusStyle(requisicao.status)}>{requisicao.status}</Text>
                    </View>
                </Card.Content>
            </Card>

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Produto</DataTable.Title>
                    <DataTable.Title numeric>Quantidade</DataTable.Title>
                    <DataTable.Title numeric>Valor</DataTable.Title>
                </DataTable.Header>

                {produtos.map((produto: any) => (
                    <DataTable.Row key={produto.id}>
                        <DataTable.Cell>{produto.produtoName}</DataTable.Cell>
                        <DataTable.Cell numeric>{produto.quantidade}</DataTable.Cell>
                        <DataTable.Cell numeric>{produto.valor || 'N/A'}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>

            {user?.papel === 'Administrador' && (
                <CustomButton
                    title={requisicao.status === 'Finalizada' ? 'Finalizada' : 'Iniciar Cotação'}
                    onPress={() => iniciarCotacao(requisicaoId, colaboradorId)}
                    icon="shopping"
                    disabled={requisicao.status === 'Finalizada'}

                />
            )}
        </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#555',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
});

export default DetalhesRequisicaoScreen;
