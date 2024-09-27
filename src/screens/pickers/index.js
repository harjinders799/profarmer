import React, { useState, useCallback, Suspense, lazy } from 'react';
import BaseView from '@container/base';
import { useLang } from '@context/langContext';
import Loader from '@components/loader';
import { strings } from '@translations/locale';
import Button from '@components/button';
import { navigate } from '@navigation/ref';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import Header from '@components/header';
import { useAuth } from '@context/authContext';
import { groupsDataListener, pickersDataListener } from '@network/picker-service';
import Tabs from '@components/tabs';
import { View } from 'react-native';
import Text from '@components/text';
import { common } from '@utils/style';
import SearchBar from '@container/searchBar';
import PickerFilter from '@container/picker/pickerFilter';
import Icon from '@components/icon';
import PickersConclusion from '@container/picker/pickersConclusion';

// Lazy load components
const PickerList = lazy(() => import('@container/picker/pickerList'));
const PickerDateWise = lazy(() => import('@container/picker/pickerDateWise'));
const GroupList = lazy(() => import('@container/picker/groupList'));

function Pickers() {
    const { user } = useAuth();
    const { lang } = useLang();
    const { colors } = useTheme();
    const [pickers, setPickers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Group List');
    const [orderBy, setOrderBy] = useState({ key: 'name', type: 'asc' });
    const [isFocus, setIsFocus] = useState();
    const [showConclusion, setShowConclusion] = useState(false);

    // Optimized data fetching with useCallback
    const fetchData = useCallback(() => {
        const unsubscribePicker = pickersDataListener(
            updatedDocuments => {
                setPickers(updatedDocuments);
                setLoading(false);
            },
            user?.phone,
            orderBy,
        );
        const unsubscribeGroup = groupsDataListener(updatedDocuments => {
            setGroups(updatedDocuments);
            setLoading(false);
        }, orderBy);

        return () => {
            if (unsubscribePicker) unsubscribePicker();
            if (unsubscribeGroup) unsubscribeGroup();
        }; // Cleanup on unmount or dependency change
    }, [lang, activeTab, user?.phone, orderBy]);

    useFocusEffect(fetchData);

    const renderContent = () => (
        <Suspense fallback={<Loader visible={true} />}>
            {activeTab === 'Picker List' ? (
                <PickerList data={pickers} groups={groups} />
            ) : activeTab === 'Group List' ? (
                <GroupList data={groups} pickers={pickers} />
            ) : (
                <PickerDateWise groups={groups} pickers={pickers} />
            )}
        </Suspense>
    );

    return (
        <BaseView>
            <Loader visible={loading} />
            <Header
                back
                label={strings.picker}
                rightComponent={
                    <Icon
                        name={showConclusion ? 'eye-off' : 'eye'}
                        size={20}
                        type="Ionicons"
                        onPress={() => setShowConclusion(!showConclusion)}
                    />
                }
            />
            {showConclusion ? <PickersConclusion pickers={pickers} /> : null}
            {isFocus ? null : (
                <Tabs
                    tabs={['Picker List', 'Group List', 'Date Wise']}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}
            {activeTab != 'Date Wise' ? (
                <PickerFilter
                    isFocus={isFocus}
                    setIsFocus={setIsFocus}
                    orderBy={orderBy}
                    pickers={pickers}
                    groups={groups}
                    setOrderBy={setOrderBy}
                />
            ) : null}
            {isFocus ? null : renderContent()}
            {!isFocus ? (
                <Button
                    iconLeft="plus"
                    small
                    label={strings.add_picker}
                    btnStyle={[styles.button, { right: 20 }]}
                    onPress={() => navigate('AddPicker')}
                />
            ) : null}
            {activeTab == 'Group List' && !isFocus ? (
                <Button
                    small
                    iconLeft="plus"
                    label={strings.create_group}
                    btnStyle={[
                        styles.button,
                        { left: 20, backgroundColor: colors.warning },
                    ]}
                    onPress={() => navigate('CreatePickerGroup', { pickers, groups })}
                />
            ) : null}
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

export default React.memo(Pickers);
