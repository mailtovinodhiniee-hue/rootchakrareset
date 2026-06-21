// JSONBin Sync Configuration
const SYNC_CONFIG = {
  binId: '6a37d791da38895dfee6a964',
  apiKey: '$2a$10$FcI3ZoXbHdBwWnWYt8WkzekEyGcwr6.b51LvpGGarfP9Wvq2R4uoq',
  baseUrl: 'https://api.jsonbin.io/v3/b'
};

// Save data to JSONBin + localStorage
async function syncSave(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  try {
    const all = await syncLoadAll();
    all[key] = value;
    await fetch(`${SYNC_CONFIG.baseUrl}/${SYNC_CONFIG.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': SYNC_CONFIG.apiKey
      },
      body: JSON.stringify(all)
    });
    console.log('Synced to cloud:', key);
  } catch (e) {
    console.log('Cloud sync failed, saved locally:', e);
  }
}

// Load all data from JSONBin
async function syncLoadAll() {
  try {
    const res = await fetch(`${SYNC_CONFIG.baseUrl}/${SYNC_CONFIG.binId}/latest`, {
      headers: { 'X-Access-Key': SYNC_CONFIG.apiKey }
    });
    const data = await res.json();
    return data.record || {};
  } catch (e) {
    console.log('Cloud load failed, using local:', e);
    return {};
  }
}

// Load specific key — cloud first, localStorage fallback
async function syncLoad(key) {
  try {
    const all = await syncLoadAll();
    if (all[key] !== undefined) {
      localStorage.setItem(key, JSON.stringify(all[key]));
      return all[key];
    }
  } catch (e) {
    console.log('Using local fallback for:', key);
  }
  const local = localStorage.getItem(key);
  return local ? JSON.parse(local) : null;
}

// Show sync status
function showSyncStatus(msg, color) {
  const el = document.getElementById('sync-status');
  if (el) { el.textContent = msg; el.style.color = color; setTimeout(() => el.textContent = '', 3000); }
}
