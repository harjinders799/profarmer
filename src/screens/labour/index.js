import React, { useCallback, useState } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { useLang } from 'src/context/langContext';
import { useFocusEffect } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Button from '../../components/button';
import { navigate } from '../../navigation/ref';
import { getLabourData } from '../../network/labour-service';
import Loader from '../../components/loader';
import LabourList from '@container/labour/labourList';
import Header from '@components/header';

export default function Labour() {
  const { lang } = useLang();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = getLabourData(updatedDocuments => {
        console.log({ updatedDocuments })
        setData(updatedDocuments);
        setLoading(false)
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [lang]),
  );

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header
        label={strings.labour_record}
      />
      <LabourList data={data} />
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
