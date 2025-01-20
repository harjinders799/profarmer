import React, {lazy, Suspense, useState} from 'react';
import {useRoute, useTheme} from '@react-navigation/native';
import {useCropTracker} from '@context/cropTrackerContext';
import Loader from '@components/loader';
import _ from 'lodash';
import BaseView from '@container/base';
import Header from '@components/header';
import Text from '@components/text';
import Tabs from '@components/tabs';
import {strings} from '@translations/locale';
import CropFilter from '@container/crop/cropFilter';
const CropList = lazy(() => import('@container/crop/cropList'));

const LandDetail = () => {
  const {getMyCrops, selectedLand, landCrops, myCrops} = useCropTracker();
  const [activeTab, setActiveTab] = useState(strings.private);
  const [orderBy, setOrderBy] = useState({key: 'name', type: 'asc'});
  const [isFocus, setIsFocus] = useState();
  console.log(landCrops, selectedLand);
  return (
    <BaseView>
      <Header
        back
        label={`${selectedLand?.name}`}
        rightComponent={
          <Text
            semi>{`${selectedLand?.totalArea} ${selectedLand?.areaUnit}`}</Text>
        }
      />
      <CropFilter
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        orderBy={orderBy}
        crops={landCrops}
        setOrderBy={setOrderBy}
      />
      {!isFocus ? (
        <Suspense fallback={<Loader visible={true} />}>
          <CropList
            data={_.orderBy(landCrops, [orderBy.key], [orderBy.type])}
          />
        </Suspense>
      ) : null}
    </BaseView>
  );
};

export default LandDetail;
