import React, { lazy, Suspense, useEffect, useState } from 'react';
import BaseView from '@container/base';
import { useLang } from '@context/langContext';
import { strings } from '@translations/locale';
import Button from '@components/button';
import { navigate } from '@navigation/ref';
import Loader from '@components/loader';
import Header from '@components/header';
import { common } from '@utils/style';
import { useCropTracker } from '@context/cropTrackerContext';
import Tabs from '@components/tabs';
import CropFilter from '@container/crop/cropFilter';
import _ from 'lodash'

// Lazy load CropList component
const CropList = lazy(() => import('@container/crop/cropList'));

export default function Crop() {
  const { lang } = useLang();
  const { myCrops, publicCrops, loading, getMyCrops, getPublicCrops } =
    useCropTracker();
  const [activeTab, setActiveTab] = useState(strings.private);
  const [orderBy, setOrderBy] = useState({ key: 'name', type: 'asc' });
  const [isFocus, setIsFocus] = useState();

  useEffect(() => {
    getMyCrops();
    getPublicCrops();
  }, [lang, activeTab]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header label={strings.crop_tracker} />
      <Tabs
        tabs={[strings.public, strings.private]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <CropFilter
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        orderBy={orderBy}
        crops={activeTab == strings.public ? publicCrops : myCrops}
        setOrderBy={setOrderBy}
      />
      {!isFocus ? <Suspense fallback={<Loader visible={true} />}>
        <CropList data={_.orderBy((activeTab == strings.public ? publicCrops : myCrops), [orderBy.key], [orderBy.type])} />
      </Suspense> : null}
      <Button
        iconLeft="plus"
        label={strings.add_crop}
        btnStyle={{
          maxWidth: '50%',
          width: 'auto',
          position: 'absolute',
          bottom: 20,
          right: -5,
          zIndex: 999,
          ...common.shadow,
        }}
        onPress={() => navigate('AddCrop')}
      />
    </BaseView>
  );
}
