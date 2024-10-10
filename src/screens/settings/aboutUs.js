import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, View } from 'react-native';
import BaseView from '@container/base';
import { useTheme } from '@react-navigation/native';
import Header from '@components/header';
import Text from '@components/text';
import { strings } from 'src/translations/locale';
import { wp } from '@utils/fonts';
import Icon from '@components/icon';
import { common } from '@utils/style';
import { green } from '@utils/colors';

export default function AboutUs() {
    const { colors } = useTheme();

    return (
        <BaseView space>
            <Header back label={'Hi Farmer'} />
            <ScrollView
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}>
                <Text semi h4 center style={styles.complimentText}>
                    {strings.compliment}
                </Text>
                <Text bold center style={styles.compliment2Text}>
                    {strings.compliment2}
                </Text>
                <View style={common.row_center}>
                    <Icon
                        name="phone"
                        color={green}
                        type="FontAwesome"
                        size={30}
                        style={{ margin: 10, marginRight: 30 }}
                        onPress={() =>
                            Linking.openURL('tel:9928185712').catch(err =>
                                console.error('An error occurred', err),
                            )
                        }
                    />
                    <Icon
                        name="whatsapp"
                        color={green}
                        type="FontAwesome"
                        size={30}
                        onPress={() =>
                            Linking.openURL(
                                `https://api.whatsapp.com/send?phone=+919928185712`,
                            )
                        }
                    />
                </View>
                <Image
                    source={require('../../assets/upi.png')}
                    resizeMode="contain"
                    style={styles.image}
                />
            </ScrollView>
        </BaseView>
    );
}

const styles = StyleSheet.create({
    complimentText: {
        marginTop: 10,
        fontStyle: 'italic',
        width: '100%',
    },
    compliment2Text: {
        paddingTop: 20,
        fontStyle: 'italic',
        width: '100%',
    },
    image: {
        width: wp(100),
        height: wp(100),
        marginTop: 10,
    },
});
