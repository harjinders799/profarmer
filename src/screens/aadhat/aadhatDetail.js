import React from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import { ScrollView, View } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Header from '../../components/header';
import { currencyFormat, interestFormat } from '../../utils/dateformat';
import { useAuth } from '../../context/authContext';
import Animated, { FadeIn } from 'react-native-reanimated';
import { common } from '@utils/style';
import AadhatTransacton from '@container/aadhat/aadhatTransaction';

const { card, row_btw } = common;

export default function AadhatDetail() {
  const { colors } = useTheme();
  const {
    params: { data },
  } = useRoute();

  return (
    <BaseView>
      <Header back label={strings.aadhatiya_hisab} />
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: '20%' }}>
        <Animated.View
          entering={FadeIn.delay(100)}
          style={[card, { backgroundColor: colors.error, margin: 10 }]}>
          <DetailRow
            label={strings.interest}
            value={interestFormat(data[0]?.interest_rate)}
          />
          <DetailRow
            label={strings.taken_amount}
            value={currencyFormat(data[0]?.totalReceivedAmount)}
          />
          <DetailRow
            label={strings.total_interest}
            value={currencyFormat(data[0]?.totalReceivedAmountInterest)}
          />
          <DetailRow
            label={strings.total_amount}
            value={currencyFormat(data[0]?.totalReceivedAmountWithInterest)}
          />
        </Animated.View>

        {Array.isArray(data[0]?.transactions) &&
          data[0].transactions.length > 0 ? (
          data[0].transactions.map((item, index) => (
            <AadhatTransacton
              key={index}
              type="receiver"
              data={data}
              item={item}
            />
          ))
        ) : (
          <Text center>{strings.no_data}</Text>
        )}
      </ScrollView>
    </BaseView>
  );
}

const DetailRow = ({ label, value }) => (
  <View style={[row_btw, { marginVertical: 10 }]}>
    <Text color="white" h4>
      {label}
    </Text>
    <Text color="white" medium h4>
      {value}
    </Text>
  </View>
);
