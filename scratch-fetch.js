fetch('http://localhost:3001/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'CREATE_ORDER',
    name: 'Test User',
    email: 'test@example.com',
    mobile: '9999999999',
    registrationNumber: 'cust_123',
    coupon: ''
  })
}).then(async res => {
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text.substring(0, 500));
}).catch(console.error);
