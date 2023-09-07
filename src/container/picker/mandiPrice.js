import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { load } from 'react-native-cheerio';
import Text from '../../components/text';
import { green, red, white } from '../../utils/color';
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
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            let res = await getPrice();
            if (Array.isArray(res)) setData(res);
        })();
    }, []);
    return (
        <View style={[styles.list, { display: data.length ? 'flex' : 'none' }]}>
            <Text h3 style={styles.header}>Cotton Price</Text>
            <View style={{ flexDirection: 'row' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {data.map((item, index) => (
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
    );
};

export default MandiPrice;

const styles = StyleSheet.create({
    header: {
        margin: 10,
        marginBottom: 0,
        fontWeight: '600'
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
});
