import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Usuario } from '../types/types';

class UserService {
    private collectionRef = collection(db, 'usuarios');


    async createUsuario(usuario: Usuario) {
        return await addDoc(this.collectionRef, usuario);
    }


    async getUsuarioByEmail(email: string): Promise<Usuario[]> {
        const q = query(this.collectionRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Usuario);
    }

    async updateUsuarioStatus(uid: string, status: string): Promise<void> {
        const q = query(this.collectionRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const usuarioDoc = querySnapshot.docs[0];
            const usuarioRef = doc(db, 'usuarios', usuarioDoc.id);
            await updateDoc(usuarioRef, { status });
        } else {
            throw new Error('Usuário não encontrado.');
        }
    }


    async getUserRoleFromFirebase(uid: string): Promise<string | null> {
        const q = query(this.collectionRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const usuarioDoc = querySnapshot.docs[0];
            const userData = usuarioDoc.data() as Usuario;
            return userData.papel || null;
        }

        return null;
    }


    async getUsuarios(): Promise<Usuario[]> {
        const querySnapshot = await getDocs(this.collectionRef);
        return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Usuario));
    }
}

export default new UserService();
