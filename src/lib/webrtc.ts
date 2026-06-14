export type WebRtcConfig = {
  turnServerUrl?: string;
  turnUsername?: string;
  turnPassword?: string;
  iceTransportPolicy?: RTCIceTransportPolicy;
};

export function createPeerConnection(config: WebRtcConfig = {}) {
  const iceServers: RTCIceServer[] = [];

  if (config.turnServerUrl) {
    iceServers.push({
      urls: config.turnServerUrl,
      username: config.turnUsername,
      credential: config.turnPassword
    });
  }

  return new RTCPeerConnection({
    iceServers,
    iceTransportPolicy: config.iceTransportPolicy ?? "all"
  });
}

export const mediaConstraints: MediaStreamConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user"
  }
};
