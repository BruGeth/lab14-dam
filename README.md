# 📱 LocalReminderApp

Este proyecto es una aplicación móvil desarrollada con **React Native** y **Expo**, enfocada en la gestión de notificaciones programadas. Utiliza librerías como `expo-notifications`, `expo-device` y `@react-native-async-storage/async-storage` para ofrecer una experiencia fluida y moderna.

## 🚀 Características

- Programación de notificaciones locales con fecha y hora específicas.
- Manejo de permisos de notificaciones.
- Persistencia de datos con `AsyncStorage`.
- Compatibilidad con dispositivos móviles mediante `expo-device`.

## 📄 Estructura del Proyecto

```
lab14-dam/
├── assets/
├── .gitignore
├── App.js
├── App.json
├── index.js
├── package-lock.json
└── package.json
```

## 📸 Capturas de Pantalla

| Configurar Recordatorio |  Recordatorio Programado |
|--------|------------------------|
| ![Configurar_Recordatorio](https://github.com/user-attachments/assets/77f95714-32bc-4a1a-8c87-ab5f100addba) | ![Recordatorio_Programado](https://github.com/user-attachments/assets/12346225-1db6-4bef-89dd-19422e06b0f5) |

| Lista de Recordatorios | Notificación Recibida |
|------------------------|---------------|
| ![Lista_de_Recordatorios](https://github.com/user-attachments/assets/2a94bdec-182a-46f9-bfa9-08a39ecbcdde) | ![Notificacion_Recibida](https://github.com/user-attachments/assets/df834fe1-3419-4be1-b548-dfe00355ec63) |

## 🛠️ Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/BruGeth/lab14-dam.git
   cd lab14-dam
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el proyecto con Expo:

   ```bash
   npx expo start
   ```

## 📦 Dependencias principales

- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [expo-device](https://docs.expo.dev/versions/latest/sdk/device/)
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
