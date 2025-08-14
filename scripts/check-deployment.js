#!/usr/bin/env node

const https = require("https")

function checkDeployment(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      console.log(`Status: ${response.statusCode}`)
      console.log(`Headers:`, response.headers)

      let data = ""
      response.on("data", (chunk) => {
        data += chunk
      })

      response.on("end", () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: data,
        })
      })
    })

    request.on("error", (error) => {
      reject(error)
    })

    request.setTimeout(10000, () => {
      request.destroy()
      reject(new Error("Request timeout"))
    })
  })
}

async function monitorDeployment() {
  const deploymentUrl = process.argv[2]

  if (!deploymentUrl) {
    console.log("Usage: node scripts/check-deployment.js <deployment-url>")
    process.exit(1)
  }

  console.log(`🔍 Checking deployment: ${deploymentUrl}`)

  try {
    const result = await checkDeployment(deploymentUrl)

    if (result.statusCode === 200) {
      console.log("✅ Deployment is live and responding")
    } else if (result.statusCode >= 400) {
      console.log(`❌ Deployment error: ${result.statusCode}`)
      console.log("Response body:", result.body.substring(0, 500))
    } else {
      console.log(`⚠️  Unexpected status: ${result.statusCode}`)
    }
  } catch (error) {
    console.log("❌ Failed to check deployment:", error.message)
  }
}

monitorDeployment()
