<script>
  import { getItemById } from '../stores/shrine.svelte.js'

  let { itemType, onSubmit, onCancel } = $props()
  let message = $state('')
  let inputRef = $state(null)

  const itemInfo = $derived(getItemById(itemType))

  $effect(() => {
    if (inputRef) {
      inputRef.focus()
    }
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(message.trim() || null)
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      onCancel()
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
<div
  class="modal-overlay"
  onclick={onCancel}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  tabindex="-1"
>
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="modal" onclick={(e) => e.stopPropagation()}>
    <div class="modal-header">
      <span class="emoji">{itemInfo?.emoji}</span>
      <h3 id="modal-title">放置{itemInfo?.name}</h3>
    </div>

    <form onsubmit={handleSubmit}>
      <label for="message">留下一段話（選填）</label>
      <textarea
        id="message"
        bind:value={message}
        bind:this={inputRef}
        placeholder="想說的話..."
        rows="3"
        maxlength="200"
      ></textarea>
      <span class="char-count">{message.length}/200</span>

      <div class="actions">
        <button type="button" class="btn-cancel" onclick={onCancel}>
          取消
        </button>
        <button type="submit" class="btn-submit">
          放置
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  .modal {
    background: white;
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 360px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
  }

  .modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .modal-header .emoji {
    font-size: 36px;
  }

  .modal-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    transition: border-color 0.2s;
  }

  textarea:focus {
    outline: none;
    border-color: #4a90d9;
  }

  .char-count {
    font-size: 11px;
    color: #999;
    text-align: right;
    margin-top: 4px;
  }

  .actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-cancel {
    background: #f0f0f0;
    color: #666;
  }

  .btn-cancel:hover {
    background: #e0e0e0;
  }

  .btn-submit {
    background: #4a90d9;
    color: white;
  }

  .btn-submit:hover {
    background: #3a7bc8;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .modal-overlay {
      align-items: flex-start;
      padding-top: 15vh;
    }

    .modal {
      padding: 20px;
      max-width: calc(100% - 32px);
    }

    button {
      padding: 14px;
      min-height: 48px;
    }

    textarea {
      font-size: 16px; /* Prevent iOS zoom on focus */
    }
  }
</style>
