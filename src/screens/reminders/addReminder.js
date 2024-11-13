import { Keyboard, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import BaseView from '@container/base';
import Header from '@components/header';
import Text from '@components/text';
import { strings } from '@translations/locale';
import { useRoute, useTheme } from '@react-navigation/native';
import Loader from '@components/loader';
import Input from '@components/input';
import { onChangeValue } from '@utils/helper';
import Button from '@components/button';
import { dateFormat, dateTimeFormat } from '@utils/dateformat';
import DateTimePicker from '@components/DateTime';
import Tabs from '@components/tabs';
import { wp } from '@utils/fonts';
import { scheduleReminder } from '@network/crop-service';
import { requestUserPermission } from '@utils/notification';
import { goBack } from '@navigation/ref';
import { ToastError, ToastSuccess } from '@utils/toast';
import { addNewReminder } from '@network/reminder-service';

const AddReminder = () => {
    const { colors } = useTheme();
    const { params } = useRoute();
    const type = params?.type ?? null;
    const typeId = params?.typeId ?? null;
    const [data, setData] = useState({
        title: '',
        description: '',
        reminderDate: new Date(),
        repeat: 'NONE',
        priority: 'high',
        reminderType: type ?? 'document',
        reminderTypeId: typeId ?? null,
        isCompleted: false,
        status: 'active',
    });
    const [loading, setLoading] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const { title, description, reminderDate, repeat } = data;

    useEffect(() => {
        requestUserPermission();
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            if (!title) {
                return ToastError(strings.title)
            }
            setLoading(true);
            await addNewReminder(data)
            //   editData?.id
            //     ? await updateCrop({
            //         id: editData?.id,
            //         ...data,
            //         dateOfSowing: currentStamp(dateOfSowing),
            //         cropPeriodCompleted: currentStamp(cropPeriodCompleted),
            //       })
            //     : await addNewCrop(data);
            setLoading(false);
            ToastSuccess(strings.successfully_saved);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    }, [data]);

    return (
        <BaseView>
            <Loader visible={loading} />
            <Header back label={`${strings.add} ${strings.reminder}`} />
            <ScrollView
                style={styles.form}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 10 }}
                automaticallyAdjustKeyboardInsets
                keyboardShouldPersistTaps="always">
                <Input
                    label={strings.title}
                    autoCapitalize="words"
                    autoFocus
                    placeholder={strings.title}
                    value={title}
                    setValue={value =>
                        onChangeValue({ setData, key: 'title', value, isName: true })
                    }
                />
                <Input
                    label={strings.description}
                    placeholder={strings.description}
                    value={description}
                    multiline
                    setValue={value =>
                        onChangeValue({ setData, key: 'description', value })
                    }
                />

                <Pressable
                    onPress={() => {
                        setShowDate(true);
                        Keyboard.dismiss();
                    }}>
                    <Input
                        label={`${strings.reminder} ${strings.date}`}
                        editable={false}
                        placeholder={strings.date}
                        value={dateTimeFormat(reminderDate)}
                        onPress={() => {
                            setShowDate(true);
                            Keyboard.dismiss();
                        }}
                    />
                </Pressable>
                <Text h4 style={{ margin: 5 }}>
                    Repeat
                </Text>
                <Tabs
                    tabs={['NONE', 'DAILY', 'WEEKLY']}
                    activeTab={repeat}
                    inactiveTextColor={colors.text}
                    style={{ width: wp(100), marginHorizontal: -10 }}
                    activeBGColor={colors.warning}
                    setActiveTab={value => onChangeValue({ setData, key: 'repeat', value })}
                />
                <Button label={strings.save} onPress={handleSubmit} />
                <DateTimePicker
                    show={showDate}
                    setShow={setShowDate}
                    mode="datetime"
                    date={reminderDate}
                    setDate={value =>
                        onChangeValue({ setData, key: 'reminderDate', value })
                    }
                />
            </ScrollView>
        </BaseView>
    );
};

export default AddReminder;

const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
});
