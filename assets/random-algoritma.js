
function gettingResultRandomAlgoritma() {
  let failureCount = 0
  let lastWinTime = 0
  const now = Date.now()
  // Random 0 - 10
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  // If it fails more than 100 times and more than 5 minutes from the last win, give it a chance to win
  if (failureCount > 100 && now - lastWinTime > 5 * 60 * 1000) {
    if(failureCount > 115) {
      failureCount = 0
      lastWinTime = now
    }
    if(failureCount == 105) {
      return "limit"
    }
    return true
  }
  if (randomNumber === 10) {
    lastWinTime = now
    failureCount = 0
    return true
  } else {
    failureCount++;
    if (failureCount > 100 && now - lastWinTime > 20 * 60 * 1000) {
      lastWinTime = now
      failureCount = 0
      return true
    }
    return false
  }
}