<script>
  import { items, selectedItem } from '../stores/shrine.svelte.js'

  let isOpen = $state(false)

  function handleDragStart(event, itemId) {
    event.dataTransfer.setData('text/plain', itemId)
    event.dataTransfer.effectAllowed = 'copy'
  }

  function handleItemClick(itemId) {
    // Toggle selection - if same item clicked, deselect
    if (selectedItem.id === itemId) {
      selectedItem.id = null
    } else {
      selectedItem.id = itemId
      // Auto-collapse panel after selecting an item so user can click anywhere on scene
      isOpen = false
    }
  }

  function toggle() {
    isOpen = !isOpen
    // Clear selection when closing panel
    if (!isOpen) {
      selectedItem.id = null
    }
  }
</script>

<aside class="drawer" class:open={isOpen}>
  <button class="toggle-btn" onclick={toggle}>
    <span class="toggle-icon">{isOpen ? '✕' : '💛'}</span>
    {#if !isOpen}
      <span class="toggle-label">獻上祝福</span>
    {/if}
  </button>

  <div class="drawer-content">
    <div class="items">
      {#each items as item}
        <button
          class="item-btn"
          class:selected={selectedItem.id === item.id}
          draggable="true"
          ondragstart={(e) => handleDragStart(e, item.id)}
          onclick={() => handleItemClick(item.id)}
          title={item.name}
        >
          <span class="emoji">{item.emoji}</span>
        </button>
      {/each}
    </div>
    <p class="hint desktop-hint">拖曳物品到場景中</p>
    <p class="hint mobile-hint">點選物品，再點擊場景放置</p>
  </div>
</aside>

<style>
  .drawer {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%) translateX(100%);
    z-index: 110;
    transition: transform 0.3s ease;
  }

  .drawer.open {
    transform: translateY(-50%) translateX(0);
  }

  .toggle-btn {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.5);
    border: none;
    border-radius: 12px 0 0 12px;
    padding: 12px 8px;
    cursor: pointer;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: background 0.2s;
  }

  .toggle-btn:hover {
    background: rgba(255, 255, 255, 1);
  }

  .toggle-icon {
    font-size: 18px;
  }

  .toggle-label {
    writing-mode: vertical-rl;
    font-size: 16px;
    color: #666;
    letter-spacing: 2px;
  }

  .drawer-content {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px 0 0 16px;
    padding: 16px 20px;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
    min-width: 80px;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .item-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 12px;
    border: 2px solid transparent;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    cursor: grab;
    transition: all 0.2s ease;
    user-select: none;
  }

  .item-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(-2px);
  }

  .item-btn:active {
    cursor: grabbing;
  }

  .item-btn.selected {
    border-color: #4a90d9;
    background: rgba(74, 144, 217, 0.3);
    transform: scale(1.05);
  }

  .emoji {
    font-size: 28px;
    line-height: 1;
  }

  .hint {
    margin-top: 12px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    max-width: 60px;
  }

  .mobile-hint {
    display: none;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .drawer {
      position: fixed;
      top: auto;
      bottom: 0;
      left: 0;
      right: 0;
      transform: translateY(100%);
    }

    .drawer.open {
      transform: translateY(0);
    }

    .toggle-btn {
      position: absolute;
      right: auto;
      left: 50%;
      top: auto;
      bottom: 100%;
      transform: translateX(-50%);
      border-radius: 12px 12px 0 0;
      padding: 8px 16px;
      flex-direction: row;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .toggle-label {
      writing-mode: horizontal-tb;
      letter-spacing: 0;

    }

    .drawer-content {
      border-radius: 16px 16px 0 0;
      padding: 16px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
      min-width: auto;
    }

    .items {
      flex-direction: row;
      justify-content: center;
      flex-wrap: nowrap;
      gap: 8px;
    }

    .item-btn {
      padding: 8px 10px;
      min-width: 48px;
      min-height: 48px;
    }

    .item-btn:hover {
      transform: none;
    }

    .item-btn.selected {
      transform: scale(1.1);
    }

    .emoji {
      font-size: 32px;
    }

    .hint {
      max-width: none;
      margin-top: 8px;
    }

    .desktop-hint {
      display: none;
    }

    .mobile-hint {
      display: block;
    }
  }
</style>
