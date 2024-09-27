import React, { lazy, Suspense } from 'react';
import { useRoute } from '@react-navigation/native';
import BaseView from '@container/base';
import Header from '@components/header';
import Loader from '@components/loader';
const PickerList = lazy(() => import('@container/picker/pickerList'));

const PickerGroupDetail = () => {
    const {
        params: { item, pickers },
    } = useRoute();

    let grpPickers = pickers.filter(p => item.members.includes(p.id));

    return (
        <BaseView>
            <Header back label={item?.name} />
            <Suspense fallback={<Loader visible={true} />}>
                <PickerList data={grpPickers} groups={[item]} />
            </Suspense>
        </BaseView>
    );
};

export default PickerGroupDetail;
