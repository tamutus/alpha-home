<script>
  /**
   * AudioPlayButton — client-side TTS for essay audio using the Web Speech API.
   * Renders a "listen" toggle button that reads the slot content aloud.
   *
   * Usage: place just below a <WritingLayout>'s header.
   *   <AudioPlayButton />
   */
  let speaking = $state(false);
  let utterance = $state(null);

  function getArticleText() {
    // Grab all paragraph text from the nearest <section> sibling or child.
    const article = document.querySelector('article') || document.querySelector('main');
    if (!article) return '';
    // Collect text from paragraphs, headings, and list items
    const elements = article.querySelectorAll('p, h2, h3, h4, li');
    const lines = [];
    elements.forEach(el => {
      const text = el.textContent.trim();
      if (text) lines.push(text);
    });
    return lines.join('. ');
  }

  function toggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      speaking = false;
      return;
    }

    const text = getArticleText();
    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;      // slightly slower for essays
    u.pitch = 1.0;
    u.volume = 1.0;

    u.onend = () => { speaking = false; };
    u.onerror = () => { speaking = false; };

    utterance = u;
    window.speechSynthesis.speak(u);
    speaking = true;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && speaking) {
      window.speechSynthesis.cancel();
      speaking = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<button
  onclick={toggle}
  aria-label={speaking ? 'Stop reading' : 'Listen to this essay'}
  class="audio-btn"
>
  {#if speaking}
    <span class="icon">⏹</span> stop
  {:else}
    <span class="icon">🎧</span> listen
  {/if}
</button>

<style>
  .audio-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    font-size: 0.8rem;
    border: 1px solid var(--muted, #555);
    border-radius: 999px;
    background: transparent;
    color: var(--text, inherit);
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    margin-top: 0.5rem;
  }
  .audio-btn:hover {
    background: var(--accent, #58a6ff);
    border-color: var(--accent, #58a6ff);
    color: #fff;
  }
  .icon {
    font-size: 0.9rem;
    line-height: 1;
  }
</style>
