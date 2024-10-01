import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import BaseView from 'src/container/base';
import { useLang } from 'src/context/langContext';
import Header from 'src/components/header';
import { useFocusEffect } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import { ToastError, ToastSuccess } from '../../utils/toast';
import Button from '../../components/button';
import { navigate } from '../../navigation/ref';
import { useAuth } from '../../context/authContext';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  aadhatDataListener,
  deleteAadhatCollection,
} from '@network/aadhat-service';
import AadhtiyaConclusionCard from '@container/aadhat/aadhtiyaConclusionCard';
import Loader from '@components/loader';
import { common } from '@utils/style';
import DeleteModal from '@container/deleteModal';
import { aadhatHTMLFormat } from '@html/aadhat';
import { wp } from '@utils/fonts';
import Text from '@components/text';

export default function Aadhat() {
  const { lang } = useLang();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  // Optimized data fetching with useCallback
  const fetchData = useCallback(() => {
    const unsubscribeFunctions = [];
    const unsubscribe = aadhatDataListener(updatedDocuments => {
      console.log({ updatedDocuments });
      setData(updatedDocuments);
      setLoading(false);
    }, unsubscribeFunctions);
    return () => {
      if (unsubscribe) unsubscribe();
      unsubscribeFunctions.forEach(unsub => unsub());
    };
  }, [lang]);

  useFocusEffect(fetchData);

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteAadhatCollection(data[0].id);
      setLoading(false);
      ToastSuccess(strings.amount_deleted, strings.amount);
      setOpenModal(false);
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, strings.loan);
    }
  };

  const onShare = async () => {
    if (!user?.name) {
      ToastError('Please Complete your profile');
      navigate('EditProfile');
      return;
    }
    let html = aadhatHTMLFormat(strings, user, data[0]);
    const options = {
      html: html,
      base64: true,
      fileName: strings.aadhatiya_hisab,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    Share.open({
      url: `data:application/pdf;base64,${file?.base64}`,
      type: 'application/pdf',
      title: strings.aadhatiya_hisab,
      saveToFiles: true,
      showAppsToView: true,
      filename: strings.aadhatiya_hisab,
    })
      .then(res => console.log(res, '---res'))
      .catch(err => console.log(err, '----err'));
  };

  if (loading) {
    return <Loader visible={loading} />;
  }
  return (
    <BaseView>
      <Header
        label={
          Array.isArray(data) && data.length
            ? `${data[0]?.name} ${strings.aadhtiya}`
            : strings.aadhatiya_hisab
        }
        share={Array.isArray(data) && data.length > 0 && data[0].id}
        deleteIcon={Array.isArray(data) && data.length > 0 && data[0].id}
        onDeletePress={() => setOpenModal(true)}
        onSharePress={onShare}
      />
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: wp(2), paddingBottom: 100, flexGrow: 1 }}>
        {Array.isArray(data) && data.length ? (
          <AadhtiyaConclusionCard data={data} />
        ) : <Text center style={{ marginTop: 20 }}>{strings.no_data}</Text>}
      </ScrollView>
      {Array.isArray(data) && data.length ? (
        <View
          style={[
            common.row_btw,
            { marginTop: 20, position: 'absolute', bottom: 20 },
          ]}>
          <Button
            iconLeft="plus"
            label={'Add Transaction'}
            btnStyle={{ maxWidth: '48%', width: 'auto', left: -5, ...common.shadow }}
            onPress={() =>
              navigate('AddTransaction', { data: data[0], isCrop: false })
            }
          />
          <Button
            iconLeft="plus"
            label={'Add Crop'}
            btnStyle={{ maxWidth: '48%', width: 'auto', right: -5, ...common.shadow }}
            onPress={() =>
              navigate('AddTransaction', { data: data[0], isCrop: true })
            }
          />
        </View>
      ) : (
        <Button
          label={'Add Aadhatiya'}
          iconLeft="plus"
          // label={strings.new_labour}
          btnStyle={{
            maxWidth: '60%',
            width: 'auto',
            position: 'absolute',
            bottom: 20,
            right: -5,
            zIndex: 999,
            ...common.shadow,
          }}
          onPress={() => navigate('AddAadhatiya')}
        />
      )}
      <DeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data[0]}
        onDelete={onDelete}
      />
    </BaseView>
  );
}
