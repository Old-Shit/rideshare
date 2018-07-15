const admin = require('firebase-admin')
const {
  parsed: { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId },
} = require('dotenv').config({ path: '../.env' })
const serviceAccount = require('../serviceAccount.json')

const config = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  credential: admin.credential.cert(serviceAccount),
}

admin.initializeApp(config)
admin.auth()

const state = {
  db: admin.database(),
  latitude: +process.argv[2][0],
  longitude: +process.argv[2][1],
}

function random() {
  let seed = Math.PI
  const x = Math.sin((seed += 1)) * 10000
  return x - Math.floor(x)
}

function randomPosition(latitude, longitude, meters = 50) {
  const r = meters / 111300.0
  const y0 = latitude
  const x0 = longitude
  const u = random()
  const v = random()
  const w = r * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const x = w * Math.cos(t)
  const y1 = w * Math.sin(t)
  const x1 = x / Math.cos(y0)

  return { latitude: y0 + y1, longitude: x0 + x1 }
}

function getFakeDrivers(latitude, longitude) {
  return [
    { id: 1, name: 'Frank', position: randomPosition(latitude, longitude, 600) },
    { id: 2, name: 'Bill', position: randomPosition(latitude, longitude, 600) },
    { id: 3, name: 'Fred', position: randomPosition(latitude, longitude, 600) },
    { id: 4, name: 'Sam', position: randomPosition(latitude, longitude, 600) },
    { id: 5, name: 'David', position: randomPosition(latitude, longitude, 600) },
    { id: 6, name: 'Greg', position: randomPosition(latitude, longitude, 600) },
    { id: 7, name: 'Rey', position: randomPosition(latitude, longitude, 600) },
  ]
}

function populateFakeDrivers() {
  const fakeDrivers = getFakeDrivers(state.latitude, state.longitude)

  state.db.ref('drivers').remove()

  fakeDrivers.forEach(driver => {
    state.db
      .ref('drivers')
      .child(driver.id)
      .update(driver)
  })

  state.fakeDrivers = fakeDrivers
}

function updateRandomDriver() {
  const drivers = state.fakeDrivers
  const i = Math.floor(Math.random() * drivers.length)
  const driver = drivers[i]

  driver.position = randomPosition(driver.position.latitude, driver.position.longitude)
  state.db
    .ref('drivers')
    .child(driver.id)
    .update(drivers[i])

  return drivers[i]
}

/* eslint wrap-iife: 0 */
;(function main() {
  populateFakeDrivers(state)

  setInterval(() => {
    const updatedDriver = updateRandomDriver()
    console.log(`Updated driver: ${JSON.stringify(updatedDriver)}`)
  }, 1000)
})()
