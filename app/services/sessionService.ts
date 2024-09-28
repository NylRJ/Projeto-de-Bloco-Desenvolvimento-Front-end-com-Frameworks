import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'user_session';

export const saveSession = async (userId: string, role: string) => {
    try {
        const sessionData = JSON.stringify({ userId, role });
        await AsyncStorage.setItem(SESSION_KEY, sessionData);
    } catch (error) {
        console.error('Erro ao salvar a sessão:', error);
    }
};

export const getSession = async () => {
    try {
        const sessionData = await AsyncStorage.getItem(SESSION_KEY);
        if (sessionData) {
            return JSON.parse(sessionData);
        }
        return null;
    } catch (error) {
        console.error('Erro ao recuperar a sessão:', error);
        return null;
    }
};

export const clearSession = async () => {
    try {
        await AsyncStorage.removeItem(SESSION_KEY);
    } catch (error) {
        console.error('Erro ao remover a sessão:', error);
    }
};
