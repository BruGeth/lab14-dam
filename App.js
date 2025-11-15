import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
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

Notifications.setNotificationHandler({
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
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permiso denegado', 'Activa notificaciones para usar recordatorios.');
    }
  }

  async function saveReminders(newList) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Error guardando recordatorios', e);
    }
  }

  async function loadReminders() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const list = json ? JSON.parse(json) : [];
      setReminders(list);
    } catch (e) {
      console.error('Error cargando recordatorios', e);
    }
  }

  async function scheduleNotification() {
    const secs = Number(seconds);
    if (!title.trim()) {
      Alert.alert('Error', 'Ingresa un título para el recordatorio.');
      return;
    }
    if (!secs || secs <= 0) {
      Alert.alert('Error', 'Ingresa un tiempo en segundos mayor que 0.');
      return;
    }

    try {
      // Crear una fecha absoluta para que la notificación ocurra después de `secs` segundos
      const triggerDate = new Date(Date.now() + secs * 1000);

      const scheduledId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title.trim(),
          body: `Recordatorio en ${secs} segundos.`,
          sound: true,
        },
        // Usar fecha absoluta en lugar de { seconds: secs }
        trigger: triggerDate,
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
      Alert.alert('Listo', `Recordatorio programado en ${secs} segundos.`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo programar la notificación.');
    }
  }

  async function removeReminder(item) {
    Alert.alert(
      'Eliminar',
      `Eliminar recordatorio "${item.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (item.scheduledId) {
                await Notifications.cancelScheduledNotificationAsync(item.scheduledId);
              }
              const filtered = reminders.filter(r => r.id !== item.id);
              setReminders(filtered);
              await saveReminders(filtered);
            } catch (e) {
              console.error('Error eliminando recordatorio', e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  function renderItem({ item }) {
    return (
      <View style={styles.reminderItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.reminderTitle}>{item.title}</Text>
          <Text style={styles.reminderMeta}>{item.seconds}s • {new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => removeReminder(item)}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
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
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Tiempo en segundos</Text>
        <TextInput
          style={styles.input}
          placeholder="Segundos (ej. 10)"
          placeholderTextColor="#7a7a7a"
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          value={seconds}
          onChangeText={setSeconds}
        />

        <View style={styles.cardButtons}>
          <Button
            title="Crear Recordatorio"
            color={Platform.OS === 'ios' ? '#007AFF' : '#3b82f6'}
            onPress={scheduleNotification}
          />
        </View>
      </View>

      <Text style={styles.listHeader}>Recordatorios</Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay recordatorios.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    alignItems: 'stretch',
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 18,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 6,
    marginBottom: 6,
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    width: '100%',
    borderColor: '#e6edf8',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fbfdff',
    color: '#0b1220',
  },
  cardButtons: {
    marginTop: 14,
    width: '48%',
    alignSelf: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
  },
  listHeader: {
    width: '100%',
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748b',
    marginTop: 12,
    textAlign: 'center',
  },
  reminderItem: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    marginRight: 8,
    flexShrink: 1,
  },
  reminderMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  deleteButton: {
    marginLeft: 12,
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
});
