import React, { useCallback, useState, memo, lazy, Suspense } from 'react';
import BaseView from '@container/base';
import { useLang } from '@context/langContext';
import { useFocusEffect } from '@react-navigation/native';
import { strings } from '@translations/locale';
import Button from '@components/button';
import { navigate } from '@navigation/ref';
import { getLabourData } from '@network/labour-service';
import Loader from '@components/loader';
import Header from '@components/header';

// Lazy load LabourList component
const LabourList = lazy(() => import('@container/labour/labourList'));

export default function Labour() {
  const { lang } = useLang();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Optimized data fetching with useCallback
  const fetchData = useCallback(() => {
    const unsubscribe = getLabourData(updatedDocuments => {
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
      <Header label={strings.labour_record} />
      <Suspense fallback={<Loader visible={true} />}>
        <LabourList data={data} />
      </Suspense>
      <Button
        iconLeft="plus"
        label={strings.new_labour}
        btnStyle={{
          maxWidth: '50%',
          position: 'absolute',
          bottom: 20,
          right: 30,
          zIndex: 999,
          elevation: 9
        }}
        onPress={() => navigate('NewLabour')}
      />
    </BaseView>
  );
}
