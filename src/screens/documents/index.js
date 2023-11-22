import React, { useState } from 'react'
import Button from '../../components/button'
import { strings } from 'src/translations/locale';
import { Linking, PixelRatio, StyleSheet, View } from 'react-native';
import Icon from '../../components/icon';
import Text from '../../components/text';
import BaseView from '../../container/base';
import Logo from '../../container/logo';
import { green, white } from '../../utils/color';
import Header from '../../components/header';
import { goBack, navigate } from '../../navigation/ref';
import { useTheme } from '@react-navigation/native';
import DocumentList from '../../container/document/documentList';

export default function Documents() {
  const { colors } = useTheme()

  return (
    <BaseView>
      <Header
        leftComponent={
          <Icon
            name="back"
            size={28}
            onPress={() => goBack()}
          />
        }
      />
      <Logo />
      <DocumentList/>
      <Button
            iconName="cloudupload"
            iconColor={white}
            label={strings.uploade}
            btnStyle={{
              bottom:5,
            }}
            onPress={() => navigate('Uploade')}
          />
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