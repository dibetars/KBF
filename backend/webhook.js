// This would be on your server
app.post('/webhook/paystack', async (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }

  // Handle the event
  const event = req.body;
  switch (event.event) {
    case 'charge.success':
      // Update player registration status
      break;
    // Handle other events...
  }

  res.sendStatus(200);
}); 