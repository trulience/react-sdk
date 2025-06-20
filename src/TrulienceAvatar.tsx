import React from 'react';
import TrulienceSDK from './default';

export interface TrulienceAvatarProps {
  avatarId: string;
  url?: string | undefined;
  token?: string | undefined;
  eventCallbacks?: { [event: string]: (eventData: any) => void };
  width?: string | number;
  height?: string | number;
  backgroundColor?: string; // If we need to add more style properties, we should add a styles object.
  avatarParams?: Record<string, any>;
  envParams?: Record<string, any>;
  autoConnect?: boolean;
  prefetchAvatar?: boolean;

  username?: string,
  enableAvatar?: boolean,
  retry?: any

  mediaStream?: MediaStream

  style?: React.CSSProperties
}


interface TrulienceAvatarState {
  trulience: any,
  mediaStreamObj?: MediaStream | null,
  localMediaStreamObj?: MediaStream | null
}


class TrulienceAvatar extends React.Component<TrulienceAvatarProps, TrulienceAvatarState> {
  state: TrulienceAvatarState = {
    trulience: null,
    mediaStreamObj: null,
    localMediaStreamObj: null,
  };

  remoteVideoId: string = 'remoteVideo';

  constructor(props: TrulienceAvatarProps) {
    super(props);
  }

  getTrulienceObject = () => {
    return this.state.trulience;
  };

  startAvatarSession = () => {
    if (!this.state.trulience) {
      console.log(
        'Ignoring startAvatarSession because trulience sdk is not setup.'
      );
      return;
    }

    // Register for the notifications
    this.state.trulience.on('auth-success', this.#authSuccessHandler.bind(this));
    this.state.trulience.on('auth-fail', this.#authFailHandler.bind(this));
    this.state.trulience.on(
      'websocket-connect',
      this.#connectHandler.bind(this)
    );
    this.state.trulience.on(
      'websocket-close',
      this.#disconnectHandler.bind(this)
    );
    this.state.trulience.on('websocket-error', this.#errorHandler.bind(this));

    // Trigger authentication
    this.state.trulience.authenticate();
  };

  stopAvatarSession = () => {
    try {
      if (this.state.trulience) {
        this.state.trulience.disconnectGateway();

        this.state.trulience.off(
          'auth-success',
          this.#authSuccessHandler.bind(this)
        );
        this.state.trulience.off('auth-fail', this.#authFailHandler.bind(this));
        this.state.trulience.off(
          'websocket-connect',
          this.#connectHandler.bind(this)
        );
        this.state.trulience.off(
          'websocket-close',
          this.#disconnectHandler.bind(this)
        );
        this.state.trulience.off(
          'websocket-error',
          this.#errorHandler.bind(this)
        );

        // this.trulience
        this.setState({ trulience: null });
        this.setState({ mediaStreamObj: null });
      }
    } catch (e) {
      console.error('error = ', e);
    }
  };

  setMediaStream(mediaStream: MediaStream) {
    console.log('In setMediaStream - mediaStream = ', mediaStream);
    if (mediaStream) {
      // Save the media stream.
      this.setState({ mediaStreamObj: mediaStream }, () => {
        // Check if can proceed
        if (this.state.trulience && this.state.mediaStreamObj) {
          if (
            this.state.trulience.getTGStatus() !==
            (TrulienceSDK.TGStatus as any).CONNECTED
          ) {
            console.log(
              'Avatar not yet connected with Trulience. Hence ignoring animateAvatar'
            );
            return;
          }

          // Get the audio track from the media stream
          const actualAudioTrack =
            this.state.mediaStreamObj.getAudioTracks()[0];
          if (!actualAudioTrack) {
            console.error('No audio track in the media stream');
            return;
          }

          this.state.trulience.setMediaStream(this.state.mediaStreamObj);
        }
      });
    } else {
      this.state.trulience?.setMediaStream(null);
      this.setState({ mediaStreamObj: null });
    }
  }

  setLocalMediaStream(mediaStream: MediaStream) {
    console.log('In setLocalMediaStream - mediaStream = ', mediaStream);
    if (mediaStream) {
      // Save the media stream.
      this.setState({ localMediaStreamObj: mediaStream }, () => {
        // Check if can proceed
        if (this.state.trulience && this.state.localMediaStreamObj) {
          if (
            this.state.trulience.getTGStatus() !==
            (TrulienceSDK.TGStatus as any)?.CONNECTED
          ) {
            console.log(
              'Avatar not yet connected with Trulience. Hence ignoring local stream'
            );
            return;
          }

          // Get the audio track from the media stream
          const actualAudioTrack =
            this.state.localMediaStreamObj.getAudioTracks()[0];
          if (!actualAudioTrack) {
            console.error('No audio track in the media stream');
            return;
          }

          this.state.trulience.setupVADForMediaStream(
            this.state.localMediaStreamObj
          );
        }
      });
    } else {
      this.state.trulience?.setupVADForMediaStream(null);
      this.setState({ localMediaStreamObj: null });
    }
  }

  sendMessage(message: any) {
    this.state.trulience?.sendMessage(message);
  }

  // Callback handlers
  #authSuccessHandler = (resp: any) => {
    // check if autoconnect is true, consider default true
    if (this.props.autoConnect !== false) {
      // Trigger connection to Trulience.
      this.state.trulience.connectGateway();
      return;
    }

    if (this.props.prefetchAvatar) {
      this.state.trulience.preloadAvatar(resp.avatarConfigUrl);
    }
  };

  #authFailHandler = (error: any) => {
    console.error('Auth failed: ', error);
  };

  #connectHandler = (resp: any) => {
    console.log('Trulience connected - ', this.state);
  };

  #disconnectHandler = (resp: any) => {
    console.log('Trulience disconnected - ', resp);
  };

  #errorHandler = (resp: any) => {
    console.error('Trulience error - ', resp);
  };

  // Component Lifecycle Methods
  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.trulience !== this.state.trulience) {
      if (prevState.trulience === null) {
        // Perform authentication
        this.startAvatarSession();
      }
    }
  }

  componentDidMount() {
    console.log('Creating TrulienceSDK Object');
    const trulienceSDK = new TrulienceSDK();
    this.setState({ mediaStreamObj: this.props.mediaStream });
    let videoElements = {
      remoteVideo: this.remoteVideoId,
    };

    let url = this.props.url ?? "https://trulience.com/sdk/trulience.sdk.js";
    let details = {
      avatarId: this.props.avatarId,
      token: this.props.token,
      username: this.props.username,
      enableAvatar: this.props.enableAvatar,
      retry: this.props.retry,
      videoElements: videoElements,
      eventCallbacks: this.props.eventCallbacks || {},
      envParams: this.props.envParams || {},
      avatarParams: this.props.avatarParams || {},
    };

    trulienceSDK
      .initSDK(url, details)
      .then((trulienceObj) => {
        // Save the trulience object.
        this.setState({ trulience: trulienceObj });
      })
      .catch((error) => {
        console.error(
          'Failed to create trulience object with url = ' + url + '. Error = ',
          error
        );
      });
  }

  componentWillUnmount() {
    this.stopAvatarSession();
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          width: this.props.width ?? '100%',
          height: this.props.height ?? '100%',
          backgroundColor: this.props.backgroundColor ?? '#333',
          ...this.props.style
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'absolute',
            left: '0',
            top: '0',
          }}
          id={this.remoteVideoId}
        ></div>
      </div>
    );
  }
}

export default TrulienceAvatar;
