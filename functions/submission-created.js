require('dotenv').config()
const fetch = require('node-fetch')
const { EMAIL_TOKEN } = process.env

const processForm = form => {
fetch('/', {
    method: 'GET',
  })
  .then(() => {
    form.innerHTML = `<div class="form--success">Almost there! Check your inbox for a confirmation e-mail.</div>`;
  })
  .catch(error => {
    form.innerHTML = `<div class="form--error">Error: ${error}</div>`;
  })
}

const emailForm = document.querySelector('.email-form')

if (emailForm) {
  emailForm.addEventListener('submit', e => {
    e.preventDefault();
    processForm(emailForm);
  })
}

exports.handler = async event => {
  const email = JSON.parse(event.body).payload.email
  console.log(`Received a submission: ${email}`)
  return fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${EMAIL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(`Submitted to Buttondown:\n ${data}`)
    })
    .catch(error => ({ statusCode: 422, body: String(error) }))
}
