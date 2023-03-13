import React, { useState } from 'react'
import Button from '../../components/button'
import { strings } from 'src/translations/locale';
import { Linking, StyleSheet, View } from 'react-native';
import Icon from '../../components/icon';
import Text from '../../components/text';
import BaseView from '../../container/base';
import Logo from '../../container/logo';
import { green } from '../../utils/color';

export default function ContactUs() {

  return (
    <BaseView>
      <Logo />
      <Text h2 style={{ marginTop: 25, width: '100%' }}>{`Hi Solution`}</Text>
      <Text style={{ marginTop: 5, width: '100%' }}>{`Village Bhagsar \nShri Ganganager (Raj.)\n9928185712`}</Text>
      <Text style={{ marginTop: "10%", }}>
        You Can Reach Out By....
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '50%', marginTop: "5%", }}>

        <Icon name='phone' color={green} type="FontAwesome" size={30} onPress={() => Linking.openURL('tel:9928185712').catch(err => console.error('An error occurred', err))} />
        <Icon name='whatsapp' color={green} type="FontAwesome" size={30} onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=+919928185712`)} />

      </View>
    </BaseView>
  )
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    fontSize: 15,
    margin: 10,
    fontWeight: "bold",
    paddingVertical: 5
  },
  footer: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'grey',
    margin: 20,
  },





});