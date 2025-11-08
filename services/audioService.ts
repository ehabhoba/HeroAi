// Audio service for decoding and playing raw PCM data from Gemini TTS API.

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        // The sample rate must match the TTS API's output.
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContext;
};

// Base64 decoding function as per guidelines
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Custom PCM audio data decoding function as per guidelines
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


/**
 * Decodes a base64 encoded string of raw PCM audio data and plays it.
 * @param base64Audio The base64 encoded string from Gemini TTS API.
 */
export const playBase64Audio = async (base64Audio: string): Promise<void> => {
    try {
        const ctx = getAudioContext();
        
        // Resume context if it's suspended (required by modern browsers)
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const audioBytes = decode(base64Audio);
        // Gemini TTS provides mono audio (1 channel) at 24000 sample rate
        const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();

    } catch (error) {
        console.error("Error playing audio:", error);
        throw error;
    }
};
