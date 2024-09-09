function SendingAlert(text, type) {
  const types = {
    error: "#ff0000",
    success: "#31d400",
    info: "#001aff"
  }
  const types_select = types[type] || "#292929"
  const buildAlert = document.createElement("div")
  buildAlert.className = "alert-box"
  buildAlert.style.background = types_select
  buildAlert.innerText = text
  setTimeout(() => {
    buildAlert.remove()
  }, 4000)
  document.querySelector('.alert-container .response').prepend(buildAlert)
}
async function fetchMediaAsBlobUrl(mediaUrl) {
  try {
    const response = await fetch(mediaUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    return blobUrl
  } catch (error) {
    console.error('Failed to fetch media:', error)
    throw new Error('Network response was not ok')
  }
}
function RunGameApp() {
  SendingAlert('Click to allowing interact and load the game','info')
  const docsGame = document.querySelector('.container-game')
  const videoGame = document.querySelector('.game-video-container')
  const walletTotal = document.getElementById('wallet-total')
  function LoadMoneyWallet() {
    const ainter = localStorage.getItem("wallet")
    if(isNaN(ainter) || !ainter) {
      const defaultload = 400
      localStorage.setItem("wallet", `${defaultload}`)
      return String(defaultload)
    }
    return String(ainter)
  }
  function UpdateWallet(isMinus) {
    const moneyNow = LoadMoneyWallet()
    let toTotal = Number(moneyNow)
    if(isMinus) {
      toTotal = toTotal - Math.floor(Math.random() * 250)
    } else {
      const randomPitys = Math.floor(Math.random() * 500)
      const supPity = randomPitys < 40? 40 : randomPitys
      toTotal = toTotal + supPity
    }
    localStorage.setItem("wallet", `${toTotal}`)
    WriteToHTMLMoney(toTotal)
  }
  function WriteToHTMLMoney(mn) {
    if(mn < 1) {
      walletTotal.style.color = "red"
    } else {
      walletTotal.style.color = "black"
    }
    const tm = Number(mn).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    walletTotal.innerText = `${tm}`
  }
  const wallet_total = LoadMoneyWallet()
  WriteToHTMLMoney(wallet_total)
  async function LoadingAllAssetsSetup() {
    try {
      const audioOpening = await fetchMediaAsBlobUrl('./assets/open-gamevoice.mp3')
      const idleVideo = await fetchMediaAsBlobUrl('./assets/idle.mp4')
      const lostVideo = await fetchMediaAsBlobUrl('./assets/defeat-gacha.mp4')
      const winVideo = await fetchMediaAsBlobUrl('./assets/winning-gacha.mp4')
      document.querySelector('.click-to-interact').remove()

      // Starting idle
      const videoIdle = document.createElement("video")
      videoIdle.loop = true
      videoIdle.src = idleVideo
      videoIdle.play()
      videoGame.append(videoIdle)

      function InteractRandomCase() {
        if(docsGame.getAttribute("is-gacha")) return;
        docsGame.setAttribute("is-gacha", "!")

        const gacha = gettingResultRandomAlgoritma()

        const video = document.createElement("video")
        
        if(gacha) {
          if(gacha == "limit") {
            SendingAlert('The system deliberately makes you 5% more likely to win beforehand','info')
          }
          video.src = winVideo
          setTimeout(() => {
            UpdateWallet()
            SendingAlert('I can stop winning!','success')
          }, 820)
          setTimeout(() => {
            docsGame.removeAttribute("is-gacha")
            videoIdle.style.display = "block"
            video.remove()
          }, 2005)
        } else {
          video.src = lostVideo
          setTimeout(() => {
            UpdateWallet(true)
            SendingAlert('Ah dawg it','error')
          }, 816)
          setTimeout(() => {
            docsGame.removeAttribute("is-gacha")
            videoIdle.style.display = "block"
            video.remove()
          }, 1590)
        }
        video.play()
        setTimeout(() => {
          videoGame.append(video)
          videoIdle.style.display = "none"
        }, 20)
      }

      docsGame.addEventListener("click", InteractRandomCase)

      document.body.onkeyup = function(e) {
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
          //your code
        }
        InteractRandomCase()
      }

      docsGame.removeAttribute("gamenotstart")
      const audio = new Audio(audioOpening)
      setTimeout(() => {
        audio.play()
        setTimeout(() => { audio.remove() }, 1000)
      }, 200)
    } catch(err) {
      console.log(err)
      return SendingAlert('Opps, loading assets problem!','error')
    }
  }
  docsGame.addEventListener("click", () => {
    if(docsGame.getAttribute("gameinteract")) {
      LoadingAllAssetsSetup()
      docsGame.removeAttribute("gameinteract")
      return;
    }
    if(docsGame.getAttribute("gamenotstart")) {
      return SendingAlert("Waiting load all assets game!",'error')
    }
  })
}
RunGameApp()