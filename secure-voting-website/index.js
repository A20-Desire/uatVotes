let token = '';

async function fetchPolls() {
  const res = await fetch('/api/polls');
  const polls = await res.json();
  const list = document.getElementById('polls');
  list.innerHTML = polls.map(p => `<li>${p.title}</li>`).join('');
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

const params = new URLSearchParams(window.location.search);
if (params.get('token')) {
  token = params.get('token');
  fetchPolls();
} else {
  fetchPolls();
}
