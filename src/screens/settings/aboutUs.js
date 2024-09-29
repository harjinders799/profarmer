import React, { useState } from 'react';
import { strings } from 'src/translations/locale';
import { Image, StyleSheet } from 'react-native';
import BaseView from '../../container/base';
import { useTheme } from '@react-navigation/native';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import Text from '@components/text';

export default function AboutUs() {
    const { colors } = useTheme();

    return (
        <BaseView space>
            <Header back label={'Hi Farmer'} />
            <Text
                h3
                style={{
                    marginTop: 10,
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: 20,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                }}>
                {`${strings.compliment}`}
            </Text>
            <Text
                h4
                style={{
                    paddingTop: 20,
                    textAlign: 'center',
                    fontSize: 20,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                }}>
                {strings.compliment2}
            </Text>
            <Image
                source={require('../../assets/upi.png')}
                resizeMode="contain"
                style={{ width: '100%', height: '35%', marginTop: 10, }}
            />
        </BaseView>
    );
}
const styles = StyleSheet.create({
    container: {},
});
