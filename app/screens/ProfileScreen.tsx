import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Switch, useTheme } from 'react-native-paper';
import { uploadImageAsync } from '../services/firebaseStorageService';
import { useThemeContext } from '../context/ThemeContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;

const ProfileScreen: React.FC = () => {
    const { isThemeDark, toggleTheme } = useThemeContext();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const { colors } = useTheme();
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            const selectedImage = pickerResult.assets[0];
            setImageUri(selectedImage.uri);
        }
    };


    const handleSaveImage = async () => {
        if (imageUri) {
            try {
                setLoading(true);
                const downloadUrl = await uploadImageAsync(imageUri, 'perfil-usuario');
                Alert.alert('Sucesso', 'Imagem de perfil atualizada com sucesso!');
                navigation.navigate('HomeScreen');
            } catch (error) {
                console.error('Erro ao salvar a imagem:', error);
                Alert.alert('Erro', 'Falha ao atualizar a imagem de perfil.');
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert('Erro', 'Nenhuma imagem selecionada.');
        }
    };


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

            <Button
                mode="outlined"
                onPress={() => navigation.navigate('PasswordRecoveryScreen')}
                style={styles.recoverPasswordButton}
            >
                Recuperar Senha
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
    recoverPasswordButton: {
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
