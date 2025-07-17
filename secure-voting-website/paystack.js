(async function () {
  const params = new URLSearchParams(window.location.search);
  const reference = params.get('reference') || params.get('trxref');
  const voteId = localStorage.getItem('voteId');
  if (!reference || !voteId) {
    document.getElementById('status').textContent = 'Missing payment details.';
    return;
  }
  try {
    const res = await fetch('/api/pay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, voteId })
    });
    const data = await res.json();
    if (res.ok && data.data && data.data.status === 'success') {
      document.getElementById('status').textContent = 'Payment verified. Thank you!';
    } else {
      document.getElementById('status').textContent = 'Payment verification failed.';
    }
  } catch (err) {
    document.getElementById('status').textContent = 'Error verifying payment.';
  } finally {
    localStorage.removeItem('voteId');
  }
})();
