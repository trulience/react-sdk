// Type definitions for the Trulience library
interface TrulienceEnums {
  MessageType: {
    Auth: 0;
    Connect: 1;
    ChatText: 3;
    WebSocketLimitReached: 5;
    SocketPingPong: 6;
    Close: 7;
    WarningMessage: 8;
    MediaConnected: 19;
    UserTyping: 20;
    ChatHistory: 21;
  };
  CallEndReason: {
    HANGED_UP: 0;
    DISCONNECTED: 1;
    FAILED: 2;
    UNAUTHORISED: 3;
  };
  AvatarStatus: {
    IDLE: 0;
    TALKING: 1;
    LISTENING: 2;
    UNLOADED: 3;
    LOADED: 4;
    THINKING: 5;
    LOADING: 6;
  };
  DigitalHumanType: {
    CUSTOM: 0;
    METAHUMAN: 1;
    WEBGL: 2;
  };
  TGStatus: {
    DISCONNECTED: 0;
    CONNECTING: 1;
    CONNECTED: 2;
    TERMINATED: 3;
  };
}

// Type definitions for the Trulience library
export interface TrulienceClass extends TrulienceEnums {
  new (build?: TrulienceBuilder): TrulienceObject;
  Builder(): TrulienceBuilder;
}

// Extend Window interface to include Trulience
declare global {
  interface Window {
    Trulience: TrulienceClass;
  }
}

export interface TrulienceBuilder {
  setAvatarId(avatarId: string): TrulienceBuilder;
  setToken(token: string | null): TrulienceBuilder;
  setUserName(username: string): TrulienceBuilder;
  enableAvatar(enable: boolean): TrulienceBuilder;
  setRetry(retry: boolean): TrulienceBuilder;
  registerVideoElements(elements: VideoElements | null): TrulienceBuilder;
  setEnvParams(params: Record<string, any>): TrulienceBuilder;
  setAvatarParams(params: Record<string, any>): TrulienceBuilder;
  build(): TrulienceObject;
}

// Configuration interfaces
export interface VideoElements {
  remoteVideo: string;
}

export interface EventCallbacks {
  [eventName: string]: (...args: any[]) => void;
}

// Permission types
type PermissionType = 'mic' | string;

// TTS Configuration interface
interface TTSConfig {
  provider?: string;
  voiceId?: string;
  rate?: number;
  textType?: string;
  useSpeechmarkV2?: boolean;
  ntts?: boolean;
  pollyStyle?: string;
  speechSynthesisLanguage?: string;
  rvc?: boolean;
  enableCharTimes?: boolean;
  ignoreCache?: boolean;
  streamingEnabled?: boolean;
  sampleRate?: number;
  audioFormat?: string;
}

// Avatar preload configuration
interface AvatarConfig {
  [key: string]: any;
}

// Complete Trulience object interface based on the actual implementation
export interface TrulienceObject {
  // Audio Context related
  fixAudioContext(): void;

  // Realtime
  isRealtime(): boolean;

  // TTS Related
  setSpeechRecogLang(lang: string): void;

  // STT Related
  setSTTAddress(sttAddress: string): void;

  // Avatar Related
  isDHWebglBased(): boolean;
  isDHUnrealEngineBased(): boolean;
  is3DAvatar(): boolean;
  setDHType(dhType: any): void;
  setAvatarParams(params: Record<string, any>): void;
  preloadAvatar(configURL: string): void;

  // User Related Methods
  setUserId(uid: string): void;
  setUserName(userName: string): void;

  // OAuth Related
  isOauth(): boolean;

  // Authentication and Connection Related
  authenticate(): void;
  connectGateway(): void;
  disconnectGateway(reason?: string): void;
  getConnectionStatus(): any;

  // Utility Methods
  isConnected(): boolean;
  isPermissionGranted(permissionType: PermissionType): boolean;
  getPermissionStatus(permissionType: PermissionType):
    | string
    | {
        permissionGranted: boolean;
        state: string;
      };
  isMediaConnected(): boolean;

  // Messaging Related
  sendMessage(msg: string): void;
  sendMessageToAvatar(msg: string): void;
  sendUserTyping(isUserTyping: boolean): void;

  // Mic Related Methods
  setNeedMicAccess(needAccess: boolean): void;
  toggleMic(): void;
  setMicEnabled(status: boolean, userInteraction?: boolean): void;
  setLocalMicrophoneDevice(device: MediaDeviceInfo): Promise<void>;
  isMicEnabled(): boolean;

  // Speaker Related Methods
  toggleSpeaker(): void;
  setSpeakerEnabled(status: boolean): void;
  isSpeakerEnabled(): boolean;
  rtc(): any;

  // Events management
  on(eventName: string, fn: (...args: any[]) => void): void;
  off(eventName: string, fn: (...args: any[]) => void): void;
  emit(eventName: string, data?: any): void;

  // Media Stream handling
  setMediaStream(mediaStream: MediaStream): void;
  setWaitForUnmute(waitForUnmute: boolean): void;
  getWaitForUnmute(): boolean;
  stopAvatarSpeech(): any;
}
