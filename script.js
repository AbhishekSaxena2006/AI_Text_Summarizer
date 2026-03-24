// All UI text in both English and Hindi
const i18n = {
  en: {
    studentTool:   "Student Tool",
    headLine1:     "Summarize",
    headLine2:     "Smarter",
    headLine3:     "Study Better",
    subTitle:      "Paste any long answer or paragraph — get a clean summary instantly. No AI API needed.",
    uploadLabel:   'Click to upload a <strong>.txt</strong> file, or paste text below',
    orText:        "OR",
    step1:         "① Paste your text below",
    step2:         "② Summary length",
    step3:         "③ Your Summary",
    generateBtn:   "Generate Summary",
    downloadPDF:   "Download PDF",
    copy:          "Copy",
    short:         "🟢 Short (1–2 sentences)",
    medium:        "🔵 Medium (2–3 sentences)",
    long:          "🟣 Long (4–5 sentences)",
    chars:         "characters",
    errorMsg:      "⚠️ Please paste some text before generating a summary.",
    historyTitle:  "Summary History",
    clearAll:      "Clear All",
    words:         "words",
    minRead:       "min read",
    sentSelected:  "sentences selected",
    sentTotal:     "total sentences",
    keywords:      "keywords found",
    copied:        "✅ Copied!",
    noHistory:     "No history yet.",
    fileLoaded:    "✅ File loaded!",
    pdfTitle:      "SmartSum — Summary",
  },
  hi: {
    studentTool:   "छात्र उपकरण",
    headLine1:     "स्मार्ट",
    headLine2:     "सारांश",
    headLine3:     "बेहतर पढ़ाई",
    subTitle:      "कोई भी लंबा उत्तर या पैराग्राफ पेस्ट करें — तुरंत सारांश पाएं। कोई API नहीं।",
    uploadLabel:   '<strong>.txt</strong> फ़ाइल अपलोड करें, या नीचे टेक्स्ट पेस्ट करें',
    orText:        "या",
    step1:         "① नीचे अपना टेक्स्ट पेस्ट करें",
    step2:         "② सारांश की लंबाई",
    step3:         "③ आपका सारांश",
    generateBtn:   "सारांश बनाएं",
    downloadPDF:   "PDF डाउनलोड करें",
    copy:          "कॉपी करें",
    short:         "🟢 छोटा (1-2 वाक्य)",
    medium:        "🔵 मध्यम (2-3 वाक्य)",
    long:          "🟣 लंबा (4-5 वाक्य)",
    chars:         "अक्षर",
    errorMsg:      "⚠️ सारांश बनाने से पहले कोई टेक्स्ट पेस्ट करें।",
    historyTitle:  "सारांश इतिहास",
    clearAll:      "सब हटाएं",
    words:         "शब्द",
    minRead:       "मिनट पढ़ाई",
    sentSelected:  "वाक्य चुने गए",
    sentTotal:     "कुल वाक्य",
    keywords:      "मुख्य शब्द मिले",
    copied:        "✅ कॉपी हो गया!",
    noHistory:     "कोई इतिहास नहीं।",
    fileLoaded:    "✅ फ़ाइल लोड हुई!",
    pdfTitle:      "SmartSum — सारांश",
  }
};

// Current active language — starts as English
let currentLang = 'en';

// Apply all i18n strings to elements with data-i18n attribute
function applyLanguage(lang) {
  currentLang = lang;
  const strings = i18n[lang];

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const key = el.getAttribute('data-i18n');
    if (strings[key] !== undefined) {
      el.innerHTML = strings[key];
    }
  });

  // Update the language toggle button label
  document.getElementById('langLabel').textContent = lang === 'en' ? '🌐 हिंदी' : '🌐 English';

  // Update textarea placeholder
  document.getElementById('inputText').placeholder =
    lang === 'en'
      ? 'Paste a long paragraph, answer, or notes here…'
      : 'यहाँ लंबा पैराग्राफ, उत्तर या नोट्स पेस्ट करें…';
}

// Toggle between English and Hindi
function toggleLanguage() {
  applyLanguage(currentLang === 'en' ? 'hi' : 'en');
}


// ── IMPORTANT KEYWORDS LIST ───────────────────────────
// These words get highlighted yellow in the summary output
const KEYWORDS = [
  'because','therefore','however','important','significant',
  'result','conclusion','main','key','primary','due to',
  'finally','thus','hence','purpose','define','means',
  'cause','effect','impact','summary','overall','hence',
  'notably','critical','essential','major','leads to'
];


// ── LIVE COUNTERS ─────────────────────────────────────
// Updates word count, reading time, and character count as user types
document.getElementById('inputText').addEventListener('input', function () {
  const text = this.value;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const readMin = Math.max(1, Math.ceil(words / 200)); // avg reading speed: 200 wpm
  const lang = i18n[currentLang];

  document.getElementById('charCount').textContent  = text.length;
  document.getElementById('wordCount').textContent  = words + ' ' + lang.words;
  document.getElementById('readTime').textContent   = '~' + readMin + ' ' + lang.minRead;
});


// ── FEATURE 1: FILE UPLOAD (.txt) ────────────────────
// Reads a .txt file and puts its content into the textarea
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Only allow .txt files
  if (!file.name.endsWith('.txt')) {
    alert('Please upload a .txt file only.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('inputText').value = e.target.result;
    // Trigger the input event to update counters
    document.getElementById('inputText').dispatchEvent(new Event('input'));

    // Show file loaded message in upload zone
    document.querySelector('.upload-label').innerHTML = i18n[currentLang].fileLoaded + ' — ' + file.name;
  };
  reader.readAsText(file);
}

// Drag-and-drop support on the upload zone
const uploadZone = document.getElementById('uploadZone');
uploadZone.addEventListener('dragover', function (e) {
  e.preventDefault();
  this.style.borderColor = 'var(--accent2)';
});
uploadZone.addEventListener('dragleave', function () {
  this.style.borderColor = '';
});
uploadZone.addEventListener('drop', function (e) {
  e.preventDefault();
  this.style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (file) {
    document.getElementById('fileInput').files = e.dataTransfer.files;
    handleFileUpload({ target: { files: [file] } });
  }
});


// ── MAIN FUNCTION: generateSummary() ─────────────────
function generateSummary() {

  // STEP 1: Read input
  const inputText = document.getElementById('inputText').value.trim();
  const errorMsg  = document.getElementById('errorMsg');
  errorMsg.classList.remove('visible');

  if (inputText === '') {
    errorMsg.classList.add('visible');
    return;
  }

  // STEP 2: Split into sentences
  const sentences = inputText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  if (sentences.length <= 1) {
    displaySummary([inputText], 1, 1);
    return;
  }

  // STEP 3: Score each sentence by importance
  const scored = sentences.map(function (sentence, index) {
    let score = 0;

    // Longer sentences carry more information
    score += sentence.split(/\s+/).length;

    // First sentence often has the main idea
    if (index === 0) score += 12;

    // Last sentence is often a conclusion
    if (index === sentences.length - 1) score += 6;

    // Important keyword bonus
    KEYWORDS.forEach(function (kw) {
      if (sentence.toLowerCase().includes(kw)) score += 8;
    });

    return { sentence: sentence, score: score, index: index };
  });

  // STEP 4: Pick top N sentences based on dropdown
  const lengthChoice = document.getElementById('lengthSelect').value;
  let sentenceCount;
  if      (lengthChoice === 'short')  sentenceCount = Math.min(2, sentences.length);
  else if (lengthChoice === 'medium') sentenceCount = Math.min(3, sentences.length);
  else                                sentenceCount = Math.min(5, sentences.length);

  const topSentences = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => a.index - b.index); // restore natural reading order

  const summaryLines = topSentences.map(item => item.sentence);

  // STEP 5: Show the summary
  displaySummary(summaryLines, sentenceCount, sentences.length);
}


// ── FEATURE 3: KEYWORD HIGHLIGHTER ───────────────────
// Wraps important keywords in a yellow highlighted span
function highlightKeywords(text) {
  let highlighted = text;
  let count = 0;

  KEYWORDS.forEach(function (kw) {
    // Use separate regex objects for test and replace to avoid lastIndex bug
    const testRegex    = new RegExp('\\b(' + kw + ')\\b', 'gi');
    const replaceRegex = new RegExp('\\b(' + kw + ')\\b', 'gi');
    if (testRegex.test(highlighted)) count++;
    highlighted = highlighted.replace(
      replaceRegex,
      '<span class="keyword-highlight">$1</span>'
    );
  });

  return { html: highlighted, count: count };
}


// ── DISPLAY SUMMARY ───────────────────────────────────
// Renders summary sentences into the output box
function displaySummary(lines, selectedCount, totalCount) {

  const outputSection = document.getElementById('outputSection');
  const summaryOutput = document.getElementById('summaryOutput');
  const summaryBox    = document.getElementById('summaryBox');
  const lang          = i18n[currentLang];

  summaryOutput.innerHTML = '';

  let totalKeywords = 0;

  // Add each sentence with staggered fade-in and keyword highlights
  lines.forEach(function (sentence, i) {
    const { html, count } = highlightKeywords(sentence);
    totalKeywords += count;

    const span = document.createElement('span');
    span.classList.add('sent');
    span.style.animationDelay = (i * 0.12) + 's';
    span.innerHTML = html + ' '; // innerHTML needed for keyword highlight spans
    summaryOutput.appendChild(span);
  });

  // Show output section
  outputSection.classList.add('visible');

  // Glow animation on the summary box
  summaryBox.classList.remove('glow');
  void summaryBox.offsetWidth;
  summaryBox.classList.add('glow');

  // Scroll to output
  outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // FEATURE 4: Save this summary to history
  saveToHistory(lines.join(' '), selectedCount);
}


// ── FEATURE 2: PDF DOWNLOAD ───────────────────────────
// Uses jsPDF to generate and download a PDF of the summary
function downloadPDF() {
  const summaryText = document.getElementById('summaryOutput').textContent.trim();
  if (!summaryText) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const lang = i18n[currentLang];
  const pageW  = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxW   = pageW - margin * 2;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 60);
  doc.text(lang.pdfTitle, margin, 28);

  // Date line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 150);
  doc.text('Generated: ' + new Date().toLocaleString(), margin, 36);

  // Horizontal rule
  doc.setDrawColor(200, 200, 220);
  doc.line(margin, 40, pageW - margin, 40);

  // Summary body text — wraps automatically
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 60);
  const lines = doc.splitTextToSize(summaryText, maxW);
  doc.text(lines, margin, 52);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 180);
  doc.text('Made with SmartSum — Student Text Summarizer', margin, 285);

  doc.save('SmartSum_Summary.pdf');
}


// ── FEATURE 4: SUMMARY HISTORY ────────────────────────
// Saves each summary to localStorage so user can see past summaries

function saveToHistory(summaryText, sentCount) {
  const MAX_HISTORY = 5; // keep last 5 summaries only

  let history = getHistory();

  const entry = {
    text:      summaryText,
    sentences: sentCount,
    lang:      currentLang,
    time:      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date:      new Date().toLocaleDateString()
  };

  // Add new entry at the top
  history.unshift(entry);

  // Keep only the last MAX_HISTORY entries
  if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);

  localStorage.setItem('smartsum_history', JSON.stringify(history));
  renderHistory();
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('smartsum_history')) || [];
  } catch (e) {
    return [];
  }
}

// Renders history list in the UI
function renderHistory() {
  const history       = getHistory();
  const historySection = document.getElementById('historySection');
  const historyList   = document.getElementById('historyList');
  const lang          = i18n[currentLang];

  if (history.length === 0) {
    historySection.style.display = 'none';
    return;
  }

  historySection.style.display = 'block';
  historyList.innerHTML = '';

  history.forEach(function (entry, i) {
    const item = document.createElement('div');
    item.classList.add('history-item');
    item.title = 'Click to load this summary';

    item.innerHTML =
      '<div class="history-meta">' +
        '<span class="history-time">🕐 ' + entry.date + ' ' + entry.time + '</span>' +
        '<span class="history-badge">' + entry.sentences + ' ' + lang.sentSelected + '</span>' +
      '</div>' +
      '<div class="history-text">' + entry.text + '</div>';

    // Clicking a history item loads its text into the textarea
    item.addEventListener('click', function () {
      const textarea = document.getElementById('inputText');
      textarea.value = entry.text;
      textarea.dispatchEvent(new Event('input'));
      // Scroll to textarea so user can see the loaded text, not to top
      textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      textarea.focus();
    });

    historyList.appendChild(item);
  });
}

// Clears all history from localStorage
function clearHistory() {
  localStorage.removeItem('smartsum_history');
  renderHistory();
}


// ── COPY SUMMARY ──────────────────────────────────────
function copySummary() {
  const text = document.getElementById('summaryOutput').textContent;
  navigator.clipboard.writeText(text).then(function () {
    const btn = document.querySelector('.copy-btn');
    btn.innerHTML = i18n[currentLang].copied;
    setTimeout(function () {
      btn.innerHTML = '📋 <span>' + i18n[currentLang].copy + '</span>';
    }, 2000);
  });
}


// ── INIT: Run on page load ────────────────────────────
// Apply default language and load saved history
applyLanguage('en');
renderHistory();
