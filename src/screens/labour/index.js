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
import { common } from '@utils/style';

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
          maxWidth: '60%',
          width: 'auto',
          position: 'absolute',
          bottom: 20,
          right: -5,
          zIndex: 999,
          ...common.shadow,
        }}
        onPress={() => navigate('NewLabour')}
      />
    </BaseView>
  );
}
