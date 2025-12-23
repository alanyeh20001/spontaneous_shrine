<script>
  import './app.css'
  import Scene from './components/Scene.svelte'
  import ItemPanel from './components/ItemPanel.svelte'
  import MessageModal from './components/MessageModal.svelte'
  import AudioPlayer from './components/AudioPlayer.svelte'
  import { placedItems, addPlacedItem, initShrine } from './stores/shrine.svelte.js'

  let showMessageModal = $state(false)
  let pendingPlacement = $state(null)
  let showMusicCredit = $state(false)

  // Initialize Firebase connection
  $effect(() => {
    initShrine()
  })

  function handleDrop(placement) {
    pendingPlacement = placement
    showMessageModal = true
  }

  function handleMessageSubmit(message) {
    if (pendingPlacement) {
      addPlacedItem({
        ...pendingPlacement,
        message,
        timestamp: Date.now()
      })
    }
    showMessageModal = false
    pendingPlacement = null
  }

  function handleMessageCancel() {
    showMessageModal = false
    pendingPlacement = null
  }
</script>

<main>
  <header class="title">
    <h1>北車中山憾事追悼</h1>
  </header>
  <Scene
    placedItems={placedItems.list}
    onDrop={handleDrop}
  />
  <ItemPanel />
  <AudioPlayer />

  {#if showMessageModal}
    <MessageModal
      itemType={pendingPlacement?.type}
      onSubmit={handleMessageSubmit}
      onCancel={handleMessageCancel}
    />
  {/if}

  <footer class="music-credit">
    <span class="credit-text">
      Music: <a href="https://onsound.eu/" target="_blank" rel="noopener">Alex-Productions</a> - Dramatic Story
      (<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>)
    </span>
    <button class="credit-toggle" onclick={() => showMusicCredit = !showMusicCredit}>
      ℹ️
    </button>
    {#if showMusicCredit}
      <div class="credit-popup">
        <p><strong>Dramatic Story</strong></p>
        <p>by <a href="https://onsound.eu/" target="_blank" rel="noopener">Alex-Productions</a></p>
        <p><a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a></p>
      </div>
    {/if}
  </footer>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    text-align: center;
    padding: 1rem;
    pointer-events: none;
  }

  .title h1 {
    margin: 0;
    font-family: 'Noto Serif TC', serif;
    font-size: 2rem;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    font-weight: 600;
    letter-spacing: 0.15em;
  }

  .music-credit {
    position: absolute;
    bottom: 8px;
    left: 12px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    z-index: 50;
  }

  .music-credit a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
  }

  .music-credit a:hover {
    color: #fff;
    text-decoration: underline;
  }

  .credit-toggle {
    display: none;
  }

  .credit-popup {
    display: none;
  }

  @media (max-width: 768px) {
    .music-credit {
      bottom: 12px;
    }

    .credit-text {
      display: none;
    }

    .credit-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: transparent;
      font-size: 18px;
      cursor: pointer;
    }

    .credit-popup {
      display: block;
      position: absolute;
      bottom: 40px;
      left: 0;
      background: rgba(255, 255, 255, 0.95);
      padding: 10px 14px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      font-size: 11px;
      line-height: 1.5;
      white-space: nowrap;
    }

    .credit-popup p {
      margin: 0;
      color: #555;
    }

    .credit-popup a {
      color: #4a90d9;
    }
  }
</style>
