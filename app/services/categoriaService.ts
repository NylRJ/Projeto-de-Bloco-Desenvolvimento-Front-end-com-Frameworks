import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Categoria, Subcategoria } from "../types/types";


class CategoriaService {

    async getCategorias(): Promise<Categoria[]> {
        const categoriasSnapshot = await getDocs(collection(db, "categorias"));
        const categorias = categoriasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Categoria[];
        return categorias;
    }


    async getSubcategorias(categoriaId: string): Promise<Subcategoria[]> {
        const subcategoriasSnapshot = await getDocs(collection(db, `categorias/${categoriaId}/subcategorias`));
        const subcategorias = subcategoriasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Subcategoria[];
        return subcategorias;
    }

    // Busca o nome de uma categoria específica
    async getCategoriaNome(categoriaId: string): Promise<string> {
        const categoriaDoc = await getDoc(doc(db, "categorias", categoriaId));
        if (categoriaDoc.exists()) {
            return categoriaDoc.data().nome; // Retorna o nome da categoria
        } else {
            throw new Error('Categoria não encontrada.');
        }
    }



}


export default new CategoriaService();
