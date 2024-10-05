import React, { useCallback, useState } from 'react';
import BaseView from '@container/base';
import Header from '@components/header';
import Loader from '@components/loader';
import { useFocusEffect } from '@react-navigation/native';
import { notificationDataListener } from '@network/common-service';
import NotificationsList from '@container/notifications/notificationsList';

export default function Notifications() {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Optimized data fetching with useCallback
    const fetchData = useCallback(() => {
        const unsubscribe = notificationDataListener(updatedDocuments => {
            setNotifications(updatedDocuments);
            setLoading(false);
            setRefreshing(false);
        });

        return () => {
            unsubscribe && unsubscribe();
        }; // Cleanup on unmount or dependency change
    }, []);

    useFocusEffect(fetchData);
    console.log({ notifications });
    return (
        <BaseView>
            <Header back label={'Notifications'} />
            <Loader visible={loading} />
            <NotificationsList
                data={notifications}
                refreshing={refreshing}
                onRefresh={() => { setRefreshing(true); fetchData() }}
            />
        </BaseView>
    );
}
