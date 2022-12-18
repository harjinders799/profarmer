import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {black, white} from 'src/utils/color';
import Text from './text';
import Icon from './icon';
import {strings} from 'src/translations/locale';
import Modal from './Modal';
import {useTheme} from '@react-navigation/native';
import {useLang} from 'src/context/langContext';
import Button from './button';

const langs = [
  {code: 'pb', label: 'punjabi'},
  {code: 'hi', label: 'hindi'},
  {code: 'en', label: 'english'},
];
const LanguagePicker = props => {
  const {style} = props;
  const {lang, setLang} = useLang();
  const {colors} = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!lang?.code) setShow(true);
  }, [lang]);

  return (
    <View style={[styles.container, style]}>
      <Button
        label={strings.lang}
        btnStyle={[styles.btn]}
        onPress={() => setShow(!show)}
      />
      <Modal visible={show} setModalVisible={setShow} ratioHeight={0.3}>
        <View style={[styles.menu]}>
          {langs.map((v, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.main]}
              onPress={() => {
                setLang(v);
                setShow();
              }}>
              <Text h3 black style={[styles.txt]}>
                {strings[v?.label]}
              </Text>
              {strings.getLanguage() === v.code ? (
                <Icon name="check" size={25} color={colors.primary} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

export default LanguagePicker;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignSelf: 'flex-end',
  },
  btn: {
    width: 'auto',
    paddingHorizontal: 10,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
  },
  txt: {
    marginVertical: 5,
  },
  menu: {
    borderRadius: 5,
    marginVertical: 5,
  },
});
