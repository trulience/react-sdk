import { TrulienceAvatar } from '@trulience/react-sdk'
import { useMemo, useState } from 'react';

function App() {
  const [connected, setConnected] = useState(false);

  const avatarId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("avatarId");
  }, []);

  if (!avatarId) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <h2>Missing avatarId</h2>
        <p>Please provide <code>?avatarId=YOUR_ID</code> in the URL.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: "24px",
        flexDirection: "column",
        width: "100vw"
      }}
    >
      <h1>Trulience Avatars</h1>

      {!connected ? (
        <button
          onClick={() => setConnected(true)}
          style={{
            fontSize: "1.2rem",
            padding: "12px 24px",
            cursor: "pointer",
            marginTop: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#007bff",
            color: "white"
          }}
        >
          Connect
        </button>
      ) : (
        <TrulienceAvatar
          width="min(1000px, 90%)"
          height="100%"
          style={{ aspectRatio: "16 / 9", marginTop: "24px" }}
          eventCallbacks={{
            "auth-success": () => { },
            "auth-fail": () => { },
            "load-progress": () => { }
          }}
          avatarId={avatarId}
          avatarParams={{
            NativeBar: getProgressBarParams("red")
          }}
        />
      )}
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
        background: '#e0e0de',
        'border-radius': '10px',
        'height': '10px'
      }
    }
  }
}

export default App
