import React, {lazy, Suspense, useEffect, useState} from 'react';
import BaseView from '@container/base';
import {useLang} from '@context/langContext';
import {strings} from '@translations/locale';
import Button from '@components/button';
import {navigate} from '@navigation/ref';
import Loader from '@components/loader';
import Header from '@components/header';
import {common} from '@utils/style';
import {useCropTracker} from '@context/cropTrackerContext';
import _ from 'lodash';
import {useIsFocused} from '@react-navigation/native';
import Tabs from '@components/tabs';
import {PanResponder, View} from 'react-native';
import CropFilter from '@container/crop/cropFilter';

// Lazy load LandList component
const LandList = lazy(() => import('@container/crop/landList'));
const CropList = lazy(() => import('@container/crop/cropList'));

export default function Crop() {
  const {lang} = useLang();
  const isFocused = useIsFocused();
  const {myLands, loading, getMyLands, myCrops, getMyCrops} = useCropTracker();
  const [activeTab, setActiveTab] = useState(strings.farm);
  const [isFocus, setIsFocus] = useState();
  const [orderBy, setOrderBy] = useState({key: 'name', type: 'asc'});

  useEffect(() => {
    if (isFocused) {
      getMyLands();
      getMyCrops();
    }
  }, [lang, isFocused]);

  const panResponder = PanResponder.create({
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dx > 150) {
        if (activeTab === strings.crop) {
          setActiveTab(strings.farm);
        }
      } else if (gestureState.dx < -150) {
        if (activeTab == strings.farm) {
          setActiveTab(strings.crop);
        }
      }
    },
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
  });

  console.log('-------');
  return (
    <BaseView>
      <Loader visible={loading} />
      <Header label={strings.crop_tracker} />
      <Tabs
        tabs={[strings.farm, strings.crop]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {strings.crop == activeTab ? (
        <CropFilter
          isFocus={isFocus}
          setIsFocus={setIsFocus}
          orderBy={orderBy}
          crops={myCrops}
          setOrderBy={setOrderBy}
        />
      ) : null}
      {!isFocus ? (
        <Suspense fallback={<Loader visible={true} />}>
          <View style={{flex: 1}} {...panResponder.panHandlers}>
            {activeTab == strings.crop ? (
              <CropList
                data={_.orderBy(myCrops, [orderBy.key], [orderBy.type])}
              />
            ) : (
              <LandList data={_.orderBy(myLands, ['name'], ['asc'])} />
            )}
          </View>
        </Suspense>
      ) : null}
      <Button
        iconLeft="plus"
        label={strings.add_land}
        btnStyle={{
          maxWidth: '50%',
          width: 'auto',
          position: 'absolute',
          bottom: 20,
          right: -5,
          zIndex: 999,
          ...common.shadow,
        }}
        onPress={() => navigate('AddLand')}
      />
    </BaseView>
  );
}
