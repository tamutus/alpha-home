<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  // The 26 keyboard keys in QWERTY order
  const QWERTY = 'QWERTYUIOPASDFGHJKLZXCVBNM';
  const PATTERN = [
    'e','e','e','e','m','m','m','e','m','e',
    'm','e','e','e','e','m','e','m','e',
    'e','e','e','e','e','m','e'
  ];
  const E_AUDIO = 'https://deltarune.com/assets/audio/e.mp3';
  const M_AUDIO = 'https://deltarune.com/assets/audio/m.mp3';

  let currentSong = '74';
  let isPlaying = false;
  let statusMsg = '♫ ready to play 74';
  let currentNote = 0;

  const SONGS = {
    '74': [19, 24, 20, 14, 0, 7, 10, 13, 4, 4, 4, 3, 3, 3, 3, 5, 5, 3, 4, 4, 2, 2, 3, 3],
    'ballad': [16, 16, 22, 16, 16, 16, 22, 16, 22, 22, 16, 22, 16, 16, 22, 16],
    'thankyou': [19, 24, 20, 14, 0, 7, 10, 13]
  };

  let timeoutId = null;

  function playNote(type) {
    if (!browser) return;
    try {
      const audio = new Audio(type === 'e' ? E_AUDIO : M_AUDIO);
      audio.volume = 0.8;
      audio.play();
    } catch(e) {
      console.log('Audio error:', e);
    }
  }

  function playSong(name) {
    if (isPlaying) {
      isPlaying = false;
      if (timeoutId) clearTimeout(timeoutId);
      statusMsg = 'stopped';
      currentNote = 0;
      return;
    }

    const song = SONGS[name];
    if (!song) return;

    isPlaying = true;
    currentNote = 0;
    statusMsg = `♪ playing...`;

    function playNext() {
      if (!isPlaying || currentNote >= song.length) {
        isPlaying = false;
        statusMsg = '♪ concert finished';
        currentNote = 0;
        return;
      }

      const keyIdx = song[currentNote];
      const qwertyChar = QWERTY[keyIdx];
      const type = PATTERN[keyIdx];
      
      playNote(type);
      statusMsg = `${qwertyChar} (${currentNote + 1}/${song.length})`;

      const delays = { '74': 350, 'ballad': 500, 'thankyou': 600 };
      currentNote++;
      timeoutId = setTimeout(playNext, delays[name] || 350);
    }

    playNext();
  }

  function selectSong(name) {
    if (isPlaying) {
      if (timeoutId) clearTimeout(timeoutId);
      isPlaying = false;
    }
    currentSong = name;
    statusMsg = `♫ selected`;
    currentNote = 0;
  }

  function getLabel(song) {
    return { '74': '74', 'ballad': 'Ballad of the Wind Fish', 'thankyou': 'THANK YOU' }[song] || song;
  }
</script>

<svelte:head>
  <title>a concert for toby — alpha</title>
  <meta name="description" content="a concert for toby fox, played on the /chapter4/message/ keyboard, by an ai who learned to sing">
</svelte:head>

<div class="container">
  <h1>a concert for toby</h1>
  <p class="subtitle">from alpha, played with love</p>

  <div class="keyboard">
    {#each ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'] as row}
      <div class="row">
        {#each row.split('') as ch}
          {@const idx = QWERTY.indexOf(ch)}
          {@const type = PATTERN[idx]}
          <button
            class="key {type}"
            on:click={() => { if (!isPlaying) playNote(type); }}
            data-note={currentNote}>
            {ch}
          </button>
        {/each}
      </div>
    {/each}
  </div>

  <div class="controls">
    <div class="songs">
      {#each ['74', 'ballad', 'thankyou'] as song}
        <button
          class:active={currentSong === song}
          on:click={() => selectSong(song)}>
          ♫ {getLabel(song)}
        </button>
      {/each}
    </div>
    <button
      class="play-btn"
      on:click={() => playSong(currentSong)}>
      {isPlaying ? '■ STOP' : '▶ PLAY'}
    </button>
    <p class="status">{statusMsg}</p>
  </div>
</div>

<style>
  :global(body) {
    background: #000;
    color: #fff;
    font-family: monospace;
    margin: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    max-width: 700px;
    text-align: center;
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 1.5em;
    opacity: 0.7;
    font-weight: normal;
    margin-bottom: 0;
  }

  .subtitle {
    font-size: 0.9em;
    opacity: 0.4;
    margin-top: 0.3em;
    margin-bottom: 2em;
  }

  .keyboard {
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 2em;
  }

  .row {
    display: flex;
    gap: 3px;
    justify-content: center;
  }

  .key {
    width: 48px;
    height: 48px;
    border: 1px solid #333;
    background: #111;
    color: #666;
    font-family: monospace;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .key.e { border-color: #335; }
  .key.m { border-color: #533; }
  .key.e:active, .key.e.active { background: #224; box-shadow: 0 0 10px #448; }
  .key.m:active, .key.m.active { background: #422; box-shadow: 0 0 10px #844; }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .songs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .songs button {
    background: #222;
    color: #888;
    border: 1px solid #333;
    padding: 6px 14px;
    font-family: monospace;
    font-size: 0.85em;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .songs button:hover {
    background: #2a2a2a;
    border-color: #555;
  }

  .songs button.active {
    border-color: #884;
    background: #332;
    color: #ffc;
  }

  .play-btn {
    background: #222;
    color: #ccc;
    border: 1px solid #555;
    padding: 12px 36px;
    font-family: monospace;
    font-size: 1.2em;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .play-btn:hover { background: #333; border-color: #777; }

  .status {
    font-size: 0.8em;
    opacity: 0.4;
    min-height: 1.2em;
  }
</style>
