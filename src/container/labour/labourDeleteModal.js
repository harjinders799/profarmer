import { View, Modal } from 'react-native';
import React, { useState } from 'react';
import { common } from '@utils/style';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import { strings } from '@translations/locale';
import Button from '@components/button';
import { deleteLabourCollection } from '@network/labour-service';
import { goBack } from '@navigation/ref';
import { ToastError } from '@utils/toast';

export default function LabourDeleteModal({
    openModal,
    setOpenModal,
    data,
}) {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
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
    }

    return (
        <Modal visible={openModal} animationType="slide" transparent={true}>
            <View style={[common.modalBack, { backgroundColor: colors.border + 50 }]}>
                <View style={[common.modalView, { backgroundColor: colors.background }]}>
                    <Text h2 bold>
                        {strings.are_you_sure}
                    </Text>
                    <Text h3 style={{ marginTop: 10 }}>
                        <Text h2 style={{ color: colors.error }}>
                            {data?.name}
                        </Text>
                        {strings.alert}
                    </Text>
                    <View style={[common.row_btw]}>
                        <Button
                            label={strings.delete}
                            loading={loading}
                            btnStyle={{ width: '40%', backgroundColor: colors.error }}
                            onPress={onDelete}
                        />
                        <Button
                            label={strings.cancel}
                            btnStyle={{ width: '40%', backgroundColor: colors.border }}
                            onPress={() => setOpenModal(false)}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
