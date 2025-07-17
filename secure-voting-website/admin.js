let token = '';

async function fetchPolls() {
  const res = await fetch('/api/polls');
  const polls = await res.json();
  const list = document.getElementById('adminPolls');
  const items = await Promise.all(polls.map(async p => {
    const r = await fetch(`/api/votes/poll/${p._id}/admin`, { headers: { 'Authorization': `Bearer ${token}` } });
    const results = r.ok ? await r.json() : [];
    const resultHtml = results.map(res => `${res.candidate.name}: ${res.votes}`).join('<br>');
    return `<li><strong>${p.title}</strong><br>${resultHtml}<br><button onclick="toggle('${p._id}')">Toggle Visibility</button></li>`;
  }));
  list.innerHTML = items.join('');
}

async function toggle(id) {
  await fetch(`/api/polls/${id}/toggle`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  fetchPolls();
}

document.getElementById('pollForm').addEventListener('submit', async e => {
  e.preventDefault();
  const lines = document.getElementById('candidates').value.split('\n').filter(l => l.trim());
  const candidates = lines.map(l => {
    const [name, profile, image] = l.split('|').map(s => s.trim());
    return { name, profile, image };
  });
  await fetch('/api/polls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title: document.getElementById('title').value, candidates })
  });
  fetchPolls();
});

const paramsA = new URLSearchParams(window.location.search);
if (paramsA.get('token')) {
  token = paramsA.get('token');
}
fetchPolls();
