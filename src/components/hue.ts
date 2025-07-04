const generatedHues: number[] = []

export type ColourCode = {
  hue: number
  colour: string
}

export function releaseHue(hue: number) {
  const hueIndex = generatedHues.indexOf(hue)
  if (hueIndex != -1) generatedHues.splice(hueIndex, 1)
}

export function getHue(
  minDistance: number = 30,
  maxTries: number = 20,
): { hue: number; colour: string } {
  const saturation = 80
  const lightness = 60

  function isFarEnough(hue: number): boolean {
    return generatedHues.every(
      (h) => Math.min(Math.abs(hue - h), 360 - Math.abs(hue - h)) >= minDistance,
    )
  }

  function makeObject(hue: number) {
    generatedHues.push(hue)

    return {
      hue,
      colour: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    }
  }

  for (let i = 0; i < maxTries; i++) {
    const hue = Math.floor(Math.random() * 360)
    if (isFarEnough(hue)) {
      return makeObject(hue)
    }
  }

  // fallback to a random hue if no sufficiently distant hue found
  let fallbackHue = Math.floor(Math.random() * 360)
  let triedCounter = 0
  while (generatedHues.includes(fallbackHue)) {
    if (triedCounter++ == 255) fallbackHue = (fallbackHue + 1) % 255
  }
  return makeObject(fallbackHue)
}
