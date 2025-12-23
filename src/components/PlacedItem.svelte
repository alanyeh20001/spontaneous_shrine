<script>
  import { getItemById } from '../stores/shrine.svelte.js'

  let { item } = $props()
  let showMessage = $state(false)

  const itemInfo = $derived(getItemById(item.type))
</script>

<div
  class="placed-item"
  class:candle={item.type === 'candle'}
  class:bouquet={item.type === 'bouquet'}
  style="left: {item.x}%; top: {item.y}%;"
  onmouseenter={() => showMessage = true}
  onmouseleave={() => showMessage = false}
  role="img"
  aria-label={itemInfo?.name}
>
  <!-- 蠟燭火焰效果 -->
  {#if item.type === 'candle'}
    <div class="candle-container">
      <div class="flame">
        <div class="flame-inner"></div>
      </div>
      <div class="glow"></div>
    </div>
  {/if}

  <!-- 花束花瓣飄落效果 -->
  {#if item.type === 'bouquet'}
    <div class="petals-container">
      <div class="petal petal-1">🌸</div>
      <div class="petal petal-2">🌺</div>
      <div class="petal petal-3">🌸</div>
    </div>
  {/if}

  <span class="emoji">{itemInfo?.emoji}</span>

  {#if showMessage && item.message}
    <div class="message-bubble">
      <p>{item.message}</p>
    </div>
  {/if}
</div>

<style>
  .placed-item {
    position: absolute;
    transform: translate(-50%, -50%);
    font-size: 32px;
    cursor: default;
    transition: transform 0.2s ease;
    z-index: 10;
  }

  .placed-item:hover {
    transform: translate(-50%, -50%) scale(1.1);
    z-index: 20;
  }

  .emoji {
    display: block;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  /* Candle animation */
  .candle-container {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .flame {
    width: 12px;
    height: 20px;
    background: linear-gradient(to top, #ff6b35, #ffa500, #ffff00);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    animation: flicker 0.5s ease-in-out infinite alternate;
    position: relative;
  }

  .flame-inner {
    position: absolute;
    width: 6px;
    height: 12px;
    background: linear-gradient(to top, #fff, #fffacd);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
  }

  .glow {
    position: absolute;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, rgba(255, 165, 0, 0.4) 0%, transparent 70%);
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    animation: glow-pulse 2s ease-in-out infinite;
  }

  @keyframes flicker {
    0% {
      transform: scaleY(1) scaleX(1) rotate(-2deg);
      opacity: 1;
    }
    50% {
      transform: scaleY(1.1) scaleX(0.9) rotate(1deg);
      opacity: 0.9;
    }
    100% {
      transform: scaleY(0.95) scaleX(1.05) rotate(2deg);
      opacity: 1;
    }
  }

  @keyframes glow-pulse {
    0%, 100% {
      opacity: 0.6;
      transform: translateX(-50%) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translateX(-50%) scale(1.1);
    }
  }

  /* ========== 花束效果 ========== */
  .bouquet .emoji {
    animation: sway 3s ease-in-out infinite;
    transform-origin: bottom center;
  }

  .petals-container {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 60px;
    pointer-events: none;
    overflow: visible;
  }

  .petal {
    position: absolute;
    font-size: 10px;
    opacity: 0;
    animation: petal-fall 4s ease-in-out infinite;
  }

  .petal-1 {
    left: 0;
    animation-delay: 0s;
  }

  .petal-2 {
    left: 50%;
    animation-delay: 1.3s;
  }

  .petal-3 {
    left: 100%;
    animation-delay: 2.6s;
  }

  @keyframes sway {
    0%, 100% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(2deg);
    }
  }

  @keyframes petal-fall {
    0% {
      opacity: 0;
      transform: translateY(0) rotate(0deg) scale(0.8);
    }
    10% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      transform: translateY(50px) rotate(180deg) translateX(15px) scale(0.5);
    }
  }

  /* Message bubble */
  .message-bubble {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    white-space: nowrap;
    max-width: 200px;
    white-space: normal;
    text-align: center;
    margin-bottom: 8px;
    z-index: 100;
    animation: fadeIn 0.2s ease;
  }

  .message-bubble::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.85);
  }

  .message-bubble p {
    margin: 0;
    line-height: 1.4;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
