const https = require('https')
require('dotenv').config({ path: '../.env' }) // Load environment variables

let accessToken = null
let expiryTime = null

/**
 * Retrieves an MPesa access token.  It first checks if a valid,
 * non-expired token is already in memory. If not, it fetches a new one
 * from the Safaricom API.
 * @returns {Promise<string>} - A promise that resolves with the access token,
 * or rejects with an error.
 */
async function getAccessToken() {
  if (accessToken && expiryTime > Date.now()) {
    return accessToken // Return cached token if valid
  }

  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    'base64'
  )

  const options = {
    hostname: 'sandbox.safaricom.co.ke', // Use sandbox for testing
    path: '/oauth/v1/generate?grant_type=client_credentials',
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json', // Specify content type
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
          if (response && response.access_token && response.expires_in) {
            // Check for all required properties
            accessToken = response.access_token
            expiryTime = Date.now() + parseInt(response.expires_in, 10) * 1000 // Parse expires_in as integer
            console.log('New access token:', accessToken)
            resolve(accessToken)
          } else {
            reject(
              new Error(`Failed to get access token: Invalid response: ${data}`)
            ) // Improved error message
          }
        } catch (error) {
          reject(new Error(`Error parsing response: ${error.message}`)) // Wrap the error for more context
        }
      })
    })

    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`)) // Wrap the error for more context
    })

    req.end()
  })
}

module.exports = { getAccessToken }
