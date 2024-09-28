import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    writeBatch,
    onSnapshot
} from 'firebase/firestore';
import { db } from './firebaseConfig';

class RequisicaoComprasService {



    async createRequisicao(requisicaoData: {
        id_colaborador: string;
        produtoId: string;
        produtoNome: string;
        quantidade: number;
        motivo: string;
        status: string;
        data: Date;
    }): Promise<void> {
        try {
            const requisicaoRef = collection(db, `usuarios/${requisicaoData.id_colaborador}/requisicoes_compras`);
            await addDoc(requisicaoRef, {
                id_colaborador: requisicaoData.id_colaborador,
                produtoId: requisicaoData.produtoId,
                produtoNome: requisicaoData.produtoNome,
                quantidade: requisicaoData.quantidade,
                motivo: requisicaoData.motivo,
                status: requisicaoData.status,
                data: requisicaoData.data,
            });
        } catch (error) {
            console.error('Erro ao criar a requisição:', error);
            throw error;
        }
    }

    /* listenToAllRequisicoes(callback: (requisicoes: any[]) => void) {
         const usuariosRef = collection(db, 'usuarios');
         const todasRequisicoes: any[] = [];
 
         const unsubscribe = onSnapshot(usuariosRef, async (usuariosSnapshot) => {
             todasRequisicoes.length = 0;
 
             for (const usuarioDoc of usuariosSnapshot.docs) {
                 const requisicoesSnapshot = await getDocs(collection(db, `usuarios/${usuarioDoc.id}/requisicoes_compras`));
 
                 requisicoesSnapshot.forEach((requisicaoDoc) => {
                     todasRequisicoes.push({
                         id: requisicaoDoc.id,
                         usuarioId: usuarioDoc.id,
                         usuarioNome: usuarioDoc.data().nome,
                         ...requisicaoDoc.data(),
                     });
                 });
             }
             callback(todasRequisicoes);
         });
 
         return unsubscribe;
     }*/

    listenToAllRequisicoes(callback: (requisicoes: any[]) => void) {
        const usuariosRef = collection(db, 'usuarios');
        const todasRequisicoes: any[] = [];

        const unsubscribe = onSnapshot(usuariosRef, (usuariosSnapshot) => {
            todasRequisicoes.length = 0; // Limpa o array para evitar duplicações

            // Para cada usuário, escuta as alterações na subcoleção requisicoes_compras
            usuariosSnapshot.docs.forEach((usuarioDoc) => {
                const requisicoesRef = collection(db, `usuarios/${usuarioDoc.id}/requisicoes_compras`);

                // Adiciona um listener para cada subcoleção de requisicoes_compras
                onSnapshot(requisicoesRef, (requisicoesSnapshot) => {
                    requisicoesSnapshot.forEach((requisicaoDoc) => {
                        todasRequisicoes.push({
                            id: requisicaoDoc.id,
                            usuarioId: usuarioDoc.id,
                            usuarioNome: usuarioDoc.data().nome,
                            ...requisicaoDoc.data(),
                        });
                    });

                    // Chama o callback com as requisições atualizadas
                    callback(todasRequisicoes);
                });
            });
        });

        return unsubscribe;
    }






    async listenToRequisicoesByColaborador(colaboradorId: string | undefined, callback: (requisicoes: any[]) => void) {
        const requisicoesRef = collection(db, `usuarios/${colaboradorId}/requisicoes_compras`);
        const unsubscribe = onSnapshot(requisicoesRef, (snapshot) => {
            const requisicoes: any[] = [];
            snapshot.forEach((doc) => requisicoes.push({ id: doc.id, ...doc.data() }));
            callback(requisicoes);
        });
        return unsubscribe;
    }


    async updateRequisicaoStatus(colaboradorId: string, requisicaoId: string, novoStatus: string) {
        const requisicaoRef = doc(db, `usuarios/${colaboradorId}/requisicoes_compras`, requisicaoId);
        try {
            await updateDoc(requisicaoRef, { status: novoStatus });
            console.log(`Status da requisição ${requisicaoId} atualizado para: ${novoStatus}`);
        } catch (error) {
            console.error('Erro ao atualizar o status da requisição:', error);
            throw error;
        }
    }


    async getRequisicaoById(colaboradorId: string, requisicaoId: string) {
        const requisicaoRef = doc(db, `usuarios/${colaboradorId}/requisicoes_compras`, requisicaoId);
        try {
            const requisicaoDoc = await getDoc(requisicaoRef);
            if (requisicaoDoc.exists()) {
                return { id: requisicaoDoc.id, ...requisicaoDoc.data() };
            } else {
                console.log('Requisição não encontrada:', requisicaoId);
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar a requisição:', error);
            throw error;
        }
    }


    async deleteRequisicao(colaboradorId: string, requisicaoId: string): Promise<void> {
        try {
            const requisicaoRef = doc(db, `usuarios/${colaboradorId}/requisicoes_compras`, requisicaoId);
            const cotacoesRef = collection(requisicaoRef, 'cotacoes');
            const cotacoesSnapshot = await getDocs(cotacoesRef);

            const batch = writeBatch(db);
            cotacoesSnapshot.forEach((cotacaoDoc) => {
                batch.delete(cotacaoDoc.ref);
            });

            await batch.commit();
            await deleteDoc(requisicaoRef);
            console.log('Requisição e suas cotações foram excluídas com sucesso.');
        } catch (error) {
            console.error('Erro ao deletar a requisição:', error);
            throw error;
        }
    }


    async getRequisicoesByColaborador(colaboradorId: string) {
        const q = query(collection(db, `usuarios/${colaboradorId}/requisicoes_compras`));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }



    async getRequisicaoDetails(usuarioId: string, requisicaoId: string) {
        try {
            const requisicaoDoc = await getDoc(doc(db, `usuarios/${usuarioId}/requisicoes_compras`, requisicaoId));
            if (requisicaoDoc.exists()) {
                return requisicaoDoc.data();
            } else {
                console.log('Requisição não encontrada.');
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes da requisição: ', error);
            throw error;
        }
    }


    async getColaboradorDetails(usuarioId: string) {
        try {
            const usuarioDoc = await getDoc(doc(db, 'usuarios', usuarioId));
            return usuarioDoc.data();
        } catch (error) {
            console.error('Erro ao buscar detalhes do usuário: ', error);
            throw error;
        }
    }


    async getFornecedoresByProdutoId(produtoId: string) {
        const fornecedoresSnapshot = await getDocs(collection(db, 'fornecedores'));
        const fornecedoresComProduto: any[] = [];

        fornecedoresSnapshot.forEach(async (fornecedorDoc) => {
            const produtosSnapshot = await getDocs(collection(db, `fornecedores/${fornecedorDoc.id}/produtos`));
            produtosSnapshot.forEach((produtoDoc) => {
                if (produtoDoc.data().id_produto === produtoId) {
                    fornecedoresComProduto.push({
                        fornecedorId: fornecedorDoc.id,
                        fornecedorNome: fornecedorDoc.data().nome,
                        produtoInfo: produtoDoc.data(),
                    });
                }
            });
        });

        return fornecedoresComProduto;
    }


    async finalizarCotacao(requisicaoId: string, produtosSelecionados: any[]) {
        try {
            const requisicaoRef = doc(db, `requisicoes_compras`, requisicaoId);
            await updateDoc(requisicaoRef, {
                status: 'Finalizada',
                produtosCotados: produtosSelecionados.map(produto => ({
                    produtoId: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    fornecedorNome: produto.fornecedorNome,
                })),
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Erro ao finalizar a cotação: ' + error.message);
            } else {
                throw new Error('Erro desconhecido ao finalizar a cotação');
            }
        }
    }


    async createCotacao(requisicaoId: string, fornecedorId: string, produtoInfo: any) {



        const cotacaoRef = collection(db, `usuarios/${fornecedorId}/requisicoes_compras/${requisicaoId}/cotacoes`);
        await addDoc(cotacaoRef, {
            fornecedorId,
            produtoId: produtoInfo.id_produto,
            produtoName: produtoInfo.produtoName,
            valor: produtoInfo.valor,
            quantidade: produtoInfo.quantidade,
        });
    }


    async getProdutosByRequisicao(colaboradorId: string, requisicaoId: string) {
        try {
            const cotacoesRef = collection(db, `usuarios/${colaboradorId}/requisicoes_compras/${requisicaoId}/cotacoes`);
            const cotacoesSnapshot = await getDocs(cotacoesRef);
            const produtosCotados = cotacoesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return produtosCotados;
        } catch (error) {
            console.error('Erro ao buscar os produtos da requisição:', error);
            throw new Error('Erro ao buscar os produtos da requisição');
        }
    }
}

export default new RequisicaoComprasService();
