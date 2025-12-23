<script>
  import PlacedItem from './PlacedItem.svelte'
  import { getOverlayByHour } from '../utils/daynight.js'
  import { selectedItem } from '../stores/shrine.svelte.js'

  let { placedItems = [], onDrop } = $props()

  // Day/night cycle based on user's local time
  let currentHourState = $state(new Date().getHours())
  let overlay = $derived(getOverlayByHour(currentHourState))
  let isDragOver = $state(false)
  let showSwipeHint = $state(true)
  let canvasRef = $state(null)

  // Update every minute
  $effect(() => {
    const interval = setInterval(() => {
      currentHourState = new Date().getHours()
    }, 60000)
    return () => clearInterval(interval)
  })

  // Hide swipe hint after user scrolls
  function handleScroll() {
    if (showSwipeHint) {
      showSwipeHint = false
    }
  }

  // Auto-hide hint after a few seconds
  $effect(() => {
    const timer = setTimeout(() => {
      showSwipeHint = false
    }, 5000)
    return () => clearTimeout(timer)
  })

  function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    isDragOver = true
  }

  function handleDragLeave() {
    isDragOver = false
  }

  function handleDrop(event) {
    event.preventDefault()
    isDragOver = false

    const itemId = event.dataTransfer.getData('text/plain')
    if (!itemId) return

    // Get position relative to the canvas (scrollable background)
    const canvas = canvasRef
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    // getBoundingClientRect already accounts for scroll position
    const x = ((event.clientX - rect.left) / canvas.offsetWidth) * 100
    const y = ((event.clientY - rect.top) / canvas.offsetHeight) * 100

    onDrop?.({ type: itemId, x, y })
  }

  // Handle tap to place on mobile
  function handleClick(event) {
    if (!selectedItem.id) return

    // Get position relative to the canvas (scrollable background)
    const canvas = canvasRef
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    // getBoundingClientRect already accounts for scroll position
    const x = ((event.clientX - rect.left) / canvas.offsetWidth) * 100
    const y = ((event.clientY - rect.top) / canvas.offsetHeight) * 100

    onDrop?.({ type: selectedItem.id, x, y })
    selectedItem.id = null
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<div
  class="scene"
  class:drag-over={isDragOver}
  class:tap-mode={selectedItem.id}
  role="region"
  aria-label="祭壇場景"
>
  <div class="scroll-container" onscroll={handleScroll}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="canvas"
      bind:this={canvasRef}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
      onclick={handleClick}
    >
      <!-- Street background -->
      <div class="background"></div>

      <!-- Day/night overlay (also dims background to make items stand out) -->
      <div class="overlay" style="background: {overlay.background}; opacity: {overlay.opacity}"></div>

      <!-- Placed items -->
      {#each placedItems as item (item.id)}
        <PlacedItem {item} />
      {/each}
    </div>
  </div>

  <!-- Ground area indicator -->
  <div class="ground-hint" class:visible={isDragOver || selectedItem.id}>
    {selectedItem.id ? '點擊場景放置物品' : '放開以放置物品'}
  </div>

  <!-- Swipe hint for mobile -->
  <div class="swipe-hint" class:visible={showSwipeHint}>
    <span class="arrow">←</span>
    <span>左右滑動探索</span>
    <span class="arrow">→</span>
  </div>
</div>

<style>
  .scene {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .scene.drag-over .canvas,
  .scene.tap-mode .canvas {
    outline: 3px dashed rgba(74, 144, 217, 0.6);
    outline-offset: -3px;
  }

  .scene.tap-mode .canvas {
    cursor: crosshair;
  }

  .scroll-container {
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }

  .scroll-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }

  .canvas {
    position: relative;
    height: 100%;
    /* Desktop: same as viewport width */
    width: 100%;
    min-width: 100%;
  }

  .background {
    position: absolute;
    inset: 0;
    background-image: url('/background.webp');
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
  }

  .overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    transition: opacity 1s ease;
  }

  .ground-hint {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 10;
  }

  .ground-hint.visible {
    opacity: 1;
  }

  .swipe-hint {
    display: none;
  }

  /* Mobile: make canvas wider to allow scrolling */
  @media (max-width: 768px) {
    .canvas {
      /* Width = height * aspect ratio of background image */
      width: calc(100vh * 1.833);
      min-width: calc(100vh * 1.833);
    }

    .background {
      background-size: 100% 100%;
      background-position: center;
    }

    .swipe-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 12px 20px;
      border-radius: 24px;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 20;
    }

    .swipe-hint.visible {
      opacity: 1;
      animation: pulse 2s ease-in-out infinite;
    }

    .swipe-hint .arrow {
      animation: sway 1s ease-in-out infinite alternate;
    }

    .swipe-hint .arrow:last-child {
      animation-delay: 0.5s;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 0.6; }
    }

    @keyframes sway {
      from { transform: translateX(-3px); }
      to { transform: translateX(3px); }
    }

    .ground-hint {
      /* Keep hint visible while scrolling */
      position: fixed;
      bottom: calc(5% + 80px); /* Above the item panel */
    }
  }

  /* Landscape mobile - less scrolling needed */
  @media (max-width: 768px) and (orientation: landscape) {
    .canvas {
      width: 100%;
      min-width: 100%;
    }

    .background {
      background-size: cover;
    }

    .swipe-hint {
      display: none;
    }
  }

</style>
