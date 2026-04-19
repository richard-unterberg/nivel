const apiKey = process.env.BUNNY_API_KEY?.trim()
const pullZoneUrl = process.env.BUNNY_PULL_ZONE_URL?.trim()

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

if (!apiKey) {
  fail('Missing BUNNY_API_KEY.')
}

if (!pullZoneUrl) {
  fail('Missing BUNNY_PULL_ZONE_URL.')
}

const requestUrl = `https://api.bunny.net/purge=${pullZoneUrl}`
const requestInit = {
  method: 'POST',
  headers: {
    AccessKey: apiKey,
  },
}

const response = await fetch(requestUrl, requestInit)

if (!response.ok) {
  const responseText = await response.text()
  fail(`Bunny purge failed with ${response.status} ${response.statusText}: ${responseText}`)
}

console.log(`Purged Bunny cache for pull zone ${pullZoneUrl}.`)
