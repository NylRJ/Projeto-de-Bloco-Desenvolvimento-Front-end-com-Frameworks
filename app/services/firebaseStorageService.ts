import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';

// Função para fazer o upload da imagem no Firebase Storage
export const uploadImageAsync = async (uri: string, nomeProduto: string): Promise<string> => {
    const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            resolve(xhr.response);
        };
        xhr.onerror = () => {
            reject(new Error('Erro ao fazer upload da imagem'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const storage = getStorage();
    const storageRef = ref(storage, `produtos/${nomeProduto}-${uuid.v4()}`); // Cria um nome único para a imagem
    const result = await uploadBytes(storageRef, blob);

    // Após o upload, obter a URL de download da imagem
    return await getDownloadURL(result.ref);
};
