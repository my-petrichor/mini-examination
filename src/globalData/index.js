const globalData = {}

function Set (key, val) {
  globalData[key] = val
}

function Get (key) {
  return globalData[key]
}

export {Set, Get}