import React, { useState, useCallback } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import Text from '@components/text';
import Button from '@components/button';
import { useTheme } from '@react-navigation/native';
import { strings } from '@translations/locale';
import { deleteLabourCollection } from '@network/labour-service';
import { goBack } from '@navigation/ref';
import { ToastError } from '@utils/toast';
import { common } from '@utils/style';

function LabourDeleteModal({
    openModal,
    setOpenModal,
    data,
}) {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);

    const onDelete = useCallback(async () => {
        try {
            setLoading(true);
            await deleteLabourCollection(data?.id);
            setLoading(false);
            setOpenModal(false);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    }, [data, setOpenModal]);

    return (
        <Modal visible={openModal} animationType="slide" transparent={true}>
            <View style={[styles.container, { backgroundColor: colors.border + 50 }]}>
                <View style={[styles.modalView, { backgroundColor: colors.background }]}>
                    <Text h2 bold>
                        {strings.are_you_sure}
                    </Text>
                    <Text h3 style={styles.text}>
                        <Text h2 style={{ color: colors.error }}>
                            {data?.name}
                        </Text>
                        {strings.alert}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            label={strings.delete}
                            loading={loading}
                            btnStyle={[styles.button, { backgroundColor: colors.error }]}
                            onPress={onDelete}
                        />
                        <Button
                            label={strings.cancel}
                            btnStyle={[styles.button, { backgroundColor: colors.border }]}
                            onPress={() => setOpenModal(false)}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        ...common.modalView,
        width: '80%',
        padding: 20,
    },
    text: {
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        width: '40%',
    },
});

export default React.memo(LabourDeleteModal);
