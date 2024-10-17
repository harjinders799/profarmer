import React, { lazy, Suspense, useCallback, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import BaseView from '@container/base';
import Header from '@components/header';
import Loader from '@components/loader';
import { getGroupMembersData } from '@network/picker-service';
import { ToastError } from '@utils/toast';
import { orderBy } from 'lodash'
import PickerFilter from '@container/picker/pickerFilter';

const PickerList = lazy(() => import('@container/picker/pickerList'));

const PickerGroupDetail = () => {
    const {
        params: { item, pickers },
    } = useRoute();
    const [grpPickersData, setGrpPickersData] = useState([]);
    const [isFocus, setIsFocus] = useState(false)
    const [orderByFilter, setOrderByFilter] = useState({
        key: 'updatedAt',
        value: 'desc'
    })

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

    let orderByPickers = orderBy(grpPickers, [orderByFilter.key], [orderByFilter.value])

    return (
        <BaseView>
            <Header back label={item?.name} />
            <PickerFilter
                isFocus={isFocus}
                setIsFocus={setIsFocus}
                orderBy={orderByFilter}
                pickers={orderByPickers}
                groups={[item]}
                setOrderBy={setOrderByFilter}
            />
            {isFocus ? null : <Suspense fallback={<Loader visible={true} />}>
                <PickerList data={orderByPickers} groups={[item]} />
            </Suspense>}
        </BaseView>
    );
};

export default PickerGroupDetail;
