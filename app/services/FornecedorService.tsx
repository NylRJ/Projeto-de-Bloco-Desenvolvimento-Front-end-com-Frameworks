import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

class FornecedorService {

    async createContatoForFornecedor(fornecedorId: string, contatoData: any): Promise<void> {
        try {
            const contatoRef = collection(db, `fornecedores/${fornecedorId}/contatos`);
            await addDoc(contatoRef, contatoData);
            console.log('Contato cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar contato: ', error);
            throw error;
        }
    }
}

export default new FornecedorService();
