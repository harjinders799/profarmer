import {
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { load } from 'react-native-cheerio';
import Text from '../../components/text';
import { strings } from 'src/translations/locale';
import { green, red, white } from '../../utils/color';
import Icon from '../../components/icon';
import { useCotton } from '../../context/cottonContext';
import { saveCottonPriceData } from '../../sql';
const baseUrl = 'https://www.commodityonline.com/mandiprices/cotton/rajasthan';

export const getPrice = async () => {
    try {
        const res = await fetch(baseUrl);
        const html = await res.text();
        const $ = load(html);
        const dataArray = [];
        $('#main-table2 tbody tr').each((index, element) => {
            const columns = $(element).find('td');
            const arrivalDate = $(columns[1]).text().trim();
            const district = $(columns[4]).text().trim();
            const market = $(columns[5]).text().trim();
            const minPrice = $(columns[6]).text().trim();
            const maxPrice = $(columns[7]).text().trim();

            // Create an object with extracted data and push it to the array
            dataArray.push({
                arrivalDate,
                district,
                market,
                minPrice,
                maxPrice,
            });
        });
        return dataArray;
    } catch (error) {
        console.log(error, '---error-------');
    }
};
const MandiPrice = () => {
    const { cottonPrice, db, getCottonPrice } = useCotton();

    useEffect(() => {
        getCottonPrice();
        (async () => {
            let res = await getPrice();
            if (Array.isArray(res)) {
                await saveCottonPriceData(db, res.reverse());
                getCottonPrice();
            }
        })();
    }, []);

    return Array.isArray(cottonPrice) && cottonPrice.length ? (
        <View style={[styles.list]}>
            <Text h3 style={styles.header}>
                {strings.cotton_price}
                {/* Cotton Price */}
            </Text>
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
            <View style={{ flexDirection: 'row' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {cottonPrice.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Text h4>
                                {item?.market}({item?.district})
                            </Text>
                            <Text h4 style={{ color: green }}>
                                {item?.maxPrice.replace('/ Quintal', 'max')}
                            </Text>
                            <Text h4 style={{ color: red }}>
                                {item?.minPrice.replace('/ Quintal', 'min')}
                            </Text>
                            <Text h5>{item?.arrivalDate}</Text>
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
    },
    card: {
        height: 100,
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
