# @trulience/react-sdk

`@trulience/react-sdk` is a simple, React-based SDK that allows you to easily embed and control Trulience avatars in your web applications. Use it to connect, interact, and manage avatar sessions via a powerful and customizable `<TrulienceAvatar />` component.

---

## 📦 Installation

Install via npm or yarn:

```bash
npm install @trulience/react-sdk
# or
yarn add @trulience/react-sdk
```

---

## 🔧 Props

| Prop              | Type                                       | Description                                                           |
| ----------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `avatarId`        | `string`                                   | **(Required)** Unique ID of the avatar                                |
| `url`             | `string` _(optional)_                      | SDK host URL. Typically: `https://trulience.com/sdk/trulience.sdk.js` |
| `token`           | `string` _(optional)_                      | Optional authentication token                                         |
| `eventCallbacks`  | `{ [event: string]: (eventData) => void }` | Register callbacks for SDK events                                     |
| `width`           | `string` \| `number` _(optional)_          | Width of the avatar container                                         |
| `height`          | `string` \| `number` _(optional)_          | Height of the avatar container                                        |
| `backgroundColor` | `string` _(optional)_                      | Background color of the avatar container                              |
| `avatarParams`    | `Record<string, any>` _(optional)_         | Extra config for avatar initialization                                |
| `envParams`       | `Record<string, any>` _(optional)_         | Environment-specific configuration                                    |
| `autoConnect`     | `boolean` _(optional)_                     | Automatically connect avatar on load. **Default:** `true`             |
| `prefetchAvatar`  | `boolean` _(optional)_                     | Preload the avatar before connection                                  |

---

## 🧠 Ref Support & SDK Methods

The component supports `ref`, allowing direct access to the underlying Trulience SDK object via `getTrulienceObject()`.

Available methods on the Trulience object:

| Method                       | Description                                                |
| ---------------------------- | ---------------------------------------------------------- |
| `sendMessage(string)`        | Send SSML or chat input to the backend                     |
| `toggleMic()`                | Toggle the microphone on/off                               |
| `setMicEnabled(boolean)`     | Set mic state directly (`true` = unmuted, `false` = muted) |
| `toggleSpeaker()`            | Toggle speaker on/off                                      |
| `setSpeakerEnabled(boolean)` | Set speaker state directly                                 |
| `isMicEnabled()`             | Check if mic is enabled (returns `boolean`)                |
| `isSpeakerEnabled()`         | Check if speaker is enabled (returns `boolean`)            |

👉 Refer to the [Trulience SDK Docs – Methods](https://docs.trulience.com/docs/developer/sdk#trulience-class-methods) for more details.

---

## 📡 Events & `eventCallbacks`

You can register callbacks for important events using the `eventCallbacks` prop.

| Event Name             | Description                    | Parameters                      |
| ---------------------- | ------------------------------ | ------------------------------- |
| `auth-success`         | Authentication successful      | JSON object with server details |
| `auth-fail`            | Authentication failed          | JSON object with error details  |
| `mic-update`           | Microphone state changed       | `boolean` (`true`/`false`)      |
| `speaker-update`       | Speaker state changed          | `boolean` (`true`/`false`)      |
| `websocket-connect`    | WebSocket connected            | JSON object with server details |
| `websocket-message`    | Message received via WebSocket | JSON message object             |
| `websocket-error`      | WebSocket encountered an error | Error object                    |
| `websocket-close`      | WebSocket connection closed    | Close event details             |
| `load-progress`        | Avatar scene loading progress  | JSON object with progress info  |
| `avatar-status-update` | Avatar state has changed       | AvatarStatus value              |

👉 Refer to the [Trulience SDK Docs – Events](https://docs.trulience.com/docs/developer/sdk#events-system) for a full list of supported events.

---

## 💡 Example Usage

```tsx
import React, { useRef } from 'react';
import { TrulienceAvatar, TrulienceAvatarProps } from '@trulience/react-sdk';

const MyAvatarComponent = () => {
  const avatarRef = useRef<TrulienceAvatar>(null);

  // Event callbacks from the Trulience SDK
  const eventCallbacks: TrulienceAvatarProps['eventCallbacks'] = {
    'auth-success': (data: string) => {
      console.log('Authenticated successfully:', data);
    },
    'auth-fail': (error: { errorTitle: string }) => {
      console.error('Authentication failed:', error.errorTitle);
    },
  };

  const sendMicEnabled = (state: boolean) => {
    const trulienceObj = avatarRef.current?.getTrulienceObject();
    trulienceObj?.setMicEnabled(state);
  };

  const setSpeakerEnabled = (state: boolean) => {
    const trulienceObj = avatarRef.current?.getTrulienceObject();
    trulienceObj?.setSpeakerEnabled(state);
  };

  const sendMessage = (message: string) => {
    const trulienceObj = avatarRef.current?.getTrulienceObject();
    trulienceObj?.sendMessage(message);
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <TrulienceAvatar
        ref={avatarRef}
        url="https://trulience.com/sdk/trulience.sdk.js"
        avatarId="your-avatar-id" // 🔒 Replace with your real avatar ID
        token="your-auth-token" // 🔒 Use secure method for token
        eventCallbacks={eventCallbacks}
        width="100%"
        height="100%"
        backgroundColor="#ffffff"
      />
    </div>
  );
};
```

---

## 🧑‍💻 Local Development

To run and link this package locally, follow the instructions in [LOCAL_DEV.md](./LOCAL_DEV.md).

---

## 📁 Sample Projects

Refer to the [Sample Code Repository](https://github.com/trulience/react-sdk-sample) for a complete integration example.
