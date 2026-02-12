# ✅ Push Notifications - Configuração Completa

## Status Atual

✅ **FCM v1 configurado** no EAS  
✅ **`google-services.json`** adicionado ao projeto e aos secrets do EAS  
✅ **`app.json`** configurado com referência ao `google-services.json`  
✅ **`.gitignore`** protege o `google-services.json`  
✅ **Hook `usePushNotifications`** implementado  
✅ **Provider** configurado no app

---

## Estrutura de Ficheiros

```
mobile/
├── google-services.json          ← Firebase config (não commitar)
├── app.json                       ← Referência ao google-services
├── src/
│   ├── hooks/
│   │   └── usePushNotifications.ts  ← Hook principal
│   └── components/
│       └── PushNotificationProvider.tsx  ← Provider
```

---

## Como Testar Push Notifications

### 1. Fazer Build de Produção

```bash
# Build preview (APK)
eas build -p android --profile preview

# Ou production (AAB)
eas build -p android --profile production
```

⚠️ **Importante:** Push notifications **NÃO funcionam** no Expo Go. Precisa de build standalone.

### 2. Instalar o APK no Telemóvel

Quando o build terminar:

1. Escaneia o QR code que aparece
2. Ou acede ao link no telemóvel
3. Instala o APK

### 3. Obter o Expo Push Token

Quando abrires a app e fizeres login, o token será:

- Gerado automaticamente
- Enviado para o backend (`POST /push-tokens`)
- Logged no console (podes ver com `adb logcat` ou no Sentry)

### 4. Testar Notificação Manual

Podes testar enviando uma notificação de teste usando a ferramenta do Expo:

**Via Web:** https://expo.dev/notifications

**Via curl:**

```bash
curl -H "Content-Type: application/json" \
     -X POST https://exp.host/--/api/v2/push/send \
     -d '{
       "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
       "title": "🔥 Teste Athlifyr",
       "body": "Push notifications a funcionar!",
       "data": {
         "type": "test",
         "screen": "/feed"
       }
     }'
```

**Via Node.js:**

```javascript
const axios = require("axios");

const sendPushNotification = async (expoPushToken) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "🏃‍♂️ Nova Mensagem",
    body: "Tens uma nova mensagem no chat!",
    data: {
      type: "chat_message",
      conversationId: "123",
      route: "/chat/123",
    },
  };

  await axios.post("https://exp.host/--/api/v2/push/send", message);
};

// Exemplo
sendPushNotification("ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]");
```

---

## Backend Integration

O teu backend deve:

### 1. Guardar o Token quando enviado

```javascript
// POST /push-tokens
{
  "token": "ExponentPushToken[xxx]",
  "platform": "android",
  "deviceId": "device123"
}
```

### 2. Enviar Notificações quando necessário

Por exemplo, quando há uma nova mensagem:

```javascript
// Quando alguém envia mensagem
const recipient = await getUserById(recipientId);
const expoPushToken = await getPushTokenForUser(recipient.id);

if (expoPushToken) {
  await sendPushNotification({
    to: expoPushToken,
    title: `${sender.name} enviou uma mensagem`,
    body: message.text,
    data: {
      type: "chat_message",
      conversationId: conversation.id,
    },
  });
}
```

---

## Tipos de Notificações Implementadas

### 1. Chat Messages

```javascript
{
  "type": "chat_message",
  "conversationId": "123",
  "messageId": "456"
}
```

➡️ Navega para `/chat/123`

### 2. Event Date Changes

```javascript
{
  "type": "event_date_change",
  "eventSlug": "marathon-2026",
  "oldDate": "2026-03-15",
  "newDate": "2026-03-20"
}
```

➡️ Navega para `/events/marathon-2026`

### 3. Event Cancelled

```javascript
{
  "type": "event_cancelled",
  "eventSlug": "marathon-2026"
}
```

➡️ Navega para `/events/marathon-2026`

### 4. Custom Route

```javascript
{
  "route": "/profile/123"
}
```

➡️ Navega para a rota especificada

---

## Notification Channels (Android)

Já configurados:

### 1. **chat-messages**

- Importance: HIGH
- Vibração: [0, 250, 250, 250]
- Som: default

### 2. **event-updates**

- Importance: HIGH
- Vibração: [0, 250, 250, 250]
- Som: default
- Cor: #4F46E5

---

## Debugging

### Ver logs no Android:

```bash
adb logcat | grep -i "notification\|push\|expo"
```

### Ver token no app:

No código, o token é logged quando é gerado:

```typescript
console.log("Push token:", expoPushToken);
```

### Testar permissões:

```typescript
const { status } = await Notifications.getPermissionsAsync();
console.log("Permission status:", status);
```

---

## Troubleshooting

### ❌ "Push notifications only work on physical devices"

➡️ Tens de testar num telemóvel real, não funciona no emulador

### ❌ "Push notifications require a development build"

➡️ Estás no Expo Go. Faz `eas build` e instala o APK

### ❌ Token não é gerado

1. Verifica se o `google-services.json` está na raiz
2. Verifica se o `package` no `app.json` é igual ao do Firebase Console
3. Faz rebuild: `eas build -p android --profile preview --clear-cache`

### ❌ Notificações não chegam

1. Verifica se o token foi enviado para o backend
2. Testa com a ferramenta Expo (https://expo.dev/notifications)
3. Verifica se o `projectId` no código está correto

---

## Next Steps

1. ✅ Fazer build: `eas build -p android --profile preview`
2. ✅ Instalar no telemóvel
3. ✅ Fazer login
4. ✅ Copiar o token que aparece nos logs
5. ✅ Testar envio de notificação com curl ou https://expo.dev/notifications
6. ✅ Implementar envio de notificações no backend

---

## Recursos

- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Expo Push Notification Tool](https://expo.dev/notifications)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
