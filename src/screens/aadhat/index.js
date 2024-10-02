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
import { aadhatDataListener, deleteAadhatCollection } from '@network/aadhat-service';
import AadhtiyaConclusionCard from '@container/aadhat/aadhtiyaConclusionCard';
import Loader from '@components/loader';
import { common } from '@utils/style';
import DeleteModal from '@container/deleteModal';
import { aadhatHTMLFormat } from '@html/aadhat';
import { wp } from '@utils/fonts';
import Text from '@components/text';

export default function Aadhat() {
  const { lang } = useLang();
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchData = useCallback(() => {
    const unsubscribeFunctions = [];
    const unsubscribe = aadhatDataListener(updatedDocuments => {
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
      await deleteAadhatCollection(data[0]?.id);
      ToastSuccess(strings.amount_deleted, strings.amount);
    } catch (error) {
      ToastError(error?.message, strings.loan);
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  const onShare = async () => {
    if (!user?.name) {
      ToastError(strings.complete_profile);
      navigate('EditProfile');
      return;
    }
    const html = aadhatHTMLFormat(strings, user, data[0]);
    const options = {
      html,
      base64: true,
      fileName: strings.aadhatiya_hisab,
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      await Share.open({
        url: `data:application/pdf;base64,${file?.base64}`,
        type: 'application/pdf',
        title: strings.aadhatiya_hisab,
        saveToFiles: true,
        showAppsToView: true,
        filename: strings.aadhatiya_hisab,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader visible={loading} />;
  }

  const headerLabel = data.length ? `${data[0]?.name} ${strings.aadhtiya}` : strings.aadhatiya_hisab;

  return (
    <BaseView>
      <Header
        label={headerLabel}
        share={data.length > 0 && data[0]?.id}
        deleteIcon={data.length > 0 && data[0]?.id}
        onDeletePress={() => setOpenModal(true)}
        onSharePress={onShare}
      />
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: wp(2), paddingBottom: 100, flexGrow: 1 }}
      >
        {data.length ? (
          <AadhtiyaConclusionCard data={data} />
        ) : (
          <Text center style={{ marginTop: 20 }}>{strings.no_data}</Text>
        )}
      </ScrollView>
      <View style={[common.row_btw, { marginTop: 20, position: 'absolute', bottom: 20 }]}>
        {data.length ? (
          <>
            <Button
              iconLeft="plus"
              label={strings.add_transaction}
              btnStyle={{ maxWidth: '48%', width: 'auto', left: -5, ...common.shadow }}
              onPress={() => navigate('AddTransaction', { data: data[0], isCrop: false })}
            />
            <Button
              iconLeft="plus"
              label={strings.add_crop}
              btnStyle={{ maxWidth: '48%', width: 'auto', right: -5, ...common.shadow }}
              onPress={() => navigate('AddTransaction', { data: data[0], isCrop: true })}
            />
          </>
        ) : (
          <Button
            label={strings.add_aadhatiya}
            iconLeft="plus"
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
      </View>
      <DeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data[0]}
        onDelete={onDelete}
      />
    </BaseView>
  );
}
