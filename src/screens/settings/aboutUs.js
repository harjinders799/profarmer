import React, { useState } from 'react'
import { strings } from 'src/translations/locale';
import { Image, StyleSheet, Text, View } from 'react-native';
import BaseView from '../../container/base';

export default function AboutUs() {
    return (
        <BaseView>

            <Text h3 style={{ marginTop: 10, justifyContent: "center", textAlign: 'center', fontSize: 20, fontStyle: "italic", fontWeight: "bold" }} >
                {`Hi Farmer \n\n${strings.compliment}`}
            </Text>
            <Text h4 style={{ paddingTop: 20, textAlign: 'center', fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
                {strings.compliment2}
            </Text>
            <Image
                source={require('../../assets/upi.png')}
                resizeMode="contain"
                style={{ width: '100%', height: '35%', marginTop: 10, }}
            />
        </BaseView>
    )
};
const styles = StyleSheet.create({
    container: {

    }
});