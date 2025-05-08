const https = require('https')
require('dotenv').config({ path: '../.env' }) // Load environment variables - Corrected path
const { generateTimestamp, generatePassword } = require('./utils')
const { getAccessToken } = require('./mpesaAuth')

/**
 * Initiates an STK Push request to the Safaricom M-Pesa API.
 * This function sends a prompt to the user's phone to enter their M-Pesa PIN.
 *
 * @param {string} phoneNumber - The customer's phone number (in the format 2547...).
 * @param {number} amount - The amount to be paid.
 * @param {string} transactionDesc - A description of the transaction.
 * @returns {Promise<object>} - A promise that resolves with the M-Pesa API response
 * (typically containing a CheckoutRequestID), or rejects
 * with an error.
 */

async function initiateStkPush(phoneNumber, amount, transactionDesc) {
  const token = await getAccessToken()
  const timestamp = generateTimestamp()
  const password = generatePassword(
    process.env.MPESA_BUSINESS_SHORTCODE,
    process.env.MPESA_PASSKEY,
    timestamp
  )

  const postData = JSON.stringify({
    BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline', // Or 'CustomerBuyGoodsOnline'
    Amount: amount,
    PartyA: phoneNumber, // Customer's phone number
    PartyB: process.env.MPESA_BUSINESS_SHORTCODE, // PayBill or Till Number
    PhoneNumber: phoneNumber,
    CallBackURL: process.env.MPESA_CALLBACK_URL, // Your callback URL
    AccountReference: 'Lifeasy', // Customize this,  Added a default value
    TransactionDesc: transactionDesc,
  })

  const options = {
    hostname: 'sandbox.safaricom.co.ke', // Use sandbox for testing
    path: '/mpesa/stkpush/v1/processrequest',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
    },
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          if (response && response.CheckoutRequestID) {
            //check for a successful response
            resolve(response)
          } else {
            reject(new Error(`STK Push failed:  ${data}`))
          }
        } catch (error) {
          reject(new Error(`Error parsing response: ${error.message}`))
        }
      })
    })

    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`))
    })

    req.write(postData)
    req.end()
  })
}

module.exports = { initiateStkPush }
