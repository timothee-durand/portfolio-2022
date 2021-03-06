/**
 *
 *  From Georges Francis, our master
 *  https://github.com/georgedoescode/generative-utils/tree/master/src
 *
 */

// choose a number within a range, integer (whole number) by default
function random() {
  const isArray = Array.isArray(arguments[0])

  if (isArray) {
    const targetArray = arguments[0]

    return targetArray[random(0, targetArray.length - 1, true)]
  }
  const min = arguments[0]
  const max = arguments[1]
  const clamp = arguments[2] || false

  const val = Math.random() * (max - min) + min

  return clamp ? Math.round(val) : val
}

function formatPoints(points, close) {
  points = [...points]
  // so that coords can be passed as objects or arrays
  if (!Array.isArray(points[0])) {
    points = points.map(({ x, y }) => [x, y])
  }

  if (close) {
    const lastPoint = points[points.length - 1]
    const secondToLastPoint = points[points.length - 2]

    const firstPoint = points[0]
    const secondPoint = points[1]

    points.unshift(lastPoint)
    points.unshift(secondToLastPoint)

    points.push(firstPoint)
    points.push(secondPoint)
  }

  return points.flat()
}

function spline(points = [], tension = 1, close = false, cb) {
  points = formatPoints(points, close)

  const size = points.length
  const last = size - 4

  const startPointX = close ? points[2] : points[0]
  const startPointY = close ? points[3] : points[1]

  let path = 'M' + [startPointX, startPointY]

  cb && cb('MOVE', [startPointX, startPointY])

  const startIteration = close ? 2 : 0
  const maxIteration = close ? size - 4 : size - 2
  const inc = 2

  for (let i = startIteration; i < maxIteration; i += inc) {
    const x0 = i ? points[i - 2] : points[0]
    const y0 = i ? points[i - 1] : points[1]

    const x1 = points[i + 0]
    const y1 = points[i + 1]

    const x2 = points[i + 2]
    const y2 = points[i + 3]

    const x3 = i !== last ? points[i + 4] : x2
    const y3 = i !== last ? points[i + 5] : y2

    const cp1x = x1 + ((x2 - x0) / 6) * tension
    const cp1y = y1 + ((y2 - y0) / 6) * tension

    const cp2x = x2 - ((x3 - x1) / 6) * tension
    const cp2y = y2 - ((y3 - y1) / 6) * tension

    path += 'C' + [cp1x, cp1y, cp2x, cp2y, x2, y2]

    cb && cb('CURVE', [cp1x, cp1y, cp2x, cp2y, x2, y2])
  }

  return path
}

function createCoordsTransformer(svg) {
  const pt = svg.createSVGPoint()

  return function (e) {
    pt.x = e.clientX
    pt.y = e.clientY

    return pt.matrixTransform(svg.getScreenCTM().inverse())
  }
}

function pointsInPath(path, numPoints = 10) {
  const pathLength = path.getTotalLength()
  const step = pathLength / numPoints
  const points = []

  for (let i = 0; i < pathLength; i += step) {
    points.push(path.getPointAtLength(i))
  }

  return points
}

function randomBias(min, max, bias, influence = 0.5) {
  const base = random(min, max)
  const mix = random(0, 1) * influence

  return base * (1 - mix) + bias * mix
}

function relativeBounds(svg, HTMLElement) {
  const { x, y, width, height } = HTMLElement.getBoundingClientRect()

  const startPoint = svg.createSVGPoint()
  startPoint.x = x
  startPoint.y = y

  const endPoint = svg.createSVGPoint()
  endPoint.x = x + width
  endPoint.y = y + height

  const startPointTransformed = startPoint.matrixTransform(
    svg.getScreenCTM().inverse()
  )
  const endPointTransformed = endPoint.matrixTransform(
    svg.getScreenCTM().inverse()
  )

  return {
    x: startPointTransformed.x,
    y: startPointTransformed.y,
    width: endPointTransformed.x - startPointTransformed.x,
    height: endPointTransformed.y - startPointTransformed.y,
  }
}

export {
  spline,
  random,
  pointsInPath,
  createCoordsTransformer,
  randomBias,
  relativeBounds,
}
