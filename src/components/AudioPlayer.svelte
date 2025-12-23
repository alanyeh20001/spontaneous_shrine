<script>
  import { onMount } from 'svelte'

  let isPlaying = $state(false)
  let showPlayHint = $state(false)

  let audioContext = $state(null)
  let audioBuffer = $state(null)
  let sourceNode = $state(null)
  let gainNode = $state(null)
  let startTime = $state(0)
  let pausedAt = $state(0)

  const DEFAULT_VOLUME = 0.3
  const AUDIO_URL = '/audio/ambient.mp3'

  onMount(() => {
    showPlayHint = true
  })

  async function loadAudio() {
    if (audioBuffer) return

    const response = await fetch(AUDIO_URL)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  }

  function createSource() {
    sourceNode = audioContext.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.loop = true
    sourceNode.connect(gainNode)
  }

  async function togglePlay() {
    try {
      // 初始化 AudioContext（必須在用戶互動中）
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
        gainNode = audioContext.createGain()
        gainNode.gain.value = DEFAULT_VOLUME
        gainNode.connect(audioContext.destination)
      }

      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      // 載入音頻
      await loadAudio()

      // 切換播放/暫停
      if (isPlaying) {
        pausedAt = audioContext.currentTime - startTime
        sourceNode.stop()
        sourceNode = null
        isPlaying = false
      } else {
        createSource()
        const offset = pausedAt % audioBuffer.duration
        sourceNode.start(0, offset)
        startTime = audioContext.currentTime - offset
        isPlaying = true
      }

      showPlayHint = false
    } catch (err) {
      console.error('音頻播放錯誤:', err)
    }
  }
</script>

<div class="audio-player" class:has-hint={showPlayHint}>
  {#if showPlayHint}
    <span class="play-hint">點擊播放音樂 →</span>
  {/if}

  <button
    class="play-btn"
    class:pulse={showPlayHint}
    onclick={togglePlay}
    title={isPlaying ? '暫停音樂' : '播放音樂'}
  >
    {isPlaying ? '⏸️' : '🎵'}
  </button>

</div>

<style>
  .audio-player {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.6);
    padding: 8px 12px;
    border-radius: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .play-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgba(245, 245, 245, 0.4);
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .play-btn:hover {
    background: #e8e8e8;
    transform: scale(1.05);
  }

  .play-btn.pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(74, 144, 217, 0);
    }
  }

  .play-hint {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .audio-player {
      bottom: 12px;
      right: 12px;
      padding: 3px 3px;
    }

    .play-btn {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    .play-hint {
      display: none;
    }
  }
</style>
