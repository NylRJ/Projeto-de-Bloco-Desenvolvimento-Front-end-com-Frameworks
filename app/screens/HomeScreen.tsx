import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { user, logout } = useAuth();


    useEffect(() => {
        if (user?.status === 'Bloqueado') {
            alert('Sua conta está bloqueada.');
            logout();
            navigation.navigate('LoginScreen');
        }
    }, [user]);

    const handleBlockedUser = () => {
        Alert.alert('Conta Bloqueada', 'Sua conta está bloqueada. Entre em contato com o administrador.');
        return;
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>

                {user?.status === 'Bloqueado' ? (
                    <View style={styles.blockedText}>

                        <Text> Sua conta está bloqueada. Entre em contato com o administrador.</Text>

                    </View>
                ) : (
                    <>
                        <View>
                            <Text> {user?.nome}</Text>
                        </View>
                        {user?.papel === 'Administrador' ? (

                            <>

                                <CustomButton
                                    title="Gerenciar Fornecedores"
                                    onPress={() => navigation.navigate('GerenciarFornecedoresScreen')}
                                    icon="account"
                                />
                                <CustomButton
                                    title="Gerenciar Produtos"
                                    onPress={() => navigation.navigate('GerenciarProdutosScreen')}
                                    icon="shopping"
                                />
                                <CustomButton
                                    title="Gerenciar Administradores"
                                    onPress={() => navigation.navigate('CreateAdministradorScreen')}
                                    icon="account-multiple-plus"
                                />
                                <CustomButton
                                    title="Gerenciar Usuários"
                                    onPress={() => navigation.navigate('GerenciarUsuariosScreen')}
                                    icon="account-multiple-plus"
                                />
                                <CustomButton
                                    title="Gerenciar Requisições"
                                    onPress={() => navigation.navigate('AdminRequisicoesScreen')}
                                    icon="cart-plus"
                                />
                            </>
                        ) : (
                            <>

                                <CustomButton
                                    title="Criar Requisição de Compras"
                                    onPress={() => navigation.navigate('CriarRequisicaoScreen')}
                                    icon="file-document"
                                />
                                <CustomButton
                                    title="Minhas Requisições"
                                    onPress={() => navigation.navigate('MinhasRequisicoesScreen')}
                                    icon="clipboard-list"
                                />
                            </>
                        )}
                    </>
                )}

                <CustomButton
                    title="Logout"
                    onPress={logout}
                    icon="logout"
                />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    button: {
        marginVertical: 10,
    },
    blockedText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default HomeScreen;
