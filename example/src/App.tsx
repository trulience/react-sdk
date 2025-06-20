import { TrulienceAvatar, type TrulienceAvatarProps } from '@trulience/react-sdk'
import { useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, MessageSquare, Play, Pause } from 'lucide-react';

function App() {
  const avatarRef = useRef<TrulienceAvatar>(null);
  const [connected, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabledState] = useState(true);
  const [message, setMessage] = useState('');
  const [, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const avatarId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("avatarId");
  }, []);

  // Event callbacks from the Trulience SDK
  const eventCallbacks: TrulienceAvatarProps['eventCallbacks'] = {
    'auth-success': (data: string) => {
      console.log('Authenticated successfully:', data);
      setConnectionStatus('connected');
    },
    'auth-fail': (error: { errorTitle: string }) => {
      console.error('Authentication failed:', error.errorTitle);
      setConnectionStatus('disconnected');
    },
  };

  const handleConnect = () => {
    setConnectionStatus('connecting');
    setConnected(true);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setConnectionStatus('disconnected');
  };

  const toggleMic = () => {
    const newState = !micEnabled;
    setMicEnabled(newState);
    const trulienceObj = avatarRef.current?.getTrulienceObject();
    trulienceObj?.setMicEnabled(newState);
  };

  const toggleSpeaker = () => {
    const newState = !speakerEnabled;
    setSpeakerEnabledState(newState);
    const trulienceObj = avatarRef.current?.getTrulienceObject();
    trulienceObj?.setSpeakerEnabled(newState);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const trulienceObj = avatarRef.current?.getTrulienceObject();
      trulienceObj?.sendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      default: return 'Disconnected';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e2e8f0'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1a202c',
      margin: 0
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '4px'
    },
    statusContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    statusDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: getStatusColor()
    },
    statusText: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    avatarId: {
      fontSize: '12px',
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
      padding: '4px 8px',
      borderRadius: '4px'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px'
    },
    connectContainer: {
      textAlign: 'center' as const
    },
    connectCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '48px',
      maxWidth: '400px',
      margin: '0 auto'
    },
    connectIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px'
    },
    connectTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1a202c',
      marginBottom: '16px'
    },
    connectDescription: {
      color: '#64748b',
      marginBottom: '32px',
      lineHeight: '1.6'
    },
    connectButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      fontWeight: '600',
      padding: '16px 32px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      transform: 'scale(1)'
    },
    connectedLayout: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: '24px',
      '@media (max-width: 1024px)': {
        gridTemplateColumns: '1fr'
      }
    },
    avatarContainer: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    avatarWrapper: {
      height: "100%",
      position: 'relative' as const
    },
    controlPanel: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px'
    },
    controlCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '24px'
    },
    controlTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    button: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: '500',
      border: '1px solid',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '14px'
    },
    micButton: (enabled: boolean) => ({
      ...styles.button,
      backgroundColor: enabled ? '#f0fdf4' : '#fef2f2',
      color: enabled ? '#166534' : '#dc2626',
      borderColor: enabled ? '#bbf7d0' : '#fecaca'
    }),
    speakerButton: (enabled: boolean) => ({
      ...styles.button,
      backgroundColor: enabled ? '#eff6ff' : '#f9fafb',
      color: enabled ? '#1d4ed8' : '#374151',
      borderColor: enabled ? '#dbeafe' : '#e5e7eb'
    }),
    textarea: {
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      resize: 'none' as const,
      fontSize: '14px',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    sendButton: (disabled: boolean) => ({
      ...styles.button,
      backgroundColor: disabled ? '#f3f4f6' : '#3b82f6',
      color: disabled ? '#9ca3af' : 'white',
      borderColor: disabled ? '#e5e7eb' : '#3b82f6',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1
    }),
    disconnectButton: () => ({
      ...styles.button,
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      borderColor: '#fecaca'
    })
  } as const;

  if (!avatarId) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <h2>Missing avatarId</h2>
        <p>Please provide <code>?avatarId=YOUR_ID</code> in the URL.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerTitle}>Trulience Avatar</h1>
            <p style={styles.headerSubtitle}>Interactive AI Avatar Experience</p>
          </div>
          <div style={styles.statusContainer}>
            <div style={styles.statusIndicator}>
              <div style={styles.statusDot} />
              <span style={styles.statusText}>
                {getStatusText()}
              </span>
            </div>
            <div style={styles.avatarId}>
              ID: {avatarId}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {!connected ? (
          <div style={styles.connectContainer}>
            <div style={styles.connectCard}>
              <div style={styles.connectIcon}>
                <Play color="white" size={32} style={{ marginLeft: '4px' }} />
              </div>
              <h2 style={styles.connectTitle}>Ready to Connect</h2>
              <p style={styles.connectDescription}>
                Click the button below to start your interactive session with the AI avatar.
              </p>
              <button
                style={styles.connectButton}
                onClick={handleConnect}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Connect to Avatar
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.connectedLayout}>
            {/* Avatar Display */}
            <div style={styles.avatarContainer}>
              <div style={styles.avatarWrapper}>
                <TrulienceAvatar
                  ref={avatarRef}
                  width="100%"
                  height="100%"
                  eventCallbacks={eventCallbacks}
                  avatarId={avatarId}
                  avatarParams={{
                    NativeBar: getProgressBarParams("#3b82f6")
                  }}
                />
              </div>
            </div>

            {/* Control Panel */}
            <div style={styles.controlPanel}>
              {/* Audio Controls */}
              <div style={styles.controlCard}>
                <h3 style={styles.controlTitle}>Audio Controls</h3>
                <div style={styles.buttonContainer}>
                  <button
                    onClick={toggleMic}
                    style={styles.micButton(micEnabled)}
                  >
                    {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                    {micEnabled ? 'Microphone On' : 'Microphone Off'}
                  </button>

                  <button
                    onClick={toggleSpeaker}
                    style={styles.speakerButton(speakerEnabled)}
                  >
                    {speakerEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    {speakerEnabled ? 'Speaker On' : 'Speaker Off'}
                  </button>
                </div>
              </div>

              {/* Message Input */}
              <div style={styles.controlCard}>
                <h3 style={styles.controlTitle}>
                  <MessageSquare size={20} />
                  Send Message
                </h3>
                <div style={styles.buttonContainer}>
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setIsTyping(e.target.value.length > 0);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    style={styles.textarea}
                    rows={3}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    style={styles.sendButton(!message.trim())}
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                </div>
              </div>

              {/* Session Controls */}
              <div style={styles.controlCard}>
                <h3 style={styles.controlTitle}>Session</h3>
                <button
                  onClick={handleDisconnect}
                  style={styles.disconnectButton()}
                >
                  <Pause size={16} />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getProgressBarParams = (loadingBarColor: string) => {
  return {
    enabled: true,
    style: {
      bar: {
        background: loadingBarColor,
      },
      container: {
        background: '#e5e7eb',
        'border-radius': '8px',
        'height': '8px'
      }
    }
  }
}

export default App;