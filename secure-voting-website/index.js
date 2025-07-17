let token = '';
let username = '';

async function fetchPolls() {
  const res = await fetch('/api/polls');
  const polls = await res.json();
  const list = document.getElementById('polls');
  list.innerHTML = polls.map(p => {
    const candidates = p.candidates.map(c => `
      <div class="candidate">
        <img src="${c.image || ''}" alt="${c.name}" />
        <div class="candidate-info">
          <strong>${c.name}</strong>
          <p>${c.profile || ''}</p>
          <input type="number" min="1" value="1" id="qty-${c._id}" />
          <button onclick="buyVote('${p._id}','${c._id}')">Buy Votes</button>
        </div>
      </div>
    `).join('');
    return `<li><h3>${p.title}</h3>${candidates}</li>`;
  }).join('');
}

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    }),
  });
  const data = await res.json();
  token = data.token;
  username = document.getElementById('username').value;
  fetchPolls();
});

document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('regUsername').value,
      password: document.getElementById('regPassword').value,
    }),
  });
});

document.getElementById('googleLogin').addEventListener('click', () => {
  window.location.href = '/api/auth/google';
});

async function buyVote(pollId, candidateId) {
  const qty = document.getElementById(`qty-${candidateId}`).value || 1;
  const voteRes = await fetch('/api/votes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ poll: pollId, candidate: candidateId, quantity: Number(qty) })
  });
  const vote = await voteRes.json();
  const payRes = await fetch('/api/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email: username, voteId: vote._id, quantity: Number(qty) })
  });
  const payData = await payRes.json();
  if (payRes.ok && payData.data && payData.data.authorization_url) {
    localStorage.setItem('voteId', vote._id);
    window.location.href = payData.data.authorization_url;
  } else {
    document.getElementById('message').classList.remove('hidden');
    document.getElementById('message').textContent = 'Unable to initiate payment';
  }
}

const params = new URLSearchParams(window.location.search);
if (params.get('token')) {
  token = params.get('token');
  fetchPolls();
} else {
  fetchPolls();
}
