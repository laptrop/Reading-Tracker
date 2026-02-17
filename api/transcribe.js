<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lesetrainer</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 16px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
        }

        /* ── SCREENS ── */
        .screen { display: none; }
        .screen.active { display: block; }

        /* ── CARDS ── */
        .card {
            background: white;
            border-radius: 20px;
            padding: 28px;
            margin-bottom: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }

        .card h1 {
            font-size: 1.8em;
            color: #667eea;
            text-align: center;
            margin-bottom: 8px;
        }

        .card h2 {
            font-size: 1.2em;
            color: #495057;
            margin-bottom: 16px;
        }

        .subtitle {
            text-align: center;
            color: #6c757d;
            margin-bottom: 28px;
            font-size: 0.95em;
        }

        /* ── BUTTONS ── */
        .btn {
            display: block;
            width: 100%;
            padding: 16px;
            font-size: 1.1em;
            font-weight: 600;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 12px;
            text-align: center;
        }

        .btn:last-child { margin-bottom: 0; }

        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover:not(:disabled) { background: #5568d3; transform: translateY(-1px); }

        .btn-success { background: #28a745; color: white; }
        .btn-success:hover:not(:disabled) { background: #218838; transform: translateY(-1px); }

        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover:not(:disabled) { background: #c82333; }

        .btn-outline {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
        }
        .btn-outline:hover { background: #f0f2ff; }

        .btn-secondary { background: #6c757d; color: white; }
        .btn-secondary:hover { background: #5a6268; }

        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ── STATUS ── */
        .status {
            padding: 12px 16px;
            border-radius: 10px;
            margin: 12px 0;
            font-weight: 500;
            font-size: 0.95em;
        }
        .status.info { background: #d1ecf1; color: #0c5460; }
        .status.success { background: #d4edda; color: #155724; }
        .status.error { background: #f8d7da; color: #721c24; }
        .status.warning { background: #fff3cd; color: #856404; }

        /* ── SESSION HEADER ── */
        .session-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            border-radius: 14px;
            padding: 14px 20px;
            margin-bottom: 16px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .session-header .page-badge {
            background: #667eea;
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9em;
        }

        .session-header .session-timer {
            font-size: 1.1em;
            font-weight: 600;
            color: #495057;
            font-family: monospace;
        }

        /* ── PHOTO UPLOAD ── */
        .photo-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 12px;
        }

        .photo-btn {
            padding: 20px 12px;
            border: 2px dashed #dee2e6;
            border-radius: 12px;
            background: #f8f9fa;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            font-size: 0.9em;
            color: #495057;
        }

        .photo-btn:hover { border-color: #667eea; background: #f0f2ff; }
        .photo-btn .icon { font-size: 2em; display: block; margin-bottom: 6px; }

        .preview-img {
            width: 100%;
            max-height: 200px;
            object-fit: cover;
            border-radius: 10px;
            margin: 12px 0;
            display: none;
        }

        textarea {
            width: 100%;
            min-height: 120px;
            padding: 14px;
            border: 2px solid #dee2e6;
            border-radius: 10px;
            font-size: 0.95em;
            font-family: inherit;
            resize: vertical;
            transition: border-color 0.2s;
        }
        textarea:focus { outline: none; border-color: #667eea; }
        textarea.ocr-done { border-color: #28a745; background: #f0fff4; }

        .word-count { color: #6c757d; font-size: 0.85em; margin-top: 6px; }

        /* ── RECORDING ── */
        .recording-indicator {
            display: none;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background: #fff3cd;
            border-radius: 10px;
            margin: 12px 0;
        }
        .recording-indicator.show { display: flex; }

        .rec-dot {
            width: 12px; height: 12px;
            background: #dc3545;
            border-radius: 50%;
            animation: blink 1s infinite;
            flex-shrink: 0;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
        }

        .rec-timer {
            font-size: 1.2em;
            font-weight: bold;
            font-family: monospace;
            color: #495057;
            margin-left: auto;
        }

        /* ── COUNTDOWN ── */
        .countdown-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(102, 126, 234, 0.92);
            z-index: 100;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: white;
        }
        .countdown-overlay.show { display: flex; }
        .countdown-number {
            font-size: 8em;
            font-weight: bold;
            line-height: 1;
            animation: countPulse 1s ease-in-out;
        }
        .countdown-label { font-size: 1.4em; margin-top: 16px; opacity: 0.9; }

        @keyframes countPulse {
            0% { transform: scale(1.4); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }

        /* ── MINI FEEDBACK ── */
        .mini-feedback {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 16px 0;
        }

        .mini-metric {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            border-left: 4px solid #667eea;
        }

        .mini-metric .val {
            font-size: 2em;
            font-weight: bold;
            color: #495057;
        }

        .mini-metric .lbl {
            font-size: 0.8em;
            color: #6c757d;
            margin-top: 4px;
        }

        /* ── SESSION SUMMARY ── */
        .summary-hero {
            text-align: center;
            padding: 20px 0;
        }

        .summary-emoji { font-size: 4em; }

        .summary-message {
            font-size: 1.3em;
            font-weight: bold;
            color: #495057;
            margin: 12px 0 6px;
        }

        .summary-sub {
            color: #6c757d;
            font-size: 0.95em;
        }

        .summary-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 20px 0;
        }

        .stat-box {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 18px;
            text-align: center;
        }

        .stat-box .val {
            font-size: 2.2em;
            font-weight: bold;
            color: #667eea;
        }

        .stat-box .lbl {
            font-size: 0.8em;
            color: #6c757d;
            margin-top: 4px;
        }

        .pages-list {
            border-top: 2px solid #e9ecef;
            padding-top: 16px;
            margin-top: 4px;
        }

        .pages-list h3 {
            color: #495057;
            font-size: 0.95em;
            margin-bottom: 12px;
        }

        .page-row {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            gap: 12px;
        }

        .page-row:last-child { border-bottom: none; }

        .page-num {
            background: #667eea;
            color: white;
            border-radius: 50%;
            width: 28px; height: 28px;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.85em;
            font-weight: bold;
            flex-shrink: 0;
        }

        .page-stats {
            flex: 1;
            display: flex;
            gap: 16px;
        }

        .page-stat {
            font-size: 0.9em;
            color: #495057;
        }

        .page-stat strong { color: #667eea; }

        /* ── SCREEN: START ── */
        .start-icon {
            font-size: 5em;
            text-align: center;
            margin: 10px 0 20px;
        }

        /* ── MOBILE ── */
        @media (max-width: 480px) {
            body { padding: 10px; }
            .card { padding: 20px; }
            .btn { font-size: 1em; padding: 14px; }
            .countdown-number { font-size: 6em; }
        }
    </style>
</head>
<body>

<!-- ══════════════════════════════════
     COUNTDOWN OVERLAY
══════════════════════════════════ -->
<div class="countdown-overlay" id="countdownOverlay">
    <div class="countdown-number" id="countdownNumber">3</div>
    <div class="countdown-label">Gleich geht's los!</div>
</div>

<div class="container">

<!-- ══════════════════════════════════
     SCREEN 1: START
══════════════════════════════════ -->
<div class="screen active" id="screenStart">
    <div class="card">
        <div class="start-icon">📚</div>
        <h1>Lesetrainer</h1>
        <p class="subtitle">Lesen üben & Fortschritte messen</p>
        <button class="btn btn-primary" onclick="startSession()">
            ▶️ Session starten
        </button>
    </div>
</div>

<!-- ══════════════════════════════════
     SCREEN 2: SEITE LESEN
══════════════════════════════════ -->
<div class="screen" id="screenPage">

    <div class="session-header">
        <span class="page-badge" id="pageBadge">Seite 1</span>
        <span class="session-timer" id="sessionTimer">00:00</span>
    </div>

    <!-- Step A: Foto -->
    <div class="card" id="stepPhoto">
        <h2>📷 Schritt 1: Text aufnehmen</h2>
        <div class="photo-buttons">
            <label class="photo-btn" for="cameraInput">
                <span class="icon">📸</span>
                Kamera
            </label>
            <label class="photo-btn" for="galleryInput">
                <span class="icon">🖼️</span>
                Galerie
            </label>
        </div>
        <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display:none">
        <input type="file" id="galleryInput" accept="image/*" style="display:none">

        <div id="ocrStatus"></div>
        <img id="previewImg" class="preview-img">

        <textarea id="referenceText"
            placeholder="Text erscheint hier nach dem Foto... oder direkt eintippen"></textarea>
        <div class="word-count" id="wordCount">0 Wörter</div>

        <button class="btn btn-primary" id="toRecordBtn" onclick="goToRecord()" disabled>
            🎤 Aufnahme starten →
        </button>
        <button class="btn btn-outline" onclick="goToRecord()">
            Ohne Foto → Text eintippen & weiter
        </button>
    </div>

    <!-- Step B: Aufnehmen -->
    <div class="card" id="stepRecord" style="display:none">
        <h2>🎤 Schritt 2: Vorlesen</h2>

        <div class="recording-indicator" id="recIndicator">
            <div class="rec-dot"></div>
            <span>Aufnahme läuft</span>
            <span class="rec-timer" id="recTimer">00:00</span>
        </div>

        <div id="recordStatus"></div>

        <div style="display:flex; gap:10px; justify-content:center; margin-top: 8px;">
            <button class="btn btn-success" id="startRecBtn" onclick="startRecording()"
                style="flex:1">
                ▶️ Los lesen!
            </button>
            <button class="btn btn-danger" id="stopRecBtn" onclick="stopRecording()"
                style="flex:1; display:none">
                ⏹️ Fertig
            </button>
        </div>

        <button class="btn btn-outline" onclick="backToPhoto()" style="margin-top:8px">
            ← Zurück
        </button>
    </div>

</div>

<!-- ══════════════════════════════════
     SCREEN 3: MINI FEEDBACK
══════════════════════════════════ -->
<div class="screen" id="screenFeedback">

    <div class="session-header">
        <span class="page-badge" id="feedbackPageBadge">Seite 1</span>
        <span class="session-timer" id="feedbackTimer">00:00</span>
    </div>

    <div class="card">
        <h2 id="feedbackTitle">✅ Seite 1 geschafft!</h2>

        <div class="mini-feedback">
            <div class="mini-metric">
                <div class="val" id="fbWpm">-</div>
                <div class="lbl">Wörter/Min</div>
            </div>
            <div class="mini-metric">
                <div class="val" id="fbAccuracy">-</div>
                <div class="lbl">Genauigkeit</div>
            </div>
        </div>

        <div id="fbMessage" class="status info"></div>

        <!-- Debug: show both texts to understand accuracy issues -->
        <details style="margin-top:16px;">
            <summary style="cursor:pointer; color:#667eea; font-size:0.9em; font-weight:600;">
                🔍 Vergleich anzeigen
            </summary>
            <div style="margin-top:12px; display:grid; gap:10px;">
                <div>
                    <div style="font-size:0.8em; color:#6c757d; margin-bottom:4px;">
                        📄 Referenztext (normalisiert):
                    </div>
                    <div id="fbRefText" style="background:#f8f9fa; padding:10px; border-radius:8px;
                        font-size:0.85em; color:#495057; max-height:120px; overflow-y:auto;
                        line-height:1.6; border:1px solid #dee2e6;"></div>
                </div>
                <div>
                    <div style="font-size:0.8em; color:#6c757d; margin-bottom:4px;">
                        🎤 Erkannter Text (Whisper):
                    </div>
                    <div id="fbTranscript" style="background:#f8f9fa; padding:10px; border-radius:8px;
                        font-size:0.85em; color:#495057; max-height:120px; overflow-y:auto;
                        line-height:1.6; border:1px solid #dee2e6;"></div>
                </div>
            </div>
        </details>

        <button class="btn btn-primary" onclick="nextPage()" style="margin-top:8px">
            📖 Nächste Seite →
        </button>
        <button class="btn btn-outline" onclick="endSession()">
            🏁 Session beenden
        </button>
    </div>

</div>

<!-- ══════════════════════════════════
     SCREEN 4: SESSION SUMMARY
══════════════════════════════════ -->
<div class="screen" id="screenSummary">
    <div class="card">
        <div class="summary-hero">
            <div class="summary-emoji" id="summaryEmoji">🌟</div>
            <div class="summary-message" id="summaryMessage">Super gemacht!</div>
            <div class="summary-sub" id="summarySub"></div>
        </div>

        <div class="summary-stats">
            <div class="stat-box">
                <div class="val" id="sumPages">-</div>
                <div class="lbl">Seiten gelesen</div>
            </div>
            <div class="stat-box">
                <div class="val" id="sumDuration">-</div>
                <div class="lbl">Minuten</div>
            </div>
            <div class="stat-box">
                <div class="val" id="sumWpm">-</div>
                <div class="lbl">Ø Wörter/Min</div>
            </div>
            <div class="stat-box">
                <div class="val" id="sumAccuracy">-</div>
                <div class="lbl">Ø Genauigkeit</div>
            </div>
        </div>

        <div class="pages-list">
            <h3>📄 Pro Seite:</h3>
            <div id="pagesList"></div>
        </div>

        <button class="btn btn-primary" onclick="newSession()" style="margin-top:20px">
            🔄 Neue Session
        </button>
    </div>
</div>

</div><!-- /container -->

<script>
// ══════════════════════════════════
// STATE
// ══════════════════════════════════
const state = {
    currentPage: 1,
    sessionStartTime: null,
    sessionTimerInterval: null,
    recStartTime: null,
    recTimerInterval: null,
    mediaRecorder: null,
    audioChunks: [],
    referenceWords: [],
    pages: [], // {wpm, accuracy, duration, wordCount}
};

// ══════════════════════════════════
// SCREEN MANAGEMENT
// ══════════════════════════════════
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

// ══════════════════════════════════
// SESSION TIMER
// ══════════════════════════════════
function startSessionTimer() {
    state.sessionStartTime = Date.now();
    state.sessionTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
        const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        const display = `${m}:${s}`;
        document.getElementById('sessionTimer').textContent = display;
        document.getElementById('feedbackTimer').textContent = display;
    }, 1000);
}

function stopSessionTimer() {
    clearInterval(state.sessionTimerInterval);
}

function getSessionDurationMinutes() {
    return (Date.now() - state.sessionStartTime) / 60000;
}

// ══════════════════════════════════
// RECORDING TIMER
// ══════════════════════════════════
function startRecTimer() {
    state.recStartTime = Date.now();
    state.recTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.recStartTime) / 1000);
        const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('recTimer').textContent = `${m}:${s}`;
    }, 1000);
}

function stopRecTimer() {
    clearInterval(state.recTimerInterval);
}

function getRecDurationSeconds() {
    return (Date.now() - state.recStartTime) / 1000;
}

// ══════════════════════════════════
// START SESSION
// ══════════════════════════════════
function startSession() {
    state.currentPage = 1;
    state.pages = [];
    startSessionTimer();
    loadPageScreen();
    showScreen('screenPage');
}

// ══════════════════════════════════
// LOAD PAGE SCREEN (reset for new page)
// ══════════════════════════════════
function loadPageScreen() {
    // Update badge
    document.getElementById('pageBadge').textContent = `Seite ${state.currentPage}`;

    // Reset photo step
    document.getElementById('stepPhoto').style.display = 'block';
    document.getElementById('stepRecord').style.display = 'none';

    // Reset textarea
    const ta = document.getElementById('referenceText');
    ta.value = '';
    ta.className = '';
    ta.style.borderColor = '';
    ta.style.background = '';
    document.getElementById('wordCount').textContent = '0 Wörter';

    // Reset photo preview
    document.getElementById('previewImg').style.display = 'none';
    document.getElementById('ocrStatus').innerHTML = '';

    // Reset record button
    document.getElementById('toRecordBtn').disabled = true;

    // Reset file inputs
    document.getElementById('cameraInput').value = '';
    document.getElementById('galleryInput').value = '';

    // Reset audio
    state.audioChunks = [];
    state.referenceWords = [];
}

// ══════════════════════════════════
// TEXT INPUT → ENABLE RECORD BTN
// ══════════════════════════════════
document.getElementById('referenceText').addEventListener('input', function() {
    const words = this.value.trim().split(/\s+/).filter(w => w.length > 0);
    document.getElementById('wordCount').textContent = `${words.length} Wörter`;
    document.getElementById('toRecordBtn').disabled = words.length < 3;
});

// ══════════════════════════════════
// PHOTO / OCR
// ══════════════════════════════════
document.getElementById('cameraInput').addEventListener('change', e => handleImage(e.target.files[0]));
document.getElementById('galleryInput').addEventListener('change', e => handleImage(e.target.files[0]));

function compressImage(file, maxWidth = 1600, quality = 0.8) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        img.src = URL.createObjectURL(file);
    });
}

async function handleImage(file) {
    if (!file) return;

    // Preview
    const preview = document.getElementById('previewImg');
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';

    showStatus('🔧 Bild wird verarbeitet...', 'info', 'ocrStatus');

    try {
        const compressed = await compressImage(file);
        showStatus('📖 Text wird erkannt...', 'info', 'ocrStatus');

        const fd = new FormData();
        fd.append('image', compressed, 'image.jpg');

        const res = await fetch('/api/ocr', { method: 'POST', body: fd });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.details || err.error || 'OCR fehlgeschlagen');
        }

        const data = await res.json();
        const text = data.text.trim();

        if (text) {
            const ta = document.getElementById('referenceText');
            ta.value = text;
            ta.classList.add('ocr-done');
            const words = text.split(/\s+/).filter(w => w.length > 0);
            document.getElementById('wordCount').textContent = `${words.length} Wörter`;
            document.getElementById('toRecordBtn').disabled = false;
            showStatus(`✅ ${words.length} Wörter erkannt – bei Bedarf korrigieren`, 'success', 'ocrStatus');
        } else {
            showStatus('⚠️ Kein Text gefunden. Bitte nochmal versuchen oder manuell eingeben.', 'warning', 'ocrStatus');
        }
    } catch (err) {
        showStatus('❌ ' + err.message, 'error', 'ocrStatus');
    }
}

// ══════════════════════════════════
// NAVIGATION
// ══════════════════════════════════
function goToRecord() {
    const text = document.getElementById('referenceText').value.trim();
    if (!text) return;
    state.referenceWords = normalizeText(text).split(/\s+/).filter(w => w.length > 0);

    document.getElementById('stepPhoto').style.display = 'none';
    document.getElementById('stepRecord').style.display = 'block';

    // Reset record UI
    document.getElementById('startRecBtn').style.display = 'block';
    document.getElementById('stopRecBtn').style.display = 'none';
    document.getElementById('recIndicator').classList.remove('show');
    document.getElementById('recTimer').textContent = '00:00';
    document.getElementById('recordStatus').innerHTML = '';
}

function backToPhoto() {
    document.getElementById('stepRecord').style.display = 'none';
    document.getElementById('stepPhoto').style.display = 'block';
}

// ══════════════════════════════════
// WAKE LOCK (Bildschirm wach halten)
// ══════════════════════════════════
let wakeLock = null;

async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock aktiviert - Bildschirm bleibt an');
        } catch (err) {
            console.warn('Wake Lock fehlgeschlagen:', err);
            // Not critical - recording still works, just screen may lock
        }
    } else {
        console.warn('Wake Lock API nicht verfügbar in diesem Browser');
    }
}

async function releaseWakeLock() {
    if (wakeLock) {
        try {
            await wakeLock.release();
            wakeLock = null;
            console.log('Wake Lock freigegeben');
        } catch (err) {
            console.warn('Wake Lock release fehlgeschlagen:', err);
        }
    }
}

// Re-acquire wake lock if page becomes visible again (e.g. after tab switch)
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});

// ══════════════════════════════════
// RECORDING
// ══════════════════════════════════
async function startRecording() {
    state.audioChunks = [];

    // Countdown
    const overlay = document.getElementById('countdownOverlay');
    const num = document.getElementById('countdownNumber');
    overlay.classList.add('show');
    for (let i = 3; i > 0; i--) {
        num.textContent = i;
        await sleep(1000);
    }
    num.textContent = 'LOS!';
    await sleep(600);
    overlay.classList.remove('show');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });

        state.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        state.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) state.audioChunks.push(e.data); };
        state.mediaRecorder.onstop = async () => {
            stream.getTracks().forEach(t => t.stop());
            await processRecording();
        };

        state.mediaRecorder.start();
        startRecTimer();
        await requestWakeLock(); // Keep screen on!

        document.getElementById('startRecBtn').style.display = 'none';
        document.getElementById('stopRecBtn').style.display = 'block';
        document.getElementById('recIndicator').classList.add('show');
        showStatus('🎤 Aufnahme läuft – jetzt vorlesen!', 'success', 'recordStatus');

    } catch (err) {
        showStatus('❌ Mikrofon-Zugriff fehlgeschlagen: ' + err.message, 'error', 'recordStatus');
    }
}

function stopRecording() {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
        state.mediaRecorder.stop();
        stopRecTimer();
        releaseWakeLock(); // Allow screen to sleep again

        document.getElementById('stopRecBtn').style.display = 'none';
        document.getElementById('recIndicator').classList.remove('show');
        showStatus('⏳ Wird ausgewertet...', 'info', 'recordStatus');
    }
}

async function processRecording() {
    const durationSeconds = getRecDurationSeconds();

    try {
        const blob = new Blob(state.audioChunks, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('audio', blob, 'recording.webm');

        const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Transkription fehlgeschlagen');
        }

        const data = await res.json();
        const rawTranscript = data.text.trim();
        const recognized = normalizeText(rawTranscript).split(/\s+/).filter(w => w.length > 0);

        const wpm = Math.round(recognized.length / (durationSeconds / 60));
        const accuracy = calculateAccuracy(state.referenceWords, recognized);

        // Save page result
        state.pages.push({
            page: state.currentPage,
            wpm,
            accuracy,
            duration: Math.round(durationSeconds),
            wordCount: state.referenceWords.length
        });

        showFeedback(wpm, accuracy, state.referenceWords, recognized, rawTranscript);

    } catch (err) {
        showStatus('❌ ' + err.message, 'error', 'recordStatus');
        // Allow retry
        document.getElementById('startRecBtn').style.display = 'block';
    }
}

// ══════════════════════════════════
// MINI FEEDBACK
// ══════════════════════════════════
function showFeedback(wpm, accuracy, refWords, recWords, rawTranscript) {
    document.getElementById('feedbackPageBadge').textContent = `Seite ${state.currentPage}`;
    document.getElementById('feedbackTitle').textContent = `✅ Seite ${state.currentPage} geschafft!`;
    document.getElementById('fbWpm').textContent = wpm;
    document.getElementById('fbAccuracy').textContent = accuracy + '%';

    // Quick message
    let msg = '';
    if (accuracy >= 95) msg = '🌟 Fantastisch! Fast fehlerfrei!';
    else if (accuracy >= 85) msg = '👍 Sehr gut! Weiter so!';
    else if (accuracy >= 70) msg = '💪 Gut gemacht! Üb weiter!';
    else msg = '📖 Weiterlesen macht besser!';

    if (wpm > 150) msg += ' ⚡ Super schnell!';

    document.getElementById('fbMessage').textContent = msg;
    document.getElementById('fbMessage').className = 'status ' + (accuracy >= 85 ? 'success' : 'info');

    // Show comparison texts for debugging
    document.getElementById('fbRefText').textContent = refWords.join(' ');
    document.getElementById('fbTranscript').textContent = rawTranscript;

    showScreen('screenFeedback');
}

// ══════════════════════════════════
// NEXT PAGE / END SESSION
// ══════════════════════════════════
function nextPage() {
    state.currentPage++;
    loadPageScreen();
    showScreen('screenPage');
}

function endSession() {
    stopSessionTimer();
    buildSummary();
    showScreen('screenSummary');
}

// ══════════════════════════════════
// SESSION SUMMARY
// ══════════════════════════════════
function buildSummary() {
    const pages = state.pages;
    if (pages.length === 0) return;

    const totalDurationMin = getSessionDurationMinutes();
    const avgWpm = Math.round(pages.reduce((s, p) => s + p.wpm, 0) / pages.length);
    const avgAccuracy = Math.round(pages.reduce((s, p) => s + p.accuracy, 0) / pages.length);

    // Emoji & message based on performance
    let emoji, message, sub;
    if (avgAccuracy >= 95 && avgWpm >= 100) {
        emoji = '🏆'; message = 'Unglaublich gut!';
        sub = 'Ein wirklich beeindruckendes Ergebnis!';
    } else if (avgAccuracy >= 85) {
        emoji = '⭐'; message = 'Super gemacht!';
        sub = 'Du wirst von Mal zu Mal besser!';
    } else if (avgAccuracy >= 70) {
        emoji = '💪'; message = 'Gut gelesen!';
        sub = 'Mit jedem Üben wird es leichter!';
    } else {
        emoji = '📖'; message = 'Weiter üben!';
        sub = 'Regelmäßiges Lesen macht den Unterschied!';
    }

    document.getElementById('summaryEmoji').textContent = emoji;
    document.getElementById('summaryMessage').textContent = message;
    document.getElementById('summarySub').textContent = sub;

    document.getElementById('sumPages').textContent = pages.length;
    document.getElementById('sumDuration').textContent = Math.round(totalDurationMin);
    document.getElementById('sumWpm').textContent = avgWpm;
    document.getElementById('sumAccuracy').textContent = avgAccuracy + '%';

    // Pages list
    const list = document.getElementById('pagesList');
    list.innerHTML = pages.map(p => `
        <div class="page-row">
            <div class="page-num">${p.page}</div>
            <div class="page-stats">
                <div class="page-stat">⚡ <strong>${p.wpm}</strong> W/min</div>
                <div class="page-stat">🎯 <strong>${p.accuracy}%</strong></div>
                <div class="page-stat">⏱️ ${p.duration}s</div>
            </div>
        </div>
    `).join('');
}

// ══════════════════════════════════
// NEW SESSION
// ══════════════════════════════════
function newSession() {
    showScreen('screenStart');
}

// ══════════════════════════════════
// HELPERS
// ══════════════════════════════════
function normalizeText(text) {
    return text
        .toLowerCase()
        // Normalize German umlauts (in case of encoding differences)
        .replace(/ä/g, 'ä').replace(/ö/g, 'ö').replace(/ü/g, 'ü')
        .replace(/Ä/g, 'ä').replace(/Ö/g, 'ö').replace(/Ü/g, 'ü')
        .replace(/ß/g, 'ss')
        // Remove all punctuation and special characters
        .replace(/[.,\/#!$%\^&\*;:{}=_`~()?"'»«„"\-–—]/g, ' ')
        // Remove line breaks and tabs (treat as spaces)
        .replace(/[\r\n\t]/g, ' ')
        // Normalize multiple spaces
        .replace(/\s+/g, ' ')
        .trim();
}

function calculateAccuracy(reference, recognized) {
    if (reference.length === 0) return 0;

    // Longest Common Subsequence - finds all correctly read words
    // regardless of position shifts, insertions or deletions
    const m = reference.length;
    const n = recognized.length;

    // For long texts, limit to avoid performance issues
    const refSlice = reference.slice(0, Math.min(m, 300));
    const recSlice = recognized.slice(0, Math.min(n, 300));

    const dp = Array.from({ length: refSlice.length + 1 },
        () => new Array(recSlice.length + 1).fill(0));

    for (let i = 1; i <= refSlice.length; i++) {
        for (let j = 1; j <= recSlice.length; j++) {
            if (refSlice[i - 1] === recSlice[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const lcs = dp[refSlice.length][recSlice.length];
    return Math.round((lcs / reference.length) * 100);
}

function showStatus(msg, type, elementId) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = `<div class="status ${type}">${msg}</div>`;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
</script>
</body>
</html>
