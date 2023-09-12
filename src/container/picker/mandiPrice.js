import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {load} from 'react-native-cheerio';
import Text from '../../components/text';
import {strings} from 'src/translations/locale';
import {green, red, white} from '../../utils/color';
import Icon from '../../components/icon';
import {useCotton} from '../../context/cottonContext';
import {saveCottonPriceData} from '../../sql';
import {sortBy} from 'lodash';
import moment from 'moment';
import {deletePrice, getPriceData} from '../../network/price-service';
import {currencyFormat, dateFormat} from '../../utils/dateformat';
import auth from '@react-native-firebase/auth';
import {navigate} from '../../navigation/ref';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../../components/loader';

const MandiPrice = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    try {
      let res = await getPriceData();
      setData(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (loading) return <Loader visible={loading} small style={{margin: 50}} />;

  return Array.isArray(data) && data.length ? (
    <View style={[styles.list]}>
      <Text h3 style={styles.header}>
        {strings.cotton_price}
        {/* Cotton Price */}
      </Text>
      {auth().currentUser?.uid === 'R40vMQnd92hukjoMcAL5Srfodcb2' ? (
        <Icon
          name={'plus'}
          size={25}
          style={[styles.share, {left: 10}]}
          onPress={() => navigate('AddPrice')}
        />
      ) : null}
      <TouchableOpacity
        style={styles.share}
        onPress={() =>
          Share.share(
            {
              title: 'ProFarmer App',
              message: `नमस्कार! मैंने एक शानदार ऐप का उपयोग किया है जो 'चुगारे, श्रमिक, और आढ़तिया हिसाब' को सुविधाजनक बनाता है। यह मेरे किसान दोस्तों के लिए एक बड़े काम का है! 🌾👨‍🌾📊

'चुगारे, श्रमिक, और आढ़तिया हिसाब' ऐप के साथ, आप चुगारे और श्रमिकों की जानकारी को आसानी से रेकॉर्ड कर सकते हैं और हिसाब रख सकते हैं, साथ ही खेती से जुड़े महत्वपूर्ण डेटा को भी सहेज सकते हैं।

इस उपयोगकर्ता-मित्र ऐप को आप और आपके परिवार और दोस्तों के साथ साझा करें और सहायता करें। यहां है ऐप का डाउनलोड लिंक:

https://play.google.com/store/apps/details?id=com.profarmer

कृपया इस महत्वपूर्ण उपकरण को अपने सभी किसान दोस्तों के साथ साझा करें ताकि उन्हें भी इसके फायदे मिल सकें। 🌾📈
`,
            },
            {
              dialogTitle: 'ProFarmer App',
            },
          )
        }>
        <Icon name="share" type="Entypo" size={25} />
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sortBy(data, d => moment(d.date)).map((item, index) => (
            <View key={index} style={styles.card}>
              {auth().currentUser?.uid === 'R40vMQnd92hukjoMcAL5Srfodcb2' ? (
                <>
                  <Icon
                    name={'delete'}
                    size={20}
                    style={[styles.share, {left: -5, top: -5, zIndex: 999}]}
                    onPress={async () => {
                      await deletePrice(item?.id);
                      getData;
                    }}
                  />
                  <Icon
                    name={'edit'}
                    size={20}
                    style={[styles.share, {right: -5, top: -5, zIndex: 999}]}
                    onPress={() => navigate('AddPrice', {data: item})}
                  />
                </>
              ) : null}

              <Text h3 style={{color: green}}>
                {currencyFormat(item?.maxPrice)} Max
              </Text>
              <Text h3 style={{color: red}}>
                {currencyFormat(item?.minPrice)} Min
              </Text>
              <Text h4>{item?.market.trim()}</Text>
              <Text h5 style={{marginTop: 4}}>
                {dateFormat(item?.date)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  ) : null;
};

export default MandiPrice;

const styles = StyleSheet.create({
  header: {
    margin: 10,
    marginBottom: 5,
    // fontWeight: '400',
    textAlign: 'center',
  },
  list: {
    marginHorizontal: -5,
    marginVertical: 5,
    width: '100%',
  },
  card: {
    margin: 5,
    elevation: 5,
    backgroundColor: white,
    padding: 10,
    borderRadius: 10,
  },
  share: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
});
