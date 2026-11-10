let allFoods = [];
let currentLanguage = 'ja';
let wasteTotal = 0;
const text = key => (window.appMessages?.[currentLanguage] || {})[key] || key;

document.addEventListener('DOMContentLoaded', () => {
  currentLanguage = localStorage.getItem('fridge-language') || 'ja';
  checkLoginStatus();
  document.getElementById('profileToggle')?.addEventListener('click', toggleProfile);
  document.getElementById('profileForm')?.addEventListener('submit', saveProfile);
  document.getElementById('languageSelect')?.addEventListener('change', async event => {
    currentLanguage = event.target.value;
    const profileLanguage = document.getElementById('profileLanguage');
    if (profileLanguage) profileLanguage.value = currentLanguage;
    await saveProfile();
    await refreshLocalizedData();
  });
  document.getElementById('profileLanguage')?.addEventListener('change', event => {
    document.getElementById('languageSelect').value = event.target.value;
    currentLanguage = event.target.value;
    window.applyLanguage?.(currentLanguage);
    displayFoods(allFoods);
    loadSuggestions();
  });
});

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = document.querySelector('meta[name="_csrf"]')?.content;
  const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;
  if (token && csrfHeader) headers[csrfHeader] = token;
  return fetch(url, { ...options, headers });
}

async function checkLoginStatus() {
  try {
    const response = await api('/api/auth/status');
    const data = await response.json();
    const loggedIn = data.isLoggedIn;
    const userInfo = document.getElementById('user-info');
    if (userInfo) userInfo.style.display = loggedIn ? 'flex' : 'none';
    const loginLink = document.getElementById('loginLink');
    if (loginLink) loginLink.style.display = loggedIn ? 'none' : 'block';
    const addPanel = document.getElementById('add-form-container');
    if (addPanel) addPanel.style.display = loggedIn ? 'block' : 'none';
    if (!loggedIn) return displayFoods([]);
    document.getElementById('display-username').textContent = data.username;
    await loadProfile();
    await Promise.all([loadFoods(), loadSuggestions(), loadWasteHistory()]);
  } catch (error) {
    console.error('Could not load account state', error);
    displayFoods([]);
  }
}

async function handleLogout() {
  if (!confirm(text('logoutConfirm'))) return;
  try { await api('/logout', { method: 'POST' }); location.href = '/login'; }
  catch (error) { console.error(error); }
}

async function loadFoods() {
  try {
    const response = await api('/api/foods');
    if (!response.ok) throw new Error(String(response.status));
    allFoods = await response.json();
    displayFoods(allFoods);
  } catch (error) { console.error('Unable to load inventory', error); }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

function categoryName(value) {
  const keys = { '野菜':'vegetables', '肉・魚':'meatFish', '調味料':'condiments', '乳製品':'dairy', 'パン・ご飯':'breadRice', '果物':'fruit', 'その他':'other' };
  return text(keys[value]) || value || text('other');
}

function localizedStatus(food) {
  if (currentLanguage !== 'en') return food.statusMessage;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${food.expiryDate}T00:00:00`);
  const days = Math.ceil((expiry - today) / 86400000);
  if (days <= 0) return text('expired');
  if (days <= 3) return `${text('useWithin')} ${days} ${text('days')}`;
  return `${days} ${text('daysLeft')}`;
}

function updateSummary() {
  document.getElementById('totalCount').textContent = allFoods.length;
  document.getElementById('expiringCount').textContent = allFoods.filter(food => ['warning', 'danger'].includes(food.status)).length;
  document.getElementById('wasteCount').textContent = wasteTotal;
}

function displayFoods(foods) {
  const list = document.getElementById('foodList');
  if (!list) return;
  list.innerHTML = '';
  updateSummary();
  if (!foods.length) {
    list.innerHTML = `<div class="empty-state"><span class="empty-icon">✳</span><p>${escapeHtml(text('emptyInventory'))}</p></div>`;
    return;
  }
  foods.forEach(food => {
    const card = document.createElement('article');
    card.className = `food-card ${escapeHtml(food.status)}`;
    const status = food.quantity <= 0 ? text('outOfStock') : localizedStatus(food);
    card.innerHTML = `
      <div class="food-card-top"><span class="category-badge">${escapeHtml(categoryName(food.category))}</span>
        <label class="check-label"><input type="checkbox" ${food.needsRestock ? 'checked' : ''} onchange="updateFoodInfo(${food.id},{needsRestock:this.checked})"><span>${escapeHtml(text('restock'))}</span></label>
      </div>
      <h3>${escapeHtml(food.name)}</h3>
      <p class="food-status"><span class="status-dot"></span><strong>${escapeHtml(status)}</strong></p>
      <div class="food-meta"><span>${escapeHtml(text('expiry'))}</span><strong>${escapeHtml(food.expiryDate)}</strong></div>
      <div class="food-date-edit"><label for="input-date-${food.id}">${escapeHtml(text('newExpiry'))}</label><div class="date-edit-controls"><input type="date" id="input-date-${food.id}" aria-label="${escapeHtml(text('newExpiry'))}"><button class="quiet-button" onclick="manualDateUpdate(${food.id})">${escapeHtml(text('update'))}</button></div></div>
      <div class="food-card-bottom"><label class="quantity-label">${escapeHtml(text('quantity'))}<input type="number" value="${food.quantity}" min="0" onchange="updateFoodInfo(${food.id},{quantity:parseInt(this.value)})"></label>
        <div class="food-actions"><button class="waste-button" onclick="recordWaste(${food.id},${food.quantity})">${escapeHtml(text('markWaste'))}</button><button class="remove-button" onclick="deleteFood(${food.id})" aria-label="${escapeHtml(text('remove'))}">×</button></div>
      </div>`;
    list.appendChild(card);
  });
}

function filterFoods() {
  const query = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const filters = {
    restock: document.getElementById('filterRestock').checked,
    noStock: document.getElementById('filterNoStock').checked,
    warning: document.getElementById('filterWarning').checked,
    danger: document.getElementById('filterDanger').checked
  };
  const active = Object.values(filters).some(Boolean);
  const shown = allFoods.filter(food => {
    const matchesText = (food.name || '').toLowerCase().includes(query) || categoryName(food.category).toLowerCase().includes(query);
    const matchesFilter = !active || (filters.restock && food.needsRestock) || (filters.noStock && food.quantity <= 0) || (filters.warning && food.status === 'warning') || (filters.danger && food.status === 'danger');
    return matchesText && matchesFilter;
  });
  displayFoods(shown);
}

async function addFood() {
  const name = document.getElementById('foodName').value.trim();
  const quantity = parseInt(document.getElementById('addQuantity').value, 10);
  const expiryDate = document.getElementById('expiryDate').value;
  if (!name || !expiryDate || !Number.isInteger(quantity) || quantity < 1) return alert(text('validFood'));
  try {
    const response = await api('/api/foods', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name, quantity, expiryDate, category:document.getElementById('category').value }) });
    if (!response.ok) return alert(text('saveError'));
    document.getElementById('foodName').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('addQuantity').value = 1;
    await loadFoods();
  } catch (error) { alert(text('networkError')); }
}

async function updateFoodInfo(id, update) {
  if (update.quantity !== undefined && update.quantity < 0) return alert(text('quantityError'));
  try {
    const response = await api(`/api/foods/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(update) });
    if (response.ok) await loadFoods(); else alert(text('saveError'));
  } catch (error) { console.error(error); }
}

async function deleteFood(id) {
  if (!confirm(text('removeConfirm'))) return;
  const response = await api(`/api/foods/${id}`, { method:'DELETE' });
  if (response.ok) await loadFoods();
}

async function manualDateUpdate(id) {
  const date = document.getElementById(`input-date-${id}`).value;
  if (!date) return alert(text('dateRequired'));
  await updateFoodInfo(id, { expiryDate:date });
}

async function recordWaste(id, max) {
  const quantity = Number(prompt(text('wasteQuantity'), String(max)));
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > max) return;
  const reason = prompt(text('wasteReason'), text('expiredReason'));
  if (reason === null) return;
  try {
    const response = await api(`/api/foods/${id}/waste`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ quantity, reason }) });
    if (response.ok) await Promise.all([loadFoods(), loadWasteHistory()]); else alert(text('saveError'));
  } catch (error) { alert(text('networkError')); }
}

async function loadWasteHistory() {
  try {
    const response = await api('/api/waste');
    if (!response.ok) return;
    const rows = await response.json();
    wasteTotal = rows.reduce((sum, row) => sum + (row.quantity || 0), 0);
    updateSummary();
    const list = document.getElementById('wasteHistory');
    list.innerHTML = rows.length ? rows.map(row => `
      <div class="history-item"><span class="history-mark">↘</span><div class="history-copy"><strong>${escapeHtml(row.foodName)}</strong><span>${escapeHtml(row.reason)} · ${new Date(row.recordedAt).toLocaleDateString(currentLanguage === 'ja' ? 'ja-JP' : 'en-GB')}</span></div><b>−${row.quantity}</b></div>`).join('') : `<div class="empty-history">${escapeHtml(text('noWaste'))}</div>`;
  } catch (error) { console.error(error); }
}

async function loadSuggestions() {
  try {
    const response = await api('/api/menu-suggestions');
    if (!response.ok) return;
    const rows = await response.json();
    const list = document.getElementById('suggestions');
    list.innerHTML = rows.length ? rows.map((item, index) => `
      <article class="suggestion-item"><div class="suggestion-line"><span class="suggestion-rank">0${index + 1}</span><div class="suggestion-copy"><div class="suggestion-heading"><strong>${escapeHtml(text(item.name))}</strong><span>${item.matchPercent}%</span></div><p>${escapeHtml(text(item.description))}</p><small>${escapeHtml(text('uses'))}: ${item.matchingIngredients.map(escapeHtml).join(', ')} · ${item.minutes} ${escapeHtml(text('minutes'))}</small></div></div></article>`).join('') : `<div class="empty-history">${escapeHtml(text('noSuggestions'))}</div>`;
  } catch (error) { console.error(error); }
}

function toggleProfile() {
  const panel = document.getElementById('profilePanel');
  panel.hidden = !panel.hidden;
  if (!panel.hidden) document.getElementById('displayName').focus();
}

async function loadProfile() {
  try {
    const response = await api('/api/profile');
    if (!response.ok) return;
    const profile = await response.json();
    document.getElementById('displayName').value = profile.displayName || profile.username;
    document.getElementById('profileEmail').value = profile.email || '';
    const pendingLanguage = localStorage.getItem('fridge-language-pending');
    const language = pendingLanguage || profile.preferredLanguage || 'ja';
    document.getElementById('profileLanguage').value = language;
    document.getElementById('languageSelect').value = language;
    currentLanguage = language;
    window.applyLanguage?.(language);
    if (pendingLanguage) {
      const saved = await api('/api/profile', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ displayName:profile.displayName || profile.username, preferredLanguage:language }) });
      if (saved.ok) localStorage.removeItem('fridge-language-pending');
    }
  } catch (error) { console.error('Could not load profile', error); }
}

async function saveProfile(event) {
  if (event?.preventDefault) event.preventDefault();
  const displayName = document.getElementById('displayName').value;
  const preferredLanguage = document.getElementById('profileLanguage').value;
  const response = await api('/api/profile', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ displayName, preferredLanguage }) });
  if (response.ok) {
    localStorage.setItem('fridge-language', preferredLanguage);
    localStorage.removeItem('fridge-language-pending');
    document.getElementById('languageSelect').value = preferredLanguage;
    currentLanguage = preferredLanguage;
    window.applyLanguage?.(preferredLanguage);
    if (event) alert(text('profileSaved'));
  } else if (event) alert(text('saveError'));
}

async function refreshLocalizedData() {
  displayFoods(allFoods);
  await Promise.all([loadSuggestions(), loadWasteHistory()]);
}
