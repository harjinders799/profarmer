import React, { useState, useCallback, Suspense, lazy } from 'react';
import BaseView from '@container/base';
import { useLang } from '@context/langContext';
import Loader from '@components/loader';
import { strings } from '@translations/locale';
import Button from '@components/button';
import { goBack, navigate } from '@navigation/ref';
import { useFocusEffect, useRoute, useTheme } from '@react-navigation/native';
import Header from '@components/header';
import { useAuth } from '@context/authContext';
import {
    deletePickerCollection,
    groupsDataListener,
    pickersDataListener,
    pickersExpenseListener,
    pickersWeightListener,
} from '@network/picker-service';
import Tabs from '@components/tabs';
import { ScrollView, View } from 'react-native';
import Text from '@components/text';
import { common } from '@utils/style';
import SearchBar from '@container/searchBar';
import PickerFilter from '@container/picker/pickerFilter';
import PickerConclusion from '@container/picker/pickerConclusion';
import DeleteModal from '@container/deleteModal';
import { ToastError, ToastProgress, ToastSuccess } from '@utils/toast';

// Lazy load components
const PickerExpenseDetail = lazy(() =>
    import('@container/picker/pickerExpenseDetail'),
);
const PickerWeightDetail = lazy(() =>
    import('@container/picker/pickerWeightDetail'),
);

function PickerDetail() {
    const { user } = useAuth();
    const {
        params: { item, pickers, groups },
    } = useRoute();
    const { lang } = useLang();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Group List');
    const [orderBy, setOrderBy] = useState({ key: 'name', type: 'asc' });
    const [pickersWeightData, setPickersWeightData] = useState([]);
    const [pickersExpensesData, setPickersExpensesData] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    // Optimized data fetching with useCallback
    const fetchData = useCallback(() => {
        const unsubscribePickerWeight = pickersWeightListener(updatedDocuments => {
            setPickersWeightData(updatedDocuments);
            setLoading(false);
        }, item?.id);
        const unsubscribePickerExpenses = pickersExpenseListener(
            updatedDocuments => {
                setPickersExpensesData(updatedDocuments);
                setLoading(false);
            },
            item?.id,
        );

        return () => {
            if (unsubscribePickerWeight) unsubscribePickerWeight();
            if (unsubscribePickerExpenses) unsubscribePickerExpenses();
        }; // Cleanup on unmount or dependency change
    }, [lang, item]);

    useFocusEffect(fetchData);

    const onDelete = useCallback(async () => {
        try {
            setLoading(true);
            await deletePickerCollection(item.id);
            setLoading(false);
            ToastSuccess(strings.delete, strings.picker);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message, strings.picker);
        }
    }, [item]);

    return (
        <BaseView>
            <Header
                back
                label={item?.name}
                deleteIcon
                onDeletePress={() => setOpenModal(true)}
                share
                onSharePress={() => ToastProgress(strings.in_progress)}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
                <PickerConclusion
                    item={item}
                    weights={pickersWeightData}
                    expenses={pickersExpensesData}
                />
                <Suspense fallback={<Loader small visible={true} />}>
                    <PickerWeightDetail data={item} weights={pickersWeightData} />
                    <PickerExpenseDetail data={item} expense={pickersExpensesData} />
                </Suspense>
            </ScrollView>
            <DeleteModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={item}
                loading={loading}
                customDescription={`${strings.alert}`}
                onDelete={onDelete}
            />
        </BaseView>
    );
}

const styles = {
    button: {
        maxWidth: '45%',
        width: 'auto',
        paddingHorizontal: 5,
        position: 'absolute',
        bottom: 30,
        zIndex: 999,
    },
};

export default React.memo(PickerDetail);
