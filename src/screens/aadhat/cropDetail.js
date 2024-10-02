import React from 'react';
import BaseView from '@container/base';
import Text from '@components/text';
import { ScrollView, StyleSheet, View } from 'react-native';
import { white } from '@utils/colors';
import { useRoute, useTheme } from '@react-navigation/native';
import { strings } from '@translations/locale';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { common } from '@utils/style';
import AadhatTransacton from '@container/aadhat/aadhatTransaction';
import { currencyFormat } from '@utils/dateformat';

const { card, row_btw, shadow } = common;

export default function AadhatCropDetail() {
  const { colors } = useTheme();
  const {
    params: { data },
  } = useRoute();

  return (
    <BaseView>
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: '20%' }}
      >
        <Animated.View
          entering={FadeIn.delay(100)}
          style={[
            card,
            shadow,
            { backgroundColor: colors.success, margin: 10 },
          ]}
        >
          {renderDetailRow(strings.interest, data[0]?.interest_rate)}
          {renderDetailRow(strings.crop + ' / ' + strings.given_amount, data[0]?.totalGivenAmount)}
          {renderDetailRow(strings.total_interest, data[0]?.totalGivenAmountInterest)}
          {renderDetailRow(strings.total_amount, data[0]?.totalGivenAmountWithInterest)}
        </Animated.View>
        {Array.isArray(data[0]?.transactions) && data[0].transactions.length ? (
          data[0].transactions.map((item, i) => (
            <AadhatTransacton type="giver" key={i} data={data} item={item} />
          ))
        ) : (
          <Text>{strings.no_data}</Text>
        )}
      </ScrollView>
    </BaseView>
  );
}

const renderDetailRow = (label, value) => (
  <View style={[row_btw, { marginVertical: 10 }]}>
    <Text color={white} h4 entering={FadeInUp}>
      {label}
    </Text>
    <Text color={white} medium h4 entering={FadeInUp}>
      {currencyFormat(value)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: white,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 10,
    elevation: 5,
    marginVertical: 5,
    borderWidth: 3,
  },
});
