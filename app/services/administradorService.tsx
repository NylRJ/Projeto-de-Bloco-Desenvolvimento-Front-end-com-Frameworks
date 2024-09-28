import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, deleteDoc, getDocs, collection, getDoc, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AdministradorService {


    async criarAdministrador(email: string, senha: string, nome: string): Promise<void> {
        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const colaboradorId = userCredential.user.uid;


            await updateProfile(userCredential.user, { displayName: nome });


            const colaboradorData = {
                uid: colaboradorId,
                email,
                nome,
                papel: 'Administrador',
                status: 'Liberado',
            };

            await setDoc(doc(db, 'usuarios', colaboradorId), colaboradorData);

            const requisicoesRef = collection(db, `usuarios/${colaboradorId}/requisicoes_compras`);
            await addDoc(requisicoesRef, {
                descricao: 'Primeira requisição de exemplo',
                data: new Date()
            });


            const adminEmail = await AsyncStorage.getItem('admin_email');
            const adminPassword = await AsyncStorage.getItem('admin_password');
            if (!adminEmail || !adminPassword) {
                throw new Error('Email ou senha do administrador não encontrados.');
            }


            await signOut(auth);


            await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
            console.log('Colaborador criado e administrador relogado ');
        } catch (error) {
            console.error('Erro ao criar colaborador:', error);
            throw error;
        }
    }



    // Função para deletar um colaborador do Firebase Authentication e Firestore
    async deletarColaborador(colaboradorId: string) {
        try {
            // Deletar o colaborador no Firestore (e suas subcoleções automaticamente)
            await deleteDoc(doc(db, 'usuarios', colaboradorId));

            // Deletar o colaborador no Firebase Authentication
            const user = auth.currentUser;
            if (user && user.uid === colaboradorId) {
                await deleteUser(user);
            }

            console.log('Colaborador deletado com sucesso:', colaboradorId);
        } catch (error) {
            console.error('Erro ao deletar colaborador:', error);
            throw error;  // Rejeita a promessa se ocorrer um erro
        }
    }

    // Função para buscar os dados de um colaborador específico
    async buscarColaboradorPorId(colaboradorId: string) {
        try {
            const colaboradorRef = doc(db, 'usuarios', colaboradorId);
            const colaboradorDoc = await getDoc(colaboradorRef);

            if (colaboradorDoc.exists()) {
                return colaboradorDoc.data();
            } else {
                console.log('Colaborador não encontrado:', colaboradorId);
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar colaborador:', error);
            throw error;  // Rejeita a promessa se ocorrer um erro
        }
    }

    // Função para listar todos os colaboradores
    async listarColaboradores() {
        try {
            const colaboradoresSnapshot = await getDocs(collection(db, 'usuarios'));
            const colaboradores = colaboradoresSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            return colaboradores;
        } catch (error) {
            console.error('Erro ao listar colaboradores:', error);
            throw error;
        }
    }
}

export default new AdministradorService();
