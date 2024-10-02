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
import auth from '@react-native-firebase/auth';

// Lazy load components
const PickerList = lazy(() => import('@container/picker/pickerList'));
const PickerDateWise = lazy(() => import('@container/picker/pickerDateWise'));
const GroupList = lazy(() => import('@container/picker/groupList'));

function Pickers() {
    const { user } = useAuth();
    const { lang } = useLang();
    const uid = auth()?.currentUser?.uid;
    const { colors } = useTheme();
    const [pickers, setPickers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(strings.group_list); // Updated for localization
    const [orderBy, setOrderBy] = useState({ key: 'name', type: 'asc' });
    const [isFocus, setIsFocus] = useState();
    const [showConclusion, setShowConclusion] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Optimized data fetching with useCallback
    const fetchData = useCallback(() => {
        const unsubscribePicker = pickersDataListener(
            updatedDocuments => {
                setPickers(updatedDocuments);
                setLoading(false);
                setRefreshing(false);
            },
            user?.phone,
            orderBy,
        );
        const unsubscribeGroup = groupsDataListener(updatedDocuments => {
            setGroups(updatedDocuments);
            setLoading(false);
            setRefreshing(false);
        }, orderBy);

        return () => {
            unsubscribePicker && unsubscribePicker();
            unsubscribeGroup && unsubscribeGroup();
        }; // Cleanup on unmount or dependency change
    }, [lang, activeTab, user?.phone, orderBy]);

    useFocusEffect(fetchData);

    const renderContent = () => (
        <Suspense fallback={<Loader visible={true} />}>
            {activeTab === strings.pickers_list ? (
                <PickerList
                    data={pickers}
                    groups={groups}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        fetchData();
                    }}
                />
            ) : activeTab === strings.group_list ? (
                <GroupList
                    data={groups}
                    pickers={pickers.filter(o => o?.uid === uid)}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        fetchData();
                    }}
                />
            ) : (
                <PickerDateWise
                    groups={groups}
                    pickers={pickers.filter(o => o?.uid === uid)}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        fetchData();
                    }}
                />
            )}
        </Suspense>
    );

    return (
        <BaseView>
            <Loader visible={loading} />
            <Header
                back
                label={strings.pickers} // Updated for localization
                rightComponent={
                    <Icon
                        name={showConclusion ? 'eye-off' : 'eye'}
                        size={20}
                        type="Ionicons"
                        onPress={() => setShowConclusion(!showConclusion)}
                    />
                }
            />
            {showConclusion && <PickersConclusion pickers={pickers} />}
            {!isFocus && (
                <Tabs
                    tabs={[strings.pickers_list, strings.group_list, strings.date_wise]} // Updated for localization
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}
            {activeTab !== strings.date_wise && (
                <PickerFilter
                    isFocus={isFocus}
                    setIsFocus={setIsFocus}
                    orderBy={orderBy}
                    pickers={pickers.filter(o => o?.uid === uid)}
                    groups={groups}
                    setOrderBy={setOrderBy}
                />
            )}
            {!isFocus && renderContent()}
            {!isFocus && (
                <View style={[common.row_btw, { marginTop: 20, position: 'absolute', bottom: 20 }]}>
                    <Button
                        iconLeft="plus"
                        label={strings.create_group} // Updated for localization
                        btnStyle={{
                            maxWidth: '48%',
                            width: 'auto',
                            left: -5,
                            ...common.shadow,
                        }}
                        onPress={() => navigate('CreatePickerGroup', { pickers: pickers.filter(o => o?.uid === uid), groups })}
                    />
                    <Button
                        iconLeft="plus"
                        label={strings.add_picker} // Updated for localization
                        btnStyle={{
                            maxWidth: '48%',
                            width: 'auto',
                            right: -5,
                            ...common.shadow,
                        }}
                        onPress={() => navigate('AddPicker')}
                    />
                </View>
            )}
        </BaseView>
    );
}

export default React.memo(Pickers);
