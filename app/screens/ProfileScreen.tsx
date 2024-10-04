import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Switch, useTheme } from 'react-native-paper';
import { uploadImageAsync } from '../services/firebaseStorageService'; // Função para upload no Firebase Storage
import { useThemeContext } from '../context/ThemeContext'; // Importa o contexto de tema
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator'; // Importe o componente LoadingIndicator

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;

const ProfileScreen: React.FC = () => {
    const { isThemeDark, toggleTheme } = useThemeContext(); // Usa o contexto de tema
    const [imageUri, setImageUri] = useState<string | null>(null);
    const { colors } = useTheme(); // Obtém as cores do tema atual
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [loading, setLoading] = useState(false); // Controle de carregamento

    // Função para selecionar uma imagem da galeria
    const pickImage = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // Verifica se a seleção foi cancelada
        if (!pickerResult.canceled) {
            const selectedImage = pickerResult.assets[0];
            setImageUri(selectedImage.uri);
        }
    };

    // Função para salvar a imagem no Firebase Storage
    const handleSaveImage = async () => {
        if (imageUri) {
            try {
                setLoading(true); // Ativa o indicador de carregamento
                const downloadUrl = await uploadImageAsync(imageUri, 'perfil-usuario');
                Alert.alert('Sucesso', 'Imagem de perfil atualizada com sucesso!');
                navigation.navigate('HomeScreen');
            } catch (error) {
                console.error('Erro ao salvar a imagem:', error);
                Alert.alert('Erro', 'Falha ao atualizar a imagem de perfil.');
            } finally {
                setLoading(false); // Desativa o indicador de carregamento
            }
        } else {
            Alert.alert('Erro', 'Nenhuma imagem selecionada.');
        }
    };

    // Exibe o componente de carregamento enquanto estiver salvando
    if (loading) {
        return <LoadingIndicator text="Salvando imagem..." />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.onBackground }]}>Perfil do Usuário</Text>

            <TouchableOpacity onPress={pickImage}>
                <Avatar.Image
                    size={150}
                    source={imageUri ? { uri: imageUri } : require('../images/default-avatar.webp')} // Mostra a imagem selecionada ou a imagem padrão
                    style={styles.avatar}
                />
                <Text style={[styles.changePhotoText, { color: colors.primary }]}>Alterar Foto</Text>
            </TouchableOpacity>

            <Button
                mode="contained"
                onPress={handleSaveImage}
                color={colors.primary}
                style={styles.saveButton}
            >
                Salvar Foto
            </Button>

            <View style={styles.themeSwitcher}>
                <Text style={{ color: colors.onSurface }}>Modo Escuro</Text>
                <Switch value={isThemeDark} onValueChange={toggleTheme} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    avatar: {
        marginBottom: 16,
    },
    changePhotoText: {
        marginTop: 8,
        fontSize: 16,
    },
    saveButton: {
        marginTop: 16,
    },
    themeSwitcher: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 32,
    },
});

export default ProfileScreen;
