import { collection, query, where, getDocs, addDoc, deleteDoc, writeBatch, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Fornecedor, Contato, ProdutoFornecedor } from '../types/types';
import produtoService from './produtoService';

class FornecedorService {



    // Adiciona um contato a um fornecedor
    async createContatoForFornecedor(fornecedorId: string, contato: Contato): Promise<void> {
        const contatosRef = collection(db, `fornecedores/${fornecedorId}/contatos`);
        await addDoc(contatosRef, contato);
    }

    // Exemplo de uso: Cria um fornecedor e vincula um contato
    async addFornecedorWithContato(fornecedor: Fornecedor, contato: Contato): Promise<void> {
        const fornecedorRef = await addDoc(collection(db, 'fornecedores'), fornecedor);
        await updateDoc(fornecedorRef, { id: fornecedorRef.id });
        await this.createContatoForFornecedor(fornecedorRef.id, contato);
    }

    async getFornecedoresByCnpj(cnpj_cpf: string) {
        const q = query(collection(db, 'fornecedores'), where('cnpj_cpf', '==', cnpj_cpf));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Fornecedor[];
    }


    async addFornecedor(fornecedor: Fornecedor) {

        const fornecedorRef = await addDoc(collection(db, 'fornecedores'), fornecedor);

        await updateDoc(fornecedorRef, { id: fornecedorRef.id });
    }

    async getProdutosDeFornecedores(): Promise<any[]> {
        const fornecedoresSnapshot = await getDocs(collection(db, 'fornecedores'));
        let produtosCompletos: any[] = [];

        // Iterar sobre todos os fornecedores
        for (const fornecedorDoc of fornecedoresSnapshot.docs) {
            const fornecedorId = fornecedorDoc.id;

            // Pega a subcoleção de produtos de cada fornecedor
            const produtosSnapshot = await getDocs(collection(db, `fornecedores/${fornecedorId}/produtos`));

            // Iterar sobre todos os produtos do fornecedor
            for (const produtoDoc of produtosSnapshot.docs) {
                const produtoData = produtoDoc.data();
                const produtoId = produtoData.id;

                // Usa o ProdutoService para buscar detalhes completos do produto
                const produtoDetalhado = await produtoService.getProdutoById(produtoId);

                if (produtoDetalhado) {
                    produtosCompletos.push({
                        ...produtoDetalhado,
                        fornecedor: fornecedorDoc.data().nome,
                        valor: produtoData.valor, // Pega o preço da subcoleção
                        quantidade: produtoData.quantidade // Quantidade do fornecedor
                    });
                }
            }
        }

        return produtosCompletos; // Retorna a lista de todos os produtos com detalhes
    }
    async updateFornecedor(fornecedorId: string, fornecedor: Partial<Fornecedor>) {
        const fornecedorRef = doc(db, 'fornecedores', fornecedorId);

        // Remover campos indefinidos antes de enviar ao Firestore
        const fornecedorData = Object.fromEntries(
            Object.entries(fornecedor).filter(([_, value]) => value !== undefined)
        );

        return await updateDoc(fornecedorRef, fornecedorData);
    }

    // Deleta um fornecedor e suas sub-coleções associadas (produtos e contatos)
    async deleteFornecedor(fornecedorId: string) {
        const fornecedorRef = doc(db, 'fornecedores', fornecedorId);
        const produtosRef = collection(fornecedorRef, 'produtos');
        const contatosRef = collection(fornecedorRef, 'contatos');

        const produtosSnapshot = await getDocs(produtosRef);
        const contatosSnapshot = await getDocs(contatosRef);

        const batch = writeBatch(db);

        produtosSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        contatosSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Deleta o fornecedor após deletar os produtos e contatos associados
        batch.delete(fornecedorRef);

        await batch.commit();
    }


    async addProdutoToFornecedor(fornecedorId: string, produtoData: ProdutoFornecedor) {
        const fornecedorRef = doc(db, 'fornecedores', fornecedorId);
        const produtosSubcollection = collection(fornecedorRef, 'produtos');
        return await addDoc(produtosSubcollection, produtoData);
    }


    async addContatoToFornecedor(fornecedorId: string, contato: Contato) {
        const contatosRef = collection(db, `fornecedores/${fornecedorId}/contatos`);
        return await addDoc(contatosRef, contato);
    }

    // Busca todos os fornecedores
    async getFornecedores() {
        const fornecedoresRef = collection(db, 'fornecedores');
        const fornecedoresSnapshot = await getDocs(fornecedoresRef);
        return fornecedoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Fornecedor[];
    }

    // "Ouvir" as mudanças em tempo real nos fornecedores
    listenToFornecedores(callback: (fornecedores: Fornecedor[]) => void) {
        const fornecedoresRef = collection(db, 'fornecedores');
        return onSnapshot(fornecedoresRef, (snapshot) => {
            const fornecedores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Fornecedor[];
            callback(fornecedores);
        });
    }

    async getFornecedoresByProdutoId(produtoId: string) {
        const fornecedoresSnapshot = await getDocs(collection(db, 'fornecedores'));
        const fornecedorService: any[] = [];

        fornecedoresSnapshot.forEach(async (fornecedorDoc) => {
            const produtosSnapshot = await getDocs(collection(db, `fornecedores/${fornecedorDoc.id}/produtos`));
            produtosSnapshot.forEach((produtoDoc) => {
                if (produtoDoc.data().id_produto === produtoId) {
                    fornecedorService.push({
                        fornecedorId: fornecedorDoc.id,
                        fornecedorNome: fornecedorDoc.data().nome,
                        produtoInfo: produtoDoc.data(),
                    });
                }
            });
        });

        return fornecedorService;
    }

}

export default new FornecedorService();
