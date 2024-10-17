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
import {
    TourGuideProvider, // Main provider
    TourGuideZone, // Main wrapper of highlight component
    useTourGuideController, // hook to start, etc.
} from 'rn-tourguide';
import { white } from '@utils/colors';
import { storage } from '@utils/helper';
import { isIOS } from '@utils/constants';
import { Tooltip } from '@components/tooltip';
import PickersSettingModal from '@container/picker/pickersSettingModal';

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
    // Use Hooks to control!
    const {
        canStart, // a boolean indicate if you can start tour guide
        start, // a function to start the tourguide
        stop, // a function  to stopping it
        eventEmitter, // an object for listening some events
    } = useTourGuideController();

    // Can start at mount 🎉
    // you need to wait until everything is registered 😁
    React.useEffect(() => {
        if (canStart) {
            // 👈 test if you can start otherwise nothing will happen
            let res = storage.getBoolean('is_guide_done');
            if (!res) start();
        }
    }, [canStart]); // 👈 don't miss it!

    const handleOnStop = () => storage.set('is_guide_done', true);

    React.useEffect(() => {
        eventEmitter.on('stop', handleOnStop);

        return () => {
            eventEmitter.off('stop', () => { });
        };
    }, []);

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
        setIsFocus(false);
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
                    <View style={common.row_center}>
                        <Icon
                            name={'information-circle-outline'}
                            size={22}
                            type="Ionicons"
                            onPress={() => {
                                if (canStart) {
                                    // 👈 test if you can start otherwise nothing will happen
                                    start();
                                }
                            }}
                        />
                        <Icon
                            name={showConclusion ? 'eye-off' : 'eye'}
                            size={25}
                            type="Ionicons"
                            onPress={() => setShowConclusion(!showConclusion)}
                            style={{ marginHorizontal: 10 }}
                        />
                        <PickersSettingModal
                        />
                    </View>
                }
            />
            {showConclusion && <PickersConclusion pickers={pickers} />}
            {!isFocus && (
                <TourGuideZone zone={4} text={strings.tab_tour} style={{}}>
                    <Tabs
                        tabs={[strings.pickers_list, strings.group_list, strings.date_wise]} // Updated for localization
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </TourGuideZone>
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
            <View
                style={[
                    common.row_btw,
                    { marginTop: 20, position: 'absolute', bottom: 20 },
                ]}>
                <TourGuideZone
                    zone={3}
                    text={strings.create_group_tour}
                    borderRadius={10}
                    shape="rectangle"
                    style={{ width: 'auto', maxWidth: '48%' }}>
                    <Button
                        iconLeft="plus"
                        label={strings.create_group} // Updated for localization
                        btnStyle={{
                            left: -5,
                            ...common.shadow,
                        }}
                        onPress={() =>
                            navigate('CreatePickerGroup', {
                                pickers: pickers.filter(o => o?.uid === uid),
                                groups,
                            })
                        }
                    />
                </TourGuideZone>
                <TourGuideZone
                    zone={2}
                    text={strings.add_picker_tour}
                    borderRadius={10}
                    shape="rectangle"
                    style={{ width: 'auto', maxWidth: '48%' }}>
                    <Button
                        iconLeft="plus"
                        label={strings.add_picker} // Updated for localization
                        btnStyle={{
                            right: -5,
                            ...common.shadow,
                        }}
                        // onPress={() => {
                        //     if (canStart) {
                        //         // 👈 test if you can start otherwise nothing will happen
                        //         start();
                        //     }
                        // }}
                        onPress={() => navigate('AddPicker')}
                    />
                </TourGuideZone>
            </View>
        </BaseView>
    );
}

const PickerGuider = () => {
    const { colors } = useTheme();
    return (
        <TourGuideProvider
            {...{
                borderRadius: 10,
                backdropColor: colors.opposite + 99,
                verticalOffset: isIOS ? -5 : 30,
                animationDuration: 100,
                maskOffset: 0,
                // preventOutsideInteraction:true,
                tooltipStyle: {
                    backgroundColor: colors.background,
                },
                labels: {
                    previous: strings.previous,
                    next: strings.next,
                    skip: strings.skip,
                    finish: strings.finish,
                },
                tooltipComponent: Tooltip,
            }}>
            <Pickers />
        </TourGuideProvider>
    );
};

export default React.memo(PickerGuider);
