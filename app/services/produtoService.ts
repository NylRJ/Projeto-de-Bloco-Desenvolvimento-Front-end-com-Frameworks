import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { ProdutoBase, ProdutoFornecedor, ProdutoParaSalvar } from '../types/types';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

class ProdutoService {

    // Busca todos os produtos
    async getProdutos(): Promise<ProdutoBase[]> {
        const produtosSnapshot = await getDocs(collection(db, 'produtos'));
        const produtos = produtosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ProdutoBase[];
        return produtos;
    }

    // Busca um produto por ID
    async getProdutoById(produtoId: string): Promise<ProdutoBase | undefined> {
        const produtoRef = doc(db, 'produtos', produtoId);
        const produtoSnap = await getDoc(produtoRef);
        if (produtoSnap.exists()) {
            return { id: produtoSnap.id, ...produtoSnap.data() } as ProdutoBase;
        }
        return undefined;
    }

    // Adiciona um novo produto
    async addProduto(produto: ProdutoParaSalvar, imageUri: string | null): Promise<string> {
        let imageUrl = '';

        // Se houver uma imagem, faça o upload para o Firebase Storage
        if (imageUri) {
            const storage = getStorage();
            const storageRef = ref(storage, `produtos/${produto.nome}/image.jpg`);

            // Converte a URI da imagem para um arquivo Blob e faça o upload
            const response = await fetch(imageUri);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);

            // Obtém a URL da imagem
            imageUrl = await getDownloadURL(storageRef);
        }

        // Adiciona o produto no Firestore com a URL da imagem
        const produtoData = {
            ...produto,
            fotoUrl: imageUrl
        };
        const produtoRef = await addDoc(collection(db, "produtos"), produtoData);

        // TODO: Atualiza o produto com o ID gerado pelo Firestore
        await updateDoc(produtoRef, { id: produtoRef.id });

        return produtoRef.id;
    }



    // Atualiza um produto existente
    async updateProduto(produtoId: string, produto: Partial<ProdutoBase>, imageUri: string | null) {
        let imageUrl = produto.fotoUrl || '';

        // Se houver uma nova imagem, faça o upload para o Firebase Storage
        if (imageUri) {
            const storage = getStorage();
            const storageRef = ref(storage, `produtos/${produto.nome || produtoId}/image.jpg`);

            const response = await fetch(imageUri);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);

            imageUrl = await getDownloadURL(storageRef);
        }

        // Atualiza o produto no Firestore
        const produtoData = { ...produto, fotoUrl: imageUrl };
        const produtoRef = doc(db, 'produtos', produtoId);
        await updateDoc(produtoRef, produtoData);
    }

    // Deleta um produto pelo ID
    async deleteProduto(produtoId: string) {
        const produtoRef = doc(db, 'produtos', produtoId);
        await deleteDoc(produtoRef);
    }

    // "Ouvinte" em tempo real para mudanças nos produtos
    listenToProdutos(callback: (produtos: ProdutoBase[]) => void) {
        const unsubscribe = onSnapshot(collection(db, 'produtos'), (snapshot) => {
            const produtos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as ProdutoBase[];
            callback(produtos);
        });
        return unsubscribe;
    }

    // Adiciona um produto a um fornecedor (sub-coleção)
    async associarProdutoFornecedor(fornecedorId: string, produtoFornecedor: ProdutoFornecedor) {
        const fornecedorRef = doc(db, 'fornecedores', fornecedorId);
        const produtosSubcollection = collection(fornecedorRef, 'produtos');

        await addDoc(produtosSubcollection, produtoFornecedor);
    }

    // Busca todos os produtos associados a um fornecedor específico
    async getProdutosByFornecedor(fornecedorId: string): Promise<ProdutoFornecedor[]> {
        const fornecedorRef = doc(db, 'fornecedores', fornecedorId);
        const produtosSnapshot = await getDocs(collection(fornecedorRef, 'produtos'));
        const produtos = produtosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as ProdutoFornecedor[];
        return produtos;
    }
}

export default new ProdutoService();
