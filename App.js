import * as Notificacions from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform ,StyleSheet, Text, View, TextInput, Button } from 'react-native';

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
      <Text style={styles.label}>Ingresa el titulo de tu recordatorio</Text>
      <TextInput 
      style={styles.input} 
      placeholder="Titulo"
      />

      <Text style={styles.label}>Tiempo en segundos: </Text>
      <TextInput 
      style={styles.input} 
      placeholder="Segundos (ej. 10)" 
      keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
      />

      <View style={styles.buttonContainer}>
        <Button 
        title="Crear Recordatorio"
        />
      </View>
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
