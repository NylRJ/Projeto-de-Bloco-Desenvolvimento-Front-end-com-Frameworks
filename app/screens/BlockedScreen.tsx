import React from "react";
import { StyleSheet, Text, View } from 'react-native';


const BlockedScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>Sua conta foi bloqueada. Entre em contato com o administrador.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8d7da',
    },
    message: {
        fontSize: 18,
        color: '#721c24',
    },
});

export default BlockedScreen;
