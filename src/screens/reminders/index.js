import { View, Text } from 'react-native'
import React, { lazy, Suspense, useCallback, useState } from 'react'
import BaseView from '@container/base'
import Header from '@components/header'
import Button from '@components/button'
import { strings } from '@translations/locale'
import { common } from '@utils/style'
import { navigate } from '@navigation/ref'
import { useLang } from '@context/langContext'
import { getRemindersData } from '@network/reminder-service'
import { useFocusEffect } from '@react-navigation/native'
import Loader from '@components/loader'

// Lazy load ReminderList component
const ReminderList = lazy(() => import('@container/reminder/reminderList'));

export default function Reminders() {
    const { lang } = useLang();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Optimized data fetching with useCallback
    const fetchData = useCallback(() => {
        const unsubscribe = getRemindersData(updatedDocuments => {
            setData(updatedDocuments);
            setLoading(false);
        }, 'document');
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [lang]);

    useFocusEffect(fetchData);

    return (
        <BaseView>
            <Header back label={strings.document_reminder} />
            <Suspense fallback={<Loader visible={loading} />}>
                <ReminderList data={data} />
            </Suspense>
            <Button
                iconLeft="plus"
                label={`${strings.add} ${strings.reminder}`}
                btnStyle={{
                    maxWidth: '60%',
                    // paddingHorizontal: 15,
                    width: 'auto',
                    position: 'absolute',
                    bottom: 20,
                    right: -5,
                    zIndex: 999,
                    ...common.shadow
                }}
                onPress={() => navigate('AddReminder')}
            />
        </BaseView>
    )
}