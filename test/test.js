const fs = require('fs')
const path = require('path')

const arr = fs.readdirSync(__dirname).reduce((entries, dir) => {
  const fullDir = path.join(__dirname, dir)
  const entry = path.join(fullDir, 'index.js')
  if (fs.statSync(fullDir).isDirectory()) {
    entries[dir] = entry
  }
  return entries
}, {})

