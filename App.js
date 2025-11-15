import { useEffect, useState } from 'react';
import * as Notificacions from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';

//Configurar el manejo de notificaciones  
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

const STORAGE_KEY = '@reminders';

export default function App() {
  const [title, setTitle] = useState('');
  const [seconds, setSeconds] = useState('');
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    registerForNotifications();
    loadReminders();
  }, []);

  //Solicitar permisos para notificaciones
  async function registerForNotifications() {
    if (!Device.isDevice) {
      Alert.alert('Nota', 'Las notificaciones locales funcionan mejor en un dispositivo físico.');
      return;
    }
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permiso denegado', 'Activa notificaciones para usar recordatorios.');
    }
  }

  async function saveReminders(list) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving reminders', e);
    }
  }

  async function loadReminders() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const list = json ? JSON.parse(json) : [];
      setReminders(list);
    } catch (e) {
      console.error('Error loading reminders', e);
    }
  }

async function scheduleNotification() {
  const secs = Number(seconds);
  if (!title.trim()) return Alert.alert('Error', 'Ingresa un título.');
  if (!secs || secs <= 0) return Alert.alert('Error', 'Ingresa segundos válidos.');

  try {
    const scheduledId = await Notifications.scheduleNotificationAsync({
      content: { title: title.trim(), body: `Recordatorio en ${secs} segundos.` },
      trigger: { seconds: secs },
    });

    const newReminder = {
      id: Date.now().toString(),
      title: title.trim(),
      seconds: secs,
      scheduledId,
      createdAt: new Date().toISOString(),
    };

    const updated = [newReminder, ...reminders];
    setReminders(updated);
    await saveReminders(updated);

    setTitle('');
    setSeconds('');
    Alert.alert('Listo', `Programado en ${secs} s`);
  } catch (e) {
    console.error(e);
    Alert.alert('Error', 'No se pudo programar.');
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ingresa el título de tu recordatorio</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#7a7a7a"
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Tiempo en segundos</Text>
        <TextInput
          style={styles.input}
          placeholder="Segundos (ej. 10)"
          placeholderTextColor="#7a7a7a"
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Crear Recordatorio"
          color={Platform.OS === 'ios' ? '#007AFF' : '#3b82f6'}
          onPress={scheduleNotification}
        />
      </View>

      <Text style={styles.listHeader}>Recordatorios</Text>

      <FlatList
        data={reminders}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderTitle}>{item.title}</Text>
              <Text style={styles.reminderMeta}>{item.seconds}s • {new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeReminder(item)}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay recordatorios.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 18,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 6,
    marginBottom: 6,
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
    color: '#111827',
  },
  buttonContainer: {
    marginTop: 18,
    width: '60%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});
