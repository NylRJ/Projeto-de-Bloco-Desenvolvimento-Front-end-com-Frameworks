import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet, Image, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import ProdutoService from '../../services/produtoService';
import CategoriaService from '../../services/categoriaService';
import { Categoria, Subcategoria, ProdutoBase } from '../../types/types';
import { uploadImageAsync } from '../../services/firebaseStorageService';
import LoadingIndicator from '../../components/LoadingIndicator';
import CustomButton from '@/app/components/CustomButton';

const AddProdutoScreen: React.FC = () => {
    const [nome, setNome] = useState('');
    const [categoriaNome, setCategoriaNome] = useState('');
    const [especificacao, setEspecificacao] = useState('');
    const [categoriaId, setCategoriaId] = useState<string>('');
    const [subcategoriaId, setSubcategoriaId] = useState<string>('');
    const [imagem, setImagem] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const navigation = useNavigation();


    useEffect(() => {
        if (Platform.OS !== 'web') {
            (async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            })();
        }
    }, []);

    useEffect(() => {
        const fetchCategorias = async () => {
            const fetchedCategorias = await CategoriaService.getCategorias();
            setCategorias(fetchedCategorias);
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (categoriaId) {
            const fetchSubcategorias = async () => {
                const fetchedSubcategorias = await CategoriaService.getSubcategorias(categoriaId);
                setSubcategorias(fetchedSubcategorias);
            };
            fetchSubcategorias();
        }
    }, [categoriaId]);


    const pickImageFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };


    const takePhotoWithCamera = async () => {
        if (hasPermission === null) {
            return;
        }

        if (hasPermission === false) {
            Alert.alert('Permissão negada', 'Você precisa permitir o acesso à câmera.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!nome || !especificacao || !categoriaId || !imagem) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            setIsLoading(true);

            const nomeCategoria = await CategoriaService.getCategoriaNome(categoriaId);
            setCategoriaNome(nomeCategoria);

            const fotoUrl = await uploadImageAsync(imagem, nome);

            const novoProduto: ProdutoBase = {
                id: '',
                nome,
                categoriaNome: nomeCategoria,
                especificacao,
                categoriaId,
                subcategoriaId,
                descricao: '',
                fotoUrl,
            };

            const produtoId = await ProdutoService.addProduto(novoProduto, imagem);
            Alert.alert('Sucesso', 'Produto adicionado com sucesso!');

            setTimeout(() => {
                navigation.goBack();
            }, 500);
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            Alert.alert('Erro', 'Não foi possível adicionar o produto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            {isLoading ? (
                <LoadingIndicator text="Salvando produto..." />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollViewContainer}
                    keyboardShouldPersistTaps="handled" >
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Produto"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        multiline
                        style={{ height: 100, padding: 10, backgroundColor: 'white', marginBottom: 5 }}
                        placeholder="Especificação"
                        value={especificacao}
                        onChangeText={setEspecificacao}
                    />
                    <Picker
                        selectedValue={categoriaId}
                        onValueChange={(itemValue) => setCategoriaId(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione uma Categoria" value="" />
                        {categorias.map((categoria) => (
                            <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={subcategoriaId}
                        onValueChange={(itemValue) => setSubcategoriaId(itemValue)}
                        enabled={categoriaId !== ''}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione uma Subcategoria" value="" />
                        {subcategorias.map((subcategoria) => (
                            <Picker.Item key={subcategoria.id} label={subcategoria.nome} value={subcategoria.id} />
                        ))}
                    </Picker>

                    <CustomButton
                        title="Escolher da Galeria"
                        onPress={pickImageFromGallery}
                        icon="image"
                        style={styles.button}
                    />


                    {Platform.OS !== 'web' && (
                        <CustomButton
                            title="Capturar com Câmera"
                            onPress={takePhotoWithCamera}
                            icon="camera"
                            style={styles.button}
                        />
                    )}

                    {imagem && <Image source={{ uri: imagem }} style={styles.image} />}
                    <CustomButton
                        title="Salvar"
                        onPress={handleSave}
                        icon="content-save"
                        style={styles.button}
                    />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    picker: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
    },
});

export default AddProdutoScreen;
