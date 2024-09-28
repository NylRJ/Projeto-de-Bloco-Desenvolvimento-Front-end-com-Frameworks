import { auth } from '../services/firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

interface User {
    // Defina as propriedades do usuário (uid, email, etc.) de acordo com sua estrutura de dados do Firebase
    uid: string;
    email: string;
    // ... outras propriedades
}

const authService = {
    signup: async (email: string, password: string): Promise<User> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Extraia as informações do usuário do objeto userCredential
            const user: User = {
                uid: userCredential.user.uid,
                email: userCredential.user.email ?? '',
                // ... outras propriedades de acordo com sua estrutura
            };
            return user;
        } catch (error) {
            throw error;
        }
    },

    login: async (email: string, password: string): Promise<User> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Extraindo as informações do usuário do objeto userCredential
            const user: User = {
                uid: userCredential.user.uid,
                email: userCredential.user.email ?? '',

            };
            return user;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    }
};

export default authService;