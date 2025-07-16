let token = '';

async function fetchPolls() {
  const res = await fetch('/api/polls');
  const polls = await res.json();
  const list = document.getElementById('adminPolls');
  list.innerHTML = polls.map(p => `<li>${p.title} - <button onclick="toggle('${p._id}')">Toggle Visibility</button></li>`).join('');
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
  const names = document.getElementById('candidates').value.split(',').map(n => ({ name: n.trim() }));
  await fetch('/api/polls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title: document.getElementById('title').value, candidates: names })
  });
  fetchPolls();
});

fetchPolls();
