import * as Notificacions from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

Notificacions.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true -> deprecated
    // Use shouldShowBanner and shouldShowList instead
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
