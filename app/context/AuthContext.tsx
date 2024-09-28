import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import UsuarioService from '../services/userService';
import { Usuario } from '../types/types';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'admin_session';
const TOKEN_KEY = 'admin_token';
const EMAIL_KEY = 'admin_email';
const PASSWORD_KEY = 'admin_password';



interface AuthContextType {
    user: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, nome: string, papel?: string) => Promise<void>;
    logout: () => Promise<void>;
    getAdminToken: () => Promise<string | null>; // Nova função para pegar o token do admin
}
type AuthContextNavigationProp = StackNavigationProp<RootStackParamList, 'AuthContext'>;
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigation = useNavigation<AuthContextNavigationProp>();
    const [user, setUser] = useState<Usuario | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const saveSession = async (sessionUser: Usuario, token: string) => {
        try {
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
            await AsyncStorage.setItem(TOKEN_KEY, token); // Salva o token
        } catch (error) {
            console.error('Erro ao salvar a sessão:', error);
        }
    };


    const getAdminToken = async (): Promise<string | null> => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            return token;
        } catch (error) {
            console.error('Erro ao carregar o token do administrador:', error);
            return null;
        }
    };


    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;
            const token = await loggedInUser.getIdToken(); // Pega o token de autenticação

            const userDoc = await UsuarioService.getUsuarioByEmail(loggedInUser.email!);
            const userData = userDoc[0];

            if (userData?.status === 'Bloqueado') {
                navigation.navigate('BlockedScreen');
                // deslogar e limpar o contexto
                await signOut(auth);
                setUser(null);
                setIsAuthenticated(false);
                alert('Sua conta está bloqueada. Entre em contato com o administrador.');
            } else {
                // Salva a sessão e permite o login
                const sessionUser: Usuario = {
                    uid: loggedInUser.uid,
                    email: loggedInUser.email!,
                    nome: loggedInUser.displayName || 'Nome do Usuário',
                    papel: userData?.papel || 'Colaborador',
                    status: userData?.status || 'Liberado',
                };

                setUser(sessionUser);
                setIsAuthenticated(true);

                await saveSession(sessionUser, token); // Salva a sessão no AsyncStorage
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };


    const logout = async () => {
        try {
            await signOut(auth);
            setIsAuthenticated(false);
            setUser(null);
            await AsyncStorage.removeItem(SESSION_KEY);
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };
    const signup = async (email: string, password: string, nome: string, papel: string = 'Colaborador') => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Atualiza o perfil do usuário com o displayName
            await updateProfile(userCredential.user, { displayName: nome });

            const newUser: Usuario = {
                uid: uid,
                email,
                nome,
                papel,
                status: 'Liberado',
            };

            const userDocRef = doc(db, `usuarios/${uid}`);
            await setDoc(userDocRef, newUser);

            setUser(newUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Erro ao criar conta:", error);
        }
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await UsuarioService.getUsuarioByEmail(firebaseUser.email!);
                const userRole = userDoc.length > 0 ? userDoc[0].papel : 'Colaborador';
                const userStatus = userDoc.length > 0 ? userDoc[0].status : 'Bloqueado';

                const sessionUser: Usuario = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email!,
                    nome: firebaseUser.displayName || 'Nome do Usuário',
                    papel: userRole,
                    status: userStatus,
                };

                setUser(sessionUser);
                setIsAuthenticated(true);

                // usuário estiver bloqueado, redirecionar para uma tela de aviso
                if (userStatus === 'Bloqueado') {
                    navigation.navigate('BlockedScreen');
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);



    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, getAdminToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
