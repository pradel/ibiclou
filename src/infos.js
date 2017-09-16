import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import colors from './colors';

const Infos = () => (
  <View style={styles.container}>
    <Text style={styles.text}>
      Ibiclou is an open source project. If you would like to contribute or
      improve this project, please go to{' '}
      <Text
        style={styles.link}
        onPress={() => Linking.openURL('https://github.com/pradel/ibiclou')}
      >
        github
      </Text>
      .
    </Text>
    <Text style={styles.text}>
      Ibiclou uses the CityBikes API. You can find it{' '}
      <Text
        style={styles.link}
        onPress={() => Linking.openURL('https://api.citybik.es/')}
      >
        here
      </Text>
      .
    </Text>
    <Text style={styles.text}>
      Designed by{' '}
      <Text
        style={styles.link}
        onPress={() => Linking.openURL('http://www.quentinsaubadu.com/')}
      >
        Quentin Saubadu
      </Text>{' '}
      and developed by{' '}
      <Text
        style={styles.link}
        onPress={() => Linking.openURL('https://www.leopradel.com/')}
      >
        Léo Pradel
      </Text>
      .
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    color: colors.secondary,
    marginBottom: 10,
  },
  link: {
    color: colors.primary,
  },
});

export default Infos;
