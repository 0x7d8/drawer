document.querySelector('#color-picker').value = '#000000'
document.querySelector('#background-picker').value = '#ffffff'
document.querySelector('#shape-selector').value = 'cube-normal'
document.querySelector('#size-slider').value = 16
window.ondragstart = () => false

const pixelCSS = (positions, shape, color, size) => {
  const defaultCSS = `position: absolute; translate -50% -50%; top: ${positions.y - 50 - size}px; left: ${positions.x - size}px; width: ${size * 2}px; height: ${size * 2}px; `

  switch (shape) {
    case "cube-normal":
      return defaultCSS + `background-color: ${color}`

    case "cube-hollow":
      return defaultCSS + `background-color: transparent; border: ${size / 8}px solid ${color}`

    case "circle-normal":
      return defaultCSS + `background-color: ${color}; border-radius: 9999px`

    case "circle-hollow":
      return defaultCSS + `background-color: transparent; border: ${size / 8}px solid ${color}; border-radius: 9999px`
  }
}

let pixelCount = 0, size = 4, data = {
  fileVersion: 1.1,
  drawShape: 'cube-normal',
  drawColor: '#000000',
  drawSize: 16,
  backgroundColor: '#ffffff',
  image: []
}; const importData = () => {
  var reader = new FileReader()
  reader.readAsText(document.querySelector('#import-upload').files[0], 'UTF-8')
  document.querySelector('#import-modal').close()

  reader.onload = (event) => {
    document.querySelector('#import-upload').value = ''
    let inputData = event.target.result

    try {
      inputData = JSON.parse(inputData)
    } catch (e) { alert('Invalid JSON') }
    if (inputData) {
      clearData()
      data = inputData
      pixelCount = 0

      document.querySelector('#shape-selector').value = data.drawShape; changeShape()
      document.querySelector('#color-picker').value = data.drawColor; changeColor()
      document.querySelector('#background-picker').value = data.backgroundColor; changeBackground()
      document.querySelector('#size-slider').value = data.drawSize; changeSize()

      for (const info of data.image) {
        const pixel = document.createElement("div")
        pixel.id = `pixel-${++pixelCount}`
        pixel.style = pixelCSS(info, info.shape, info.color, info.size)
        image.appendChild(pixel)
      }; alert(`Successfully Imported ${pixelCount} Pixels (${(new Blob([ event.target.result ]).size / 1024).toFixed(2)}KB)`)
    }
  }
}

const exportData = () => {
  const blob = new Blob([ JSON.stringify(data) ], { type: 'text/json' }),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a')

  a.download = `export-${new Date().getSeconds()}-${new Date().getMinutes()}-${new Date().getHours()}-${new Date().getDate()}-${new Date().getDay()}-${new Date().getFullYear()}.json`
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
  alert(`Exported ${pixelCount} Pixels (${(new Blob([ JSON.stringify(data) ]).size / 1024).toFixed(2)}KB)`)
}

const undoData = () => {
  if (data.image.length > 0) {
    data.image.splice(data.image.length - 1, 1)
    document.querySelector(`#pixel-${pixelCount--}`).remove()
  }
}

const changeShape = () => {
  const shape = document.querySelector('#shape-selector').value

  data.drawShape = shape
}

const changeColor = () => {
  const color = document.querySelector('#color-picker').value

  data.drawColor = color
}

const changeSize = () => {
  const size = Number(document.querySelector('#size-slider').value)

  data.drawSize = size
}

const clearData = () => {
  for (const pixel in data.image) {
    document.querySelector(`#pixel-${pixelCount--}`).remove()
  }; data.image = []
}

const changeBackground = () => {
  const color = document.querySelector('#background-picker').value

  body.style = `background-color: ${color}`
  data.backgroundColor = color
}

image.onmouseup = () => window.mouseIsDown = false
image.onmousedown = (event) => {
  window.mouseIsDown = true

  const color = document.querySelector('#color-picker').value
  const size = Number(document.querySelector('#size-slider').value)
  const shape = document.querySelector('#shape-selector').value
  data.image.push({ shape, y: event.pageY, x: event.pageX, color, size })
  const pixel = document.createElement("div")
  pixel.id = `pixel-${++pixelCount}`
  pixel.style = pixelCSS({ x: event.pageX, y: event.pageY }, shape, color, size)
  image.appendChild(pixel)
}; image.onmousemove = (event) => {
  if (!window.mouseIsDown) return

  const color = document.querySelector('#color-picker').value
  const size = Number(document.querySelector('#size-slider').value)
  const shape = document.querySelector('#shape-selector').value
  data.image.push({ shape, y: event.pageY, x: event.pageX, color, size })
  const pixel = document.createElement("div")
  pixel.id = `pixel-${++pixelCount}`
  pixel.style = pixelCSS({ x: event.pageX, y: event.pageY }, shape, color, size)
  image.appendChild(pixel)
}