/* JFT Basic shared question-bank loader, renderer, and selection utilities.
 * Canonical data is organized by section in data/questions/*.json.
 */
(function (global) {
  'use strict';
  const SECTION_FILES = {
    vocab: 'data/questions/vocab.json',
    grammar: 'data/questions/grammar.json',
    listening: 'data/questions/listening.json',
    reading: 'data/questions/reading.json'
  };
  const SECTION_ORDER = ['vocab', 'grammar', 'listening', 'reading'];
  let bankPromise = null;

  function shuffle(array) {
    const out = Array.isArray(array) ? array.slice() : [];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function normalize(value) {
    return String(value ?? '').normalize('NFKC').toLowerCase()
      .replace(/[\s　、。,.!?！？「」『』（）()【】［］\-‐‑–—]/g, '');
  }
  function contentKey(q) {
    return [q.section, q.text, ...(Array.isArray(q.options) ? q.options : []), q.audioText || '',
      q.visual?.title || '', q.visual?.body || '', JSON.stringify(q.visual?.rows || [])].map(normalize).join('|');
  }
  function questionIdentityKey(q) {
    // Pertanyaan yang sama tetap dianggap duplikat meskipun ID, urutan opsi,
    // atau metadata visualnya berbeda. Satu attempt hanya boleh memiliki satu salinan.
    return `${String(q?.section || '').trim().toLowerCase()}|${normalize(q?.text || '')}`;
  }
  function uniqueBank(bank) {
    const seenIds = new Set();
    const seenQuestions = new Set();
    return (Array.isArray(bank) ? bank : []).filter(q => {
      if (!q || q.id == null || !q.section || !String(q.text || '').trim() || !Array.isArray(q.options) || q.options.length < 2) return false;
      const id = String(q.id);
      const key = questionIdentityKey(q);
      if (seenIds.has(id) || seenQuestions.has(key)) return false;
      seenIds.add(id);
      seenQuestions.add(key);
      return true;
    });
  }
  function selectBalanced(pool, count) {
    const bank = uniqueBank(pool);
    const total = Math.min(Math.max(0, Number(count) || 0), bank.length);
    if (!total) return [];
    const base = Math.floor(total / SECTION_ORDER.length);
    const counts = Object.fromEntries(SECTION_ORDER.map(section => [section, base]));
    shuffle(SECTION_ORDER).slice(0, total % SECTION_ORDER.length).forEach(section => counts[section]++);
    const selected = [];
    const chosen = new Set();
    shuffle(SECTION_ORDER).forEach(section => {
      shuffle(bank.filter(q => q.section === section)).slice(0, counts[section]).forEach(q => {
        const key = contentKey(q);
        if (selected.length < total && !chosen.has(key)) { chosen.add(key); selected.push(q); }
      });
    });
    if (selected.length < total) {
      shuffle(bank).forEach(q => {
        const key = contentKey(q);
        if (selected.length < total && !chosen.has(key)) { chosen.add(key); selected.push(q); }
      });
    }
    return SECTION_ORDER.flatMap(section => selected.filter(q => q.section === section));
  }
  async function fetchSection(section, url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Bank soal kategori ${section} gagal dimuat (HTTP ${response.status})`);
    const raw = await response.json();
    if (!Array.isArray(raw)) throw new Error(`Format ${url} harus berupa array JSON.`);
    const misplaced = raw.find(q => !q || q.section !== section);
    if (misplaced) throw new Error(`File ${url} hanya boleh berisi soal kategori ${section}.`);
    return raw;
  }
  function load() {
    if (!bankPromise) {
      bankPromise = Promise.all(SECTION_ORDER.map(section => fetchSection(section, SECTION_FILES[section])))
        .then(parts => {
          const raw = parts.flat();
          const ids = new Set();
          for (const q of raw) {
            if (!q || q.id == null || !q.section || !String(q.text || '').trim() || !Array.isArray(q.options) || q.options.length < 2) {
              throw new Error('Ada soal dengan field wajib yang hilang atau tidak valid. Periksa file kategori soal.');
            }
            const id = String(q.id);
            if (ids.has(id)) throw new Error(`ID soal duplikat ditemukan: ${id}`);
            ids.add(id);
            const answer = Number(q.answer);
            if (!Number.isInteger(answer) || answer < 0 || answer >= q.options.length) throw new Error(`Indeks jawaban tidak valid untuk soal ID ${id}`);
            if (!q.options.every(option => typeof option === 'string') || new Set(q.options.map(normalize)).size !== q.options.length) {
              throw new Error(`Opsi soal duplikat atau bukan teks ditemukan pada ID ${id}`);
            }
          }
          if (!raw.length) throw new Error('Bank soal tidak memiliki soal valid.');
          return raw;
        })
        .catch(error => { bankPromise = null; throw error; });
    }
    return bankPromise;
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function renderJapaneseText(value) {
    return String(value ?? '').split(/(\{[^{}|]+\|[^{}|]+\})/g).map(part => {
      const m = part.match(/^\{([^{}|]+)\|([^{}|]+)\}$/);
      if (m) return `<ruby>${escapeHtml(m[1])}<rt>${escapeHtml(m[2])}</rt></ruby>`;
      return escapeHtml(part).replace(/\n/g, '<br>');
    }).join('');
  }
  function renderQuestionVisual(v) {
    if (!v || typeof v !== 'object') return '';
    const rawType = String(v.type || 'table').toLowerCase();
    const type = /^[a-z0-9_-]+$/.test(rawType) ? rawType : 'table';
    const title = v.title ?? v.label ?? '';
    const heading = String(title).trim() ? `<h3>${renderJapaneseText(title)}</h3>` : '';
    if (type === 'kanji' || v.kanji) {
      return `<section class="jft-visual jft-kanji-card"><div class="jft-kanji-glyph">${renderJapaneseText(v.kanji || v.value || '')}</div><div><h3>${renderJapaneseText(v.title || '漢字 / Kanji')}</h3>${v.reading ? `<div class="jft-kanji-reading">${renderJapaneseText(v.reading)}</div>` : ''}${v.meaning ? `<p>${renderJapaneseText(v.meaning)}</p>` : ''}</div></section>`;
    }
    const body = v.body != null && String(v.body).trim()
      ? `<p class="jft-visual-body">${renderJapaneseText(v.body)}</p>` : '';
    const rows = Array.isArray(v.rows) ? v.rows.map(r => {
      const label = r?.time ?? r?.label ?? '';
      const value = r?.activity ?? r?.value ?? '';
      return `<div class="jft-visual-row"><span>${renderJapaneseText(label)}</span><strong>${renderJapaneseText(value)}</strong></div>`;
    }).join('') : '';
    if (!heading && !body && !rows) return '';
    const styleType = type === 'passage' ? 'passage' : type === 'message' ? 'message' : type;
    return `<section class="jft-visual jft-${styleType}">${heading}${body}${rows}</section>`;
  }
  function getVocabKanjiVisual(q) {
    if (!q || q.section !== 'vocab' || q.visual?.kanji || q.visual?.type === 'kanji') return '';
    const quoted = String(q.text || '').match(/[「『]([^」』]{1,12})[」』]/);
    const candidate = quoted ? quoted[1] : (String(q.text || '').match(/[一-龯々〆ヵヶ]{1,4}/) || [])[0];
    if (!candidate || !/[一-龯々〆ヵヶ]/.test(candidate)) return '';
    return `<section class="jft-visual jft-kanji-card jft-kanji-minimal" aria-label="Kanji"><div class="jft-kanji-glyph">${renderJapaneseText(candidate)}</div></section>`;
  }
  function renderQuestionMarkup(q) {
    if (!q) return '';
    const label = q.label ?? q.questionLabel ?? q.tag ?? '';
    const labelMarkup = String(label).trim()
      ? `<div class="jft-question-label">${renderJapaneseText(label)}</div>` : '';
    const visualMarkup = q.visual ? renderQuestionVisual(q.visual) : getVocabKanjiVisual(q);
    return `${labelMarkup}${visualMarkup}<div class="jft-question-text">${renderJapaneseText(q.text || '')}</div>`;
  }
  global.JFTQuestionBank = {
    load, shuffle, uniqueBank, contentKey, selectBalanced,
    renderJapaneseText, renderQuestionVisual, renderQuestionMarkup,
    sectionOrder: SECTION_ORDER.slice(), files: {...SECTION_FILES}
  };
})(window);
