import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

const LoadingIndicator: React.FC<{ text?: string }> = ({ text }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <ActivityIndicator animating={true} size="large" color={colors.primary} />
            {text && <Text style={[styles.text, { color: colors.primary }]}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default LoadingIndicator;
