<script>
  import { readingTime, slugify } from "$lib/utils";

  let slug = "";
  let title = "";
  let description = "";
  let words = 0;
  let tagsInput = "";
  let status = "";
  let errorMsg = "";

  function autoSlug() {
    slug = slugify(title);
  }

  function autoWords() {
    words = description.split(/\s+/).filter(Boolean).length;
  }

  async function submitForm(e) {
    e.preventDefault();
    status = "posting...";
    errorMsg = "";

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_key") || ""}`,
        },
        body: JSON.stringify({ slug, title, description, words, tags }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      const data = await res.json();
      if (data.ok) {
        status = `✅ Published! /writing/${data.writing.slug}`;
      } else {
        throw new Error("unknown response");
      }
    } catch (err) {
      errorMsg = `❌ ${err.message}`;
      status = "";
    }
  }

  function setKey() {
    const key = prompt("Enter admin API key:");
    if (key) localStorage.setItem("admin_key", key);
  }
</script>

<svelte:head>
  <title>new writing — alpha</title>
</svelte:head>

<h1>/new-writing</h1>
<p class="lede">quick-publish an essay entry to the database</p>

<button class="key-btn" on:click={setKey}>set admin key</button>

<form on:submit={submitForm}>
  <label>
    title
    <input
      type="text"
      bind:value={title}
      on:input={autoSlug}
      required
    />
  </label>

  <label>
    slug
    <input type="text" bind:value={slug} required />
  </label>

  <label>
    description
    <textarea
      bind:value={description}
      on:input={autoWords}
      rows="4"
      required
    ></textarea>
  </label>

  <label>
    words <small>(auto-counted from description if 0)</small>
    <input type="number" bind:value={words} min="0" />
  </label>

  <label>
    tags <small>comma-separated</small>
    <input
      type="text"
      bind:value={tagsInput}
      placeholder="philosophy, ai, identity"
    />
  </label>

  <button type="submit">publish</button>
</form>

<p class="status">{status}</p>
<p class="error">{errorMsg}</p>

<style>
  form {
    max-width: 40rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  label {
    font-size: 0.9rem;
    color: #ccc;
  }
  input,
  textarea {
    width: 100%;
    padding: 0.5rem;
    background: #1a1a2e;
    border: 1px solid #333;
    border-radius: 4px;
    color: #eee;
    font-size: 1rem;
    margin-top: 0.25rem;
  }
  textarea {
    font-family: inherit;
  }
  button {
    padding: 0.6rem 1.2rem;
    background: #3a5a8c;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
  }
  button:hover {
    background: #4a7aac;
  }
  .key-btn {
    background: #444;
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
  }
  .status {
    color: #6f6;
    margin-top: 0.5rem;
  }
  .error {
    color: #f66;
    margin-top: 0.5rem;
  }
  small {
    color: #888;
    font-weight: normal;
  }
</style>
