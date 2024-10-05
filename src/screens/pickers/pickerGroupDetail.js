import React, { lazy, Suspense, useCallback, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import BaseView from '@container/base';
import Header from '@components/header';
import Loader from '@components/loader';
import { getGroupMembersData } from '@network/picker-service';
import { ToastError } from '@utils/toast';
import { orderBy } from 'lodash'

const PickerList = lazy(() => import('@container/picker/pickerList'));

const PickerGroupDetail = () => {
    const {
        params: { item, pickers },
    } = useRoute();
    const [grpPickersData, setGrpPickersData] = useState([]);

    // Optimized data fetching with useCallback
    const fetchData = useCallback(() => {
        const fetchMembers = async () => {
            try {
                setGrpPickersData(await getGroupMembersData(item));
            } catch (error) {
                ToastError(error?.message);
            }
        };
        fetchMembers();
    }, [item]);

    useFocusEffect(fetchData);

    let grpPickers =
        Array.isArray(grpPickersData) && grpPickersData.length
            ? grpPickersData
            : pickers.filter(p => item.members.includes(p.id));

    return (
        <BaseView>
            <Header back label={item?.name} />
            <Suspense fallback={<Loader visible={true} />}>
                <PickerList data={orderBy(grpPickers, ['updatedAt'], ['desc'])} groups={[item]} />
            </Suspense>
        </BaseView>
    );
};

export default PickerGroupDetail;
