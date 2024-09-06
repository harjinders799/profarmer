import React, { useCallback, useState, memo, lazy, Suspense } from 'react';
import BaseView from '@container/base';
import { useLang } from '@context/langContext';
import { useFocusEffect } from '@react-navigation/native';
import { strings } from '@translations/locale';
import Button from '@components/button';
import { navigate } from '@navigation/ref';
import Loader from '@components/loader';
import Header from '@components/header';
import { getCropData } from '@network/crop-service';

// Lazy load CropList component
const CropList = lazy(() => import('@container/crop/cropList'));

export default function Crop() {
  const { lang } = useLang();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Optimized data fetching with useCallback
  const fetchData = useCallback(() => {
    const unsubscribe = getCropData(updatedDocuments => {
      // console.log({ updatedDocuments });
      setData(updatedDocuments);
      setLoading(false);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [lang]);

  useFocusEffect(fetchData);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header label={strings.crop_hisab} />
      <Suspense fallback={<Loader visible={true} />}>
        <CropList data={data} />
      </Suspense>
      <Button
        iconLeft="plus"
        label={strings.add_crop}
        btnStyle={{
          maxWidth: '50%',
          position: 'absolute',
          bottom: 20,
          right: 30,
          zIndex: 999,
          elevation: 9
        }}
        onPress={() => navigate('AddCrop')}
      />
    </BaseView>
  );
}

