// ─── DATA STORE (Sincronizado com o Backend) ───────────────────────────
const DB = {
  courses: [],
  activities: [],
  systems: [],
  news: [],
  
  async loadAll() {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Erro na resposta do servidor');
      const data = await response.json();
      
      this.courses = data.courses || [];
      this.activities = data.activities || [];
      this.systems = data.systems || [];
      this.news = data.news || [];

      renderPublicAll();
      if (document.getElementById('admin-panel').classList.contains('active')) {
        renderAdminAll();
      }
    } catch (err) {
      console.error("Erro ao carregar dados do servidor:", err);
      toast("❌ Erro ao conectar com o servidor.");
    }
  }
};

// ─── CREDENTIALS (obfuscated) ────────────────────────────────────────────────
const _u = atob('YW5jb3JhX2FkbWlu');    
const _p = atob('QW5jb3JhQDIwMjUh');  

// ─── NAV ─────────────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

function toggleMobile() {
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMobile() {
  document.getElementById('mobile-menu').classList.remove('open');
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function openLogin() {
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-overlay').classList.add('active');
  setTimeout(() => document.getElementById('login-user').focus(), 100);
}
function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  if (u === _u && p === _p) {
    closeOverlay('login-overlay');
    showAdmin();
  } else {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-pass').focus();
  }
}
function adminLogout() {
  showSite();
  toast('Sessão terminada com sucesso.');
}

// ─── VIEW SWITCHING ───────────────────────────────────────────────────────────
function showAdmin() {
  document.getElementById('main-site').classList.add('hidden');
  document.getElementById('admin-panel').classList.add('active');
  renderAdminAll();
  window.scrollTo(0, 0);
}
function showSite() {
  document.getElementById('main-site').classList.remove('hidden');
  document.getElementById('admin-panel').classList.remove('active');
  renderPublicAll();
  window.scrollTo(0, 0);
}

// ─── ADMIN TABS ───────────────────────────────────────────────────────────────
document.getElementById('admin-nav').addEventListener('click', e => {
  if (!e.target.classList.contains('admin-tab')) return;
  const tab = e.target.dataset.tab;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.toggle('active', s.id === 'tab-'+tab));
});

// ─── MODALS ───────────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeOverlay(id) { document.getElementById(id).classList.remove('active'); }
document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); });
});

// ─── TOAST ────────────────────────────────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  if(t) {
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
function fmtPrice(p) {
  return Number(p).toLocaleString('pt-AO') + ' AOA';
}
function waLink(course) {
  const msg = encodeURIComponent(`Olá! Tenho interesse em comprar o curso: *${course.name}*\nCategoria: ${course.cat}\nPreço: ${fmtPrice(course.price)}\n\nGostaria de mais informações sobre como proceder com a inscrição.`);
  return `https://wa.me/244946212157?text=${msg}`;
}

// ─── COURSES ──────────────────────────────────────────────────────────────────
async function saveCourse() {
  const id = document.getElementById('course-edit-id').value;
  const name = document.getElementById('c-name').value.trim();
  const cat = document.getElementById('c-cat').value;
  const level = document.getElementById('c-level').value;
  const duration = document.getElementById('c-duration').value.trim();
  const price = document.getElementById('c-price').value;
  const icon = document.getElementById('c-icon').value.trim() || '📚';
  const desc = document.getElementById('c-desc').value.trim();

  if (!name || !cat || !level || !price || !desc) { toast('⚠️ Preenche todos os campos obrigatórios.'); return; }

  const courseData = { name, cat, level, duration, price: parseFloat(price), icon, desc };
  const url = id ? `/api/courses/${id}` : '/api/courses';
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    if (res.ok) {
      toast(id ? '✅ Curso actualizado com sucesso!' : '✅ Curso adicionado com sucesso!');
      closeOverlay('course-modal');
      resetCourseModal();
      DB.loadAll();
    }
  } catch (err) {
    toast('❌ Erro ao guardar o curso.');
  }
}

function editCourse(id) {
  const c = DB.courses.find(x => String(x.id) === String(id));
  if (!c) return;
  document.getElementById('course-modal-title').textContent = 'Editar Curso';
  document.getElementById('course-edit-id').value = c.id;
  document.getElementById('c-name').value = c.name;
  document.getElementById('c-cat').value = c.cat;
  document.getElementById('c-level').value = c.level;
  document.getElementById('c-duration').value = c.duration;
  document.getElementById('c-price').value = c.price;
  document.getElementById('c-icon').value = c.icon;
  document.getElementById('c-desc').value = c.desc;
  openModal('course-modal');
}

async function deleteCourse(id) {
  if (!confirm('Tens a certeza que queres eliminar este curso?')) return;
  try {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast('🗑️ Curso eliminado.');
      DB.loadAll();
    }
  } catch (err) {
    toast('❌ Erro ao eliminar o curso.');
  }
}

function resetCourseModal() {
  document.getElementById('course-modal-title').textContent = 'Novo Curso';
  document.getElementById('course-edit-id').value = '';
  ['c-name','c-cat','c-level','c-duration','c-price','c-icon','c-desc'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
}
const cModalClose = document.getElementById('course-modal')?.querySelector('.modal-close');
if(cModalClose) cModalClose.addEventListener('click', resetCourseModal);

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
async function saveActivity() {
  const id = document.getElementById('activity-edit-id').value;
  const title = document.getElementById('a-title').value.trim();
  const date = document.getElementById('a-date').value;
  const location = document.getElementById('a-location').value.trim();
  const icon = document.getElementById('a-icon').value.trim() || '🗓️';
  const desc = document.getElementById('a-desc').value.trim();

  if (!title || !date || !desc) { toast('⚠️ Preenche todos os campos obrigatórios.'); return; }

  const activityData = { title, date, location, icon, desc };
  const url = id ? `/api/activities/${id}` : '/api/activities';
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData)
    });
    if (res.ok) {
      toast(id ? '✅ Atividade actualizada!' : '✅ Atividade adicionada!');
      closeOverlay('activity-modal');
      DB.loadAll();
    }
  } catch (err) {
    toast('❌ Erro ao guardar atividade.');
  }
}

function editActivity(id) {
  const a = DB.activities.find(x => String(x.id) === String(id));
  if (!a) return;
  document.getElementById('activity-modal-title').textContent = 'Editar Atividade';
  document.getElementById('activity-edit-id').value = a.id;
  document.getElementById('a-title').value = a.title;
  document.getElementById('a-date').value = a.date;
  document.getElementById('a-location').value = a.location;
  document.getElementById('a-icon').value = a.icon;
  document.getElementById('a-desc').value = a.desc;
  openModal('activity-modal');
}

async function deleteActivity(id) {
  if (!confirm('Eliminar esta atividade?')) return;
  try {
    const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast('🗑️ Atividade eliminada.');
      DB.loadAll();
    }
  } catch (err) {
    toast('❌ Erro ao eliminar atividade.');
  }
}

// ─── SYSTEMS ──────────────────────────────────────────────────────────────────
async function saveSystem() {
  const id = document.getElementById('system-edit-id').value;
  const name = document.getElementById('s-name').value.trim();
  const icon = document.getElementById('s-icon').value.trim() || '🖥️';
  const desc = document.getElementById('s-desc').value.trim();

  if (!name || !desc) { toast('⚠️ Preenche todos os campos obrigatórios.'); return; }

  const systemData = { name, icon, desc };
  const url = id ? `/api/systems/${id}` : '/api/systems';
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(systemData)
    });
    if (res.ok) {
      toast(id ? '✅ Sistema actualizado!' : '✅ Sistema adicionado!');
      closeOverlay('system-modal');
      DB.loadAll();
    }
  } catch (err) {
    toast('❌ Erro ao guardar o sistema.');
  }
}

function editSystem(id) {
  const s = DB.systems.find(x => String(x.id) === String(id));
  if (!s) return;
  document.getElementById('system-modal-title').textContent = 'Editar Sistema';
  document.getElementById('system-edit-id').value = s.id;
  document.getElementById('s-name').value = s.name;
  document.getElementById('s-icon').value = s.icon;
  document.getElementById('s-desc').value = s.desc;
  openModal('system-modal');
}

async function deleteSystem(id) {
  if (!confirm('Eliminar este sistema?')) return;
  try {
    const res = await fetch(`/api/systems/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast('🗑️ Sistema eliminado.');
      DB.loadAll();
    }
  } catch (err) {
    toast('❌ Erro ao eliminar o sistema.');
  }
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────
async function saveNews() {
  const id = document.getElementById('n-edit-id').value;
  const title = document.getElementById('n-title').value.trim();
  const date = document.getElementById('n-date').value;
  const icon = document.getElementById('n-icon').value.trim() || '📰';
  const excerpt = document.getElementById('n-excerpt').value.trim();

  if (!title || !date || !excerpt) { toast('⚠️ Preenche todos os campos obrigatórios.'); return; }

  const newsData = { title, date, icon, excerpt };
  const url = id ? `/api/news/${id}` : '/api/news';
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
    if (res.ok) {
      toast(id ? '✅ Notícia actualizada!' : '✅ Notícia publicada!');
      closeOverlay('news-modal');
      DB.loadAll();
    }
  } catch (err) {
    toast('❌ Erro ao guardar notícia.');
  }
}

function editNews(id) {
  const n = DB.news.find(x => String(x.id) === String(id));
  if (!n) return;
  document.getElementById('news-modal-title').textContent = 'Editar Notícia';
  document.getElementById('n-edit-id').value = n.id;
  document.getElementById('n-title').value = n.title;
  document.getElementById('n-date').value = n.date;
  document.getElementById('n-icon').value = n.icon;
  document.getElementById('n-excerpt').value = n.excerpt;
  openModal('news-modal');
}

async function deleteNews(id) {
  if (!confirm('Eliminar esta notícia?')) return;
  try {
    const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast('🗑️ Notícia eliminada.');
      DB.loadAll();
    }
  } catch (err) {
    toast('❌ Erro ao eliminar notícia.');
  }
}

// ─── RENDER: PUBLIC ───────────────────────────────────────────────────────────
function renderCourses() {
  const grid = document.getElementById('courses-grid');
  if(!grid) return;
  if (!DB.courses.length) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">📚</div><p>Nenhum curso disponível ainda.<br>O administrador adicionará em breve.</p></div>`;
    return;
  }
  grid.innerHTML = DB.courses.map(c => `
    <div class="course-card fade-in visible">
      <div class="course-thumb">
        <span class="course-thumb-icon">
            <img src="${c.icon}" alt="${c.name}">
        </span>
        <span class="course-badge">${c.level}</span>
      </div>
      <div class="course-body">
        <div class="course-cat">${c.cat}</div>
        <div class="course-name">${c.name}</div>
        <div class="course-desc">${c.desc.slice(0,110)}${c.desc.length>110?'...':''}</div>
        <div class="course-meta">
          ${c.duration ? `<div class="course-meta-item">⏱️ ${c.duration}</div>` : ''}
          <div class="course-meta-item">📊 ${c.level}</div>
        </div>
        <div class="course-footer">
          <div class="course-price">${Number(c.price).toLocaleString('pt-AO')} <small>AOA</small></div>
          <a href="${waLink(c)}" target="_blank" class="btn-buy">Comprar via WhatsApp</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderActivities() {
  const grid = document.getElementById('activities-grid');
  if(!grid) return;
  if (!DB.activities.length) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🗓️</div><p>Nenhuma atividade agendada.<br>Fique atento às novidades!</p></div>`;
    return;
  }
  const sorted = [...DB.activities].sort((a,b) => a.date > b.date ? 1 : -1);
  grid.innerHTML = sorted.map(a => `
    <div class="activity-card fade-in visible">
      <div class="act-date">${fmtDate(a.date)}</div>
      <div class="act-title">${a.icon} ${a.title}</div>
      <div class="act-desc">${a.desc}</div>
      ${a.location ? `<div class="act-location">📍 ${a.location}</div>` : ''}
    </div>
  `).join('');
}

function renderSystems() {
  const grid = document.getElementById('systems-grid');
  if(!grid) return;
  if (!DB.systems.length) {
    grid.innerHTML = `<div class="empty-state" style="color:rgba(255,255,255,.3)"><div class="empty-icon">🚀</div><p>Em breve os primeiros sistemas serão publicados aqui.</p></div>`;
    return;
  }
  grid.innerHTML = DB.systems.map(s => `
    <div class="system-card fade-in visible">
      <div class="sys-icon">${s.icon}</div>
      <div class="sys-title">${s.name}</div>
      <div class="sys-desc">${s.desc}</div>
      <div class="sys-status">Finalizado</div>
    </div>
  `).join('');
}

function renderNews() {
  const grid = document.getElementById('news-grid');
  if(!grid) return;
  if (!DB.news.length) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">📰</div><p>Novidades a caminho! Volte em breve.</p></div>`;
    return;
  }
  const sorted = [...DB.news].sort((a,b) => a.date < b.date ? 1 : -1);
  grid.innerHTML = sorted.map(n => `
    <div class="news-card fade-in visible">
      <div class="news-img">${n.icon}</div>
      <div class="news-body">
        <div class="news-date">${fmtDate(n.date)}</div>
        <div class="news-title">${n.title}</div>
        <div class="news-excerpt">${n.excerpt}</div>
      </div>
    </div>
  `).join('');
}

function updateStats() {
  const cEl = document.getElementById('stat-cursos');
  const sEl = document.getElementById('stat-sistemas');
  if(cEl) cEl.textContent = DB.courses.length + '+';
  if(sEl) sEl.textContent = DB.systems.length;
}

function renderPublicAll() {
  renderCourses(); renderActivities(); renderSystems(); renderNews(); updateStats();
}

// ─── RENDER: ADMIN ────────────────────────────────────────────────────────────
function renderAdminCourses() {
  const tbody = document.getElementById('admin-courses-tbody');
  if(!tbody) return;
  if (!DB.courses.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:40px">Nenhum curso registado ainda.</td></tr>`;
    return;
  }
  tbody.innerHTML = DB.courses.map(c => `
    <tr>
      <td><strong>${c.icon} ${c.name}</strong></td>
      <td>${c.cat}</td>
      <td>${c.duration || '—'}</td>
      <td>${c.level}</td>
      <td><span class="price-badge">${Number(c.price).toLocaleString('pt-AO')} AOA</span></td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editCourse('${c.id}')">Editar</button>
          <button class="btn-delete" onclick="deleteCourse('${c.id}')">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderAdminActivities() {
  const tbody = document.getElementById('admin-activities-tbody');
  if(!tbody) return;
  if (!DB.activities.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:40px">Nenhuma atividade registada ainda.</td></tr>`;
    return;
  }
  tbody.innerHTML = DB.activities.map(a => `
    <tr>
      <td><strong>${a.icon} ${a.title}</strong></td>
      <td>${fmtDate(a.date)}</td>
      <td>${a.location || '—'}</td>
      <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.desc.slice(0,60)}...</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editActivity('${a.id}')">Editar</button>
          <button class="btn-delete" onclick="deleteActivity('${a.id}')">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderAdminSystems() {
  const tbody = document.getElementById('admin-systems-tbody');
  if(!tbody) return;
  if (!DB.systems.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:40px">Nenhum sistema registado ainda.</td></tr>`;
    return;
  }
  tbody.innerHTML = DB.systems.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td style="font-size:24px">${s.icon}</td>
      <td style="max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.desc.slice(0,70)}...</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editSystem('${s.id}')">Editar</button>
          <button class="btn-delete" onclick="deleteSystem('${s.id}')">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderAdminNews() {
  const tbody = document.getElementById('admin-news-tbody');
  if(!tbody) return;
  if (!DB.news.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:40px">Nenhuma notícia registada ainda.</td></tr>`;
    return;
  }
  tbody.innerHTML = DB.news.map(n => `
    <tr>
      <td><strong>${n.icon} ${n.title}</strong></td>
      <td>${fmtDate(n.date)}</td>
      <td style="max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n.excerpt.slice(0,60)}...</td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="editNews('${n.id}')">Editar</button>
          <button class="btn-delete" onclick="deleteNews('${n.id}')">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderAdminAll() {
  renderAdminCourses(); renderAdminActivities(); renderAdminSystems(); renderAdminNews();
}

// ─── SCROLL ANIMATIONS ────────────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// ─── INIT ─────────────────────────────────────────────────────────────────────
DB.loadAll();