import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Alert, TextInput, StyleSheet } from 'react-native';
import userService from '../../services/userService';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '@/app/components/CustomButton';
import { TextStyle } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/types/types';

//https://stackoverflow.com/questions/60704310/typescript-stacknavigatonprops-and-screen-props-in-react-navigation-v5
type GerenciarUsuariosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GerenciarUsuariosScreen'>;
const GerenciarUsuariosScreen: React.FC = () => {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation<GerenciarUsuariosScreenNavigationProp>();


    useEffect(() => {
        const fetchUsuarios = async () => {
            const fetchedUsuarios = await userService.getUsuarios();
            setUsuarios(fetchedUsuarios);
        };

        fetchUsuarios();
    }, []);


    const handleBloquearDesbloquear = async (usuarioId: string, statusAtual: string) => {
        try {
            const novoStatus = statusAtual === 'Liberado' ? 'Bloqueado' : 'Liberado';
            await userService.updateUsuarioStatus(usuarioId, novoStatus);
            Alert.alert('Sucesso', `Usuário ${novoStatus === 'Bloqueado' ? 'bloqueado' : 'desbloqueado'} com sucesso.`);

            setUsuarios((prevUsuarios) => prevUsuarios.map((usuario) =>
                usuario.uid === usuarioId ? { ...usuario, status: novoStatus } : usuario
            ));
        } catch (error) {
            console.error("Erro ao bloquear/desbloquear usuário:", error);
        }
    };


    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = usuarios.filter((usuario) =>
            usuario.nome.toLowerCase().includes(query.toLowerCase()) ||
            usuario.email.toLowerCase().includes(query.toLowerCase())
        );
        setUsuarios(filtered);
    };


    const getStatusStyle = (status: string): TextStyle => {
        switch (status) {
            case 'Liberado':
                return { color: 'green', fontWeight: '700' }; // 700 é equivalente a 'bold'
            case 'Bloqueado':
                return { color: 'red', fontWeight: '700' }; // 700 para 'bold'
            default:
                return { color: 'black', fontWeight: '400' }; // 400 para 'normal'
        }
    };

    return (
        <View style={styles.container}>

            <TextInput
                placeholder="Pesquisar usuário por nome ou email"
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchBar}
            />


            <ScrollView>
                {usuarios.map((usuario) => (
                    <View key={usuario.uid} style={styles.userCard}>
                        <Text style={styles.userText}>Nome: {usuario.nome}</Text>
                        <Text style={styles.userText}>Email: {usuario.email}</Text>
                        <Text style={styles.userText}>Usuário: {usuario.papel}</Text>
                        <Text style={[styles.userText, getStatusStyle(usuario.status)]}>
                            Status: {usuario.status}
                        </Text>

                        <CustomButton
                            title={usuario.status === 'Liberado' ? 'Bloquear' : 'Desbloquear'}
                            onPress={() => handleBloquearDesbloquear(usuario.uid, usuario.status)}
                            icon={usuario.status === 'Liberado' ? 'block-helper' : 'account-clock-outline'}
                        />
                    </View>
                ))}
            </ScrollView>


            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('CreateAdministradorScreen')}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    searchBar: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    userCard: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    userText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#19708a',
    },
});

export default GerenciarUsuariosScreen;
