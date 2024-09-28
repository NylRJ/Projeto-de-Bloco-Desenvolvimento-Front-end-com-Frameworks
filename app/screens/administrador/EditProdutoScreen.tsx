import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import ProdutoService from '../../services/produtoService';
import CategoriaService from '../../services/categoriaService';
import { ProdutoBase, Categoria, Subcategoria } from '../../types/types';
import { uploadImageAsync } from '../../services/firebaseStorageService';
import LoadingIndicator from '../../components/LoadingIndicator';
import CustomButton from '@/app/components/CustomButton';

const EditProdutoScreen: React.FC = () => {
    const route = useRoute();
    const { id } = route.params as { id: string };
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const [produto, setProduto] = useState<Partial<ProdutoBase>>({
        nome: '',
        especificacao: '',
        categoriaId: '',
        subcategoriaId: '',
        fotoUrl: '',
    });
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
    const [imagem, setImagem] = useState<string | null>(produto.fotoUrl!);


    useEffect(() => {
        console.log(id)
        console.log('Entrou')
        const fetchProduto = async () => {
            try {
                const fetchedProduto = await ProdutoService.getProdutos();
                const produtoToEdit = fetchedProduto.find(p => p.id === id);
                if (produtoToEdit) {
                    setProduto(produtoToEdit);
                    setImagem(produtoToEdit.fotoUrl!);
                } else {
                    Alert.alert('Erro', 'Produto não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao carregar produto:', error);
            }
        };
        fetchProduto();
    }, [id]);


    useEffect(() => {
        const fetchCategorias = async () => {
            const fetchedCategorias = await CategoriaService.getCategorias();
            setCategorias(fetchedCategorias);
        };
        fetchCategorias();
    }, []);


    useEffect(() => {
        if (produto.categoriaId) {
            const fetchSubcategorias = async () => {
                const fetchedSubcategorias = await CategoriaService.getSubcategorias(produto.categoriaId!);
                setSubcategorias(fetchedSubcategorias);
            };
            fetchSubcategorias();
        }
    }, [produto.categoriaId]);


    const pickImage = async () => {
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

    const handleSave = async () => {
        try {
            setIsLoading(true);
            if (!produto.nome || !produto.especificacao || !produto.categoriaId || !produto.subcategoriaId) {
                Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
                return;
            }

            const fotoUrl = imagem ? await uploadImageAsync(imagem, produto.nome!) : produto.fotoUrl;
            await ProdutoService.updateProduto(id, { ...produto, fotoUrl } as ProdutoBase, fotoUrl!);
            Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o produto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <View style={{ padding: 20 }}>
            {isLoading ? (
                <LoadingIndicator text="Atualizando produto..." />
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Produto"
                        value={produto.nome}
                        onChangeText={(text) => setProduto({ ...produto, nome: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Especificação"
                        value={produto.especificacao}
                        onChangeText={(text) => setProduto({ ...produto, especificacao: text })}
                    />


                    <Picker
                        selectedValue={produto.categoriaId}
                        onValueChange={(itemValue) => setProduto({ ...produto, categoriaId: itemValue })}
                    >
                        <Picker.Item label="Selecione uma Categoria" value="" />
                        {categorias.map((categoria) => (
                            <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
                        ))}
                    </Picker>


                    <Picker
                        selectedValue={produto.subcategoriaId}
                        onValueChange={(itemValue) => setProduto({ ...produto, subcategoriaId: itemValue })}
                        enabled={produto.categoriaId !== ''}
                    >
                        <Picker.Item label="Selecione uma Subcategoria" value="" />
                        {subcategorias.map((subcategoria) => (
                            <Picker.Item key={subcategoria.id} label={subcategoria.nome} value={subcategoria.id} />
                        ))}
                    </Picker>
                    <CustomButton
                        title="Escolher Imagem"
                        onPress={pickImage}
                        icon="camera"
                        style={styles.button}
                    />

                    {imagem && <Image source={{ uri: imagem }} style={{ width: 200, height: 200, marginTop: 10 }} />}

                    <CustomButton
                        title="Salvar"
                        onPress={handleSave}
                        icon="content-save-edit"
                        style={styles.button}
                    />
                </>)}

        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
    },
});

export default EditProdutoScreen;
