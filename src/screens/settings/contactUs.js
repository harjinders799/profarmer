import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import BaseView from '@container/base';
import Logo from '@container/logo';
import Header from '@components/header';
import Icon from '@components/icon';
import Text from '@components/text';
import { green } from '@utils/colors';
import { strings } from '@translations/locale';

export default function ContactUs() {

  return (
    <BaseView space>
      <Header back label={"ProFarmer"} />
      <Logo />

      {/* Introduction Section */}
      <Text center style={styles.introduction}>
        {strings.assistanceMessage}
      </Text>

      <Text center style={styles.greeting}>
        {"Hello, Welcome!"}
      </Text>

      <Text style={styles.contactInfo}>
        {"Village Bhagsar\nShri Ganganagar (Raj.)\n9928185712"}
      </Text>

      <View style={styles.separator} />

      <Text style={styles.reachOutText}>
        {"You can reach us via:"}
      </Text>

      <View style={styles.iconContainer}>
        <Icon
          name='phone'
          color={green}
          type="FontAwesome"
          size={30}
          onPress={() => Linking.openURL('tel:9928185712').catch(err => console.error('An error occurred', err))}
        />
        <Icon
          name='whatsapp'
          color={green}
          type="FontAwesome"
          size={30}
          onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=+919928185712`)}
        />
        {/* Optional Email Icon */}
        <Icon
          name='envelope'
          color={green}
          type="FontAwesome"
          size={30}
          onPress={() => Linking.openURL('mailto:harjinders799@gmail.com')}
        />
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  introduction: {
    marginVertical: 15,
    fontSize: 16,
    color: '#333',  // Darker color for readability
    textAlign: 'center',
  },
  greeting: {
    marginTop: 10,
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contactInfo: {
    marginTop: 5,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc', // Light gray color for the separator
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
  reachOutText: {
    marginTop: "10%",
    textAlign: 'center',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginTop: "5%",
    alignSelf: 'center',
  },
});
