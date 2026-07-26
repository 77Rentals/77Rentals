/* ───── Guest experiences board — shared logic ─────
   Loaded on experiencias.html (public board + submission form) and
   admin-experiencias.html (moderation). Reads window.GE_CONFIG set by the
   including page, and window.SUPABASE_URL/SUPABASE_ANON_KEY from
   supabase-config.js. */

const GE_BUCKET = 'guest-experience-photos';
const GE_MAX_IMAGES = 5;
const GE_MAX_ORIGINAL_BYTES = 15 * 1024 * 1024; // 15MB pre-compression hard cap
const GE_TARGET_LONG_EDGE = 1600;
const GE_JPEG_QUALITY = 0.8;

let geClient = null;
function geGetClient() {
  if (!geClient) {
    geClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  return geClient;
}

function geEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

const GE_MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const GE_MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const GE_MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
function geFormatMonthYear(dateStr, lang) {
  // dateStr is 'YYYY-MM-DD'; parse manually to avoid timezone shifting the month.
  const [y, m] = dateStr.split('-').map(Number);
  const months = lang === 'en' ? GE_MONTHS_EN : lang === 'fr' ? GE_MONTHS_FR : GE_MONTHS_ES;
  const month = months[m - 1] || '';
  return lang === 'en' ? `${month} ${y}` : `${month.charAt(0).toUpperCase()}${month.slice(1)} ${y}`;
}

function gePublicUrl(path) {
  const { data } = geGetClient().storage.from(GE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* ── Image compression (canvas-based, no external library) ── */
function geCompressImage(file) {
  return new Promise((resolve) => {
    if (file.size > GE_MAX_ORIGINAL_BYTES) {
      resolve({ ok: false, error: 'too-large' });
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(objectUrl);
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > GE_TARGET_LONG_EDGE || height > GE_TARGET_LONG_EDGE) {
          if (width >= height) {
            height = Math.round(height * (GE_TARGET_LONG_EDGE / width));
            width = GE_TARGET_LONG_EDGE;
          } else {
            width = Math.round(width * (GE_TARGET_LONG_EDGE / height));
            height = GE_TARGET_LONG_EDGE;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          cleanup();
          if (blob) resolve({ ok: true, blob });
          else resolve({ ok: true, blob: file }); // fallback: original file
        }, 'image/jpeg', GE_JPEG_QUALITY);
      } catch (e) {
        cleanup();
        resolve({ ok: true, blob: file }); // decode failed (e.g. HEIC) — upload original
      }
    };
    img.onerror = () => {
      cleanup();
      resolve({ ok: true, blob: file }); // can't decode client-side — upload original as-is
    };
    img.src = objectUrl;
  });
}

async function geUploadImages(files, property, submissionId, onProgress) {
  const client = geGetClient();
  const paths = [];
  for (let i = 0; i < files.length; i++) {
    onProgress && onProgress(i + 1, files.length);
    const result = await geCompressImage(files[i]);
    if (!result.ok) continue; // skip files that failed the hard size cap
    const path = `${property}/${submissionId}/${i + 1}.jpg`;
    const { error } = await client.storage.from(GE_BUCKET).upload(path, result.blob, {
      contentType: 'image/jpeg',
      upsert: false,
    });
    if (!error) paths.push(path);
  }
  return paths;
}

/* ══════════ PUBLIC BOARD PAGE (experiencias.html) ══════════ */

function geCurrentLang() {
  const l = document.documentElement.lang;
  return (l === 'en' || l === 'fr') ? l : 'es';
}

function geSetLang(l) {
  document.documentElement.lang = l;
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === l);
  });
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = el.dataset[l];
  });
  document.querySelectorAll('[data-es-placeholder]').forEach(el => {
    el.placeholder = el.dataset[l + 'Placeholder'];
  });
  geLoadBoard(); // re-render approved cards so month/year labels switch language too
}

function geRenderCard(row) {
  const lang = geCurrentLang();
  const dateLabel = geFormatMonthYear(row.stay_start, lang);
  const photosHtml = (row.image_paths || []).map((path) => {
    const url = gePublicUrl(path);
    return `<img class="ge-photo" src="${geEscapeHtml(url)}" alt="" loading="lazy" onclick="openLB('${url.replace(/'/g, "\\'")}')">`;
  }).join('');

  const recoLabel = lang === 'en' ? 'Recommends:' : lang === 'fr' ? 'Recommande :' : 'Recomienda:';
  const recoBlock = row.recommendations_text
    ? `<div class="ge-reco"><span class="ge-reco-label">📍 ${recoLabel}</span> ${geEscapeHtml(row.recommendations_text)}</div>`
    : '';

  return `
  <div class="ge-card">
    <div class="ge-card-head">
      <span class="ge-guest-name">${geEscapeHtml(row.guest_name)}</span>
      <span class="ge-date">${dateLabel}</span>
    </div>
    <p class="ge-quote">"${geEscapeHtml(row.review_text)}"</p>
    ${recoBlock}
    ${photosHtml ? `<div class="ge-photos">${photosHtml}</div>` : ''}
  </div>`;
}

async function geLoadBoard() {
  const list = document.getElementById('ge-board-list');
  const empty = document.getElementById('ge-board-empty');
  if (!list) return;
  let client;
  try {
    client = geGetClient();
  } catch (e) {
    const lang = geCurrentLang();
    const msg = lang === 'en' ? 'Guest board is not configured yet.' : lang === 'fr' ? "Le tableau des expériences n'est pas encore configuré." : 'El tablero de experiencias aún no está configurado.';
    list.innerHTML = `<p class="ge-error-msg">${msg}</p>`;
    return;
  }
  const { data, error } = await client
    .from('guest_experiences')
    .select('guest_name,stay_start,review_text,recommendations_text,image_paths,created_at')
    .eq('property', window.GE_CONFIG.property)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    const lang = geCurrentLang();
    const msg = lang === 'en' ? 'Could not load experiences right now.' : lang === 'fr' ? "Impossible de charger les expériences pour le moment." : 'No se pudieron cargar las experiencias en este momento.';
    list.innerHTML = `<p class="ge-error-msg">${msg}</p>`;
    return;
  }
  if (!data || data.length === 0) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  list.innerHTML = data.map(geRenderCard).join('');
}

function geSetFormBusy(busy, msg) {
  const btn = document.getElementById('ge-submit-btn');
  const status = document.getElementById('ge-form-status');
  if (btn) btn.disabled = busy;
  if (status) status.textContent = msg || '';
}

async function geHandleSubmit(evt) {
  evt.preventDefault();
  const lang = geCurrentLang();
  const form = evt.target;

  // Honeypot — if filled, silently pretend success without writing anything.
  const hp = form.querySelector('[name="ge-hp"]');
  if (hp && hp.value.trim() !== '') {
    form.reset();
    geShowConfirmation();
    return;
  }

  const guestName = form.querySelector('[name="guest_name"]').value.trim();
  const stayStart = form.querySelector('[name="stay_start"]').value;
  const stayEnd = form.querySelector('[name="stay_end"]').value;
  const reviewText = form.querySelector('[name="review_text"]').value.trim();
  const recoText = form.querySelector('[name="recommendations_text"]').value.trim();
  const fileInput = form.querySelector('[name="photos"]');
  const files = fileInput && fileInput.files ? Array.from(fileInput.files).slice(0, GE_MAX_IMAGES) : [];

  if (!guestName || !stayStart || !stayEnd || !reviewText) {
    geSetFormBusy(false, lang === 'en' ? 'Please fill in all required fields.' : lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires.' : 'Por favor completa todos los campos obligatorios.');
    return;
  }
  if (reviewText.length > 1000 || recoText.length > 400) {
    geSetFormBusy(false, lang === 'en' ? 'Text is too long.' : lang === 'fr' ? 'Le texte est trop long.' : 'El texto es demasiado largo.');
    return;
  }

  geSetFormBusy(true, lang === 'en' ? 'Submitting…' : lang === 'fr' ? 'Envoi en cours…' : 'Enviando…');

  try {
    const submissionId = crypto.randomUUID();
    let imagePaths = [];
    if (files.length > 0) {
      imagePaths = await geUploadImages(files, window.GE_CONFIG.property, submissionId, (i, n) => {
        geSetFormBusy(true, lang === 'en' ? `Uploading photo ${i} of ${n}…` : lang === 'fr' ? `Envoi de la photo ${i} sur ${n}…` : `Subiendo foto ${i} de ${n}…`);
      });
    }

    const client = geGetClient(); // throws synchronously if misconfigured — caught below
    const { error } = await client.from('guest_experiences').insert({
      id: submissionId,
      property: window.GE_CONFIG.property,
      guest_name: guestName,
      stay_start: stayStart,
      stay_end: stayEnd,
      review_text: reviewText,
      recommendations_text: recoText || null,
      image_paths: imagePaths,
    });

    if (error) throw error;

    form.reset();
    geSetFormBusy(false, '');
    geShowConfirmation();
  } catch (e) {
    geSetFormBusy(false, lang === 'en' ? 'Something went wrong. Please try again.' : lang === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'Algo salió mal. Por favor intenta de nuevo.');
  }
}

function geShowConfirmation() {
  const form = document.getElementById('ge-form');
  const confirmation = document.getElementById('ge-confirmation');
  if (form) form.style.display = 'none';
  if (confirmation) confirmation.style.display = 'block';
}

function geInitBoardPage() {
  const form = document.getElementById('ge-form');
  if (form) form.addEventListener('submit', geHandleSubmit);
  geLoadBoard();
}

/* ══════════ ADMIN PAGE (admin-experiencias.html) ══════════ */

function geAdminSetStatus(msg) {
  const el = document.getElementById('ge-admin-status');
  if (el) el.textContent = msg || '';
}

async function geAdminLogin(evt) {
  evt.preventDefault();
  const email = document.getElementById('ge-admin-email').value.trim();
  const password = document.getElementById('ge-admin-password').value;
  geAdminSetStatus('Ingresando…');
  const client = geGetClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    geAdminSetStatus('Credenciales incorrectas.');
    return;
  }
  geAdminSetStatus('');
  geAdminShowPanel();
}

async function geAdminLogout() {
  await geGetClient().auth.signOut();
  document.getElementById('ge-admin-login').style.display = 'block';
  document.getElementById('ge-admin-panel').style.display = 'none';
}

function geAdminCardHtml(row, tab) {
  const photosHtml = (row.image_paths || []).map((path) => {
    const url = gePublicUrl(path);
    return `<img class="ge-photo" src="${geEscapeHtml(url)}" alt="" loading="lazy" onclick="window.open('${url.replace(/'/g, "\\'")}','_blank')">`;
  }).join('');

  let actions = '';
  if (tab === 'pending') {
    actions = `
      <button class="ge-btn ge-btn-approve" onclick="geAdminModerate('${row.id}','approve')">✓ Aprobar</button>
      <button class="ge-btn ge-btn-reject" onclick="geAdminModerate('${row.id}','reject')">✕ Rechazar</button>`;
  } else if (tab === 'approved') {
    actions = `<button class="ge-btn ge-btn-reject" onclick="geAdminModerate('${row.id}','reject')">✕ Quitar / Rechazar</button>`;
  } else if (tab === 'rejected') {
    actions = `<button class="ge-btn ge-btn-approve" onclick="geAdminModerate('${row.id}','approve')">✓ Aprobar</button>
      <button class="ge-btn ge-btn-pending" onclick="geAdminModerate('${row.id}','pending')">↺ Volver a pendiente</button>`;
  }

  return `
  <div class="ge-admin-card">
    <div class="ge-card-head">
      <span class="ge-guest-name">${geEscapeHtml(row.guest_name)}</span>
      <span class="ge-property-badge">${geEscapeHtml(row.property)}</span>
    </div>
    <div class="ge-date">${row.stay_start} → ${row.stay_end} · enviado ${new Date(row.created_at).toLocaleDateString('es-CO')}</div>
    <p class="ge-quote">"${geEscapeHtml(row.review_text)}"</p>
    ${row.recommendations_text ? `<div class="ge-reco"><span class="ge-reco-label">📍 Recomienda:</span> ${geEscapeHtml(row.recommendations_text)}</div>` : ''}
    ${photosHtml ? `<div class="ge-photos">${photosHtml}</div>` : ''}
    <div class="ge-admin-actions">${actions}</div>
  </div>`;
}

async function geAdminLoadTab(tab) {
  const list = document.getElementById('ge-admin-list');
  if (!list) return;
  list.innerHTML = '<p>Cargando…</p>';

  const client = geGetClient();
  let query = client.from('guest_experiences').select('*').order('created_at', { ascending: false });
  if (tab === 'pending') query = query.eq('approved', false).eq('rejected', false);
  else if (tab === 'approved') query = query.eq('approved', true);
  else if (tab === 'rejected') query = query.eq('rejected', true);

  const { data, error } = await query;
  if (error) {
    list.innerHTML = `<p class="ge-error-msg">Error cargando: ${geEscapeHtml(error.message)}</p>`;
    return;
  }
  if (!data || data.length === 0) {
    list.innerHTML = '<p>No hay elementos aquí.</p>';
    return;
  }
  list.innerHTML = data.map((row) => geAdminCardHtml(row, tab)).join('');
}

let geAdminCurrentTab = 'pending';
function geAdminSwitchTab(tab) {
  geAdminCurrentTab = tab;
  document.querySelectorAll('.ge-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  geAdminLoadTab(tab);
}

async function geAdminModerate(id, action) {
  const client = geGetClient();
  const patch = action === 'approve'
    ? { approved: true, rejected: false, approved_at: new Date().toISOString() }
    : action === 'reject'
    ? { approved: false, rejected: true }
    : { approved: false, rejected: false, approved_at: null }; // back to pending

  const { error } = await client.from('guest_experiences').update(patch).eq('id', id);
  if (error) {
    alert('Error: ' + error.message);
    return;
  }
  geAdminLoadTab(geAdminCurrentTab);
}

function geAdminShowPanel() {
  document.getElementById('ge-admin-login').style.display = 'none';
  document.getElementById('ge-admin-panel').style.display = 'block';
  geAdminSwitchTab('pending');
}

async function geInitAdminPage() {
  const loginForm = document.getElementById('ge-admin-login-form');
  if (loginForm) loginForm.addEventListener('submit', geAdminLogin);

  const logoutBtn = document.getElementById('ge-admin-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', geAdminLogout);

  document.querySelectorAll('.ge-tab').forEach((btn) => {
    btn.addEventListener('click', () => geAdminSwitchTab(btn.dataset.tab));
  });

  let client;
  try {
    client = geGetClient();
  } catch (e) {
    geAdminSetStatus('El tablero aún no está configurado (falta Supabase URL/clave).');
    return;
  }
  const { data } = await client.auth.getSession();
  if (data && data.session) {
    geAdminShowPanel();
  }
}
