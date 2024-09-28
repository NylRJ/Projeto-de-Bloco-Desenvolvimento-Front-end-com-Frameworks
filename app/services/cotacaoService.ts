import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Cotacao, Fornecedor } from '../types/types';

class CotacaoService {
    private collectionRef = collection(db, 'cotacoes');

    async createCotacao(cotacao: Cotacao) {
        return await addDoc(this.collectionRef, cotacao);
    }

    async getCotacoesByRequisicao(requisicaoId: string) {
        const q = query(this.collectionRef, where('id_requisicao', '==', requisicaoId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Cotacao);
    }

    async updateCotacaoStatus(cotacaoId: string, status: string) {
        const cotacaoRef = doc(db, 'cotacoes', cotacaoId);
        await updateDoc(cotacaoRef, { status });
    }
}

export default new CotacaoService();
