import React from 'react';
import { Modal, Button, Text, Portal, Provider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface ConfirmModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, onConfirm, onCancel }) => {
    return (
        <Provider>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={onCancel}
                    contentContainerStyle={styles.modalContainer}
                >
                    <View style={styles.content}>
                        <Text style={styles.modalTitle}>Confirmação</Text>
                        <Text style={styles.modalText}>Tem certeza que deseja excluir esta requisição?</Text>
                        <View style={styles.buttonsContainer}>
                            <Button mode="contained" onPress={onConfirm} style={styles.buttonConfirm}>
                                Confirmar
                            </Button>
                            <Button mode="outlined" onPress={onCancel} style={styles.buttonCancel}>
                                Cancelar
                            </Button>
                        </View>
                    </View>
                </Modal>
            </Portal>
        </Provider>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -150 }],
        width: 400,
    },
    content: {
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonConfirm: {
        backgroundColor: 'green',
        marginRight: 10,
    },
    buttonCancel: {
        borderColor: 'red',
        borderWidth: 1,
    },
});

export default ConfirmModal;
