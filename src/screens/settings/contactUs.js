import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import BaseView from '@container/base';
import Logo from '@container/logo';
import Header from '@components/header';
import Icon from '@components/icon';
import Text from '@components/text';
import { green } from '@utils/colors';

export default function ContactUs() {

  return (
    <BaseView space>
      <Header back label={"ProFarmer"} />
      <Logo />
      <Text center style={styles.greeting}>{`Hi Solution`}</Text>
      <Text style={styles.contactInfo}>
        {`Village Bhagsar \nShri Ganganager (Raj.)\n9928185712`}
      </Text>
      <Text style={styles.reachOutText}>
        You Can Reach Out By....
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
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  greeting: {
    marginTop: 25,
    width: '100%',
    fontSize: 24,  // Adjust font size for better visibility
  },
  contactInfo: {
    marginTop: 5,
    width: '100%',
    textAlign: 'center',  // Center text for better layout
  },
  reachOutText: {
    marginTop: "10%",
    textAlign: 'center',  // Center text for consistency
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginTop: "5%",
    alignSelf: 'center',  // Center the icon container
  },
});
