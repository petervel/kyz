<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import FingerCircle, { type Finger } from "../components/FingerCircle.vue"
import { createHsl, getHue, releaseHue } from '../components/hue'

import touchSrc from "../../public/sounds/sonar.mp3"
let touchSound = new Audio(touchSrc);

import chooseSrc from "../../public/sounds/choose.mp3"
const chooseSound = new Audio(chooseSrc);

const TESTING = false

const fingers = ref<Finger[]>([])
const winnerIdentifier = ref<number | undefined>()

const winner = computed(() => {
  if (winnerIdentifier.value == undefined) return undefined;
  return fingers.value.find(f => f.identifier == winnerIdentifier.value)
})

let timeout: ReturnType<typeof setTimeout> | null = null
let soundTimeout: ReturnType<typeof setTimeout> | null = null

const resetTimer = () => {
  if (timeout) {
    clearTimeout(timeout);
    if (soundTimeout) {
      chooseSound.pause()
      clearTimeout(soundTimeout)
    }
  }

  if (fingers.value.length >= 1) {
    winnerIdentifier.value = undefined
    soundTimeout = setTimeout(() => {
      playSound(chooseSound);
    }, 1500);
    timeout = setTimeout(() => {
      const winnerIndex = Math.floor(Math.random() * fingers.value.length)
      winnerIdentifier.value = fingers.value[winnerIndex].identifier
    }, 3000)
  }
}

if (TESTING) {
  fingers.value.push({
    x: 120,
    y: 120,
    hue: getHue(),
    identifier: 1337
  })
  fingers.value.push({
    x: 220,
    y: 220,
    hue: getHue(),
    identifier: 1336
  })
  resetTimer()
}

const playSound = (sound: HTMLAudioElement) => {
  sound.currentTime = 0; // rewind to allow rapid retriggers
  sound.play();
};

const started = ref(false);

const startTouch = (evt: TouchEvent) => {
  if (!started.value) {
    started.value = true;
    evt.preventDefault()
    return
  }

  if (winnerIdentifier.value != undefined) return
  for (const touch of evt.changedTouches) {
    const newFinger: Finger = {
      x: touch.clientX,
      y: touch.clientY,
      hue: getHue(),
      identifier: touch.identifier
    }
    fingers.value.push(newFinger)
    if (!touchSound) {
      touchSound = new Audio(touchSrc);
    }
    playSound(touchSound)
  }
  resetTimer()
}

const trackTouch = (evt: TouchEvent) => {
  evt.preventDefault();
  for (const touch of evt.changedTouches) {
    fingers.value = fingers.value.map(finger => {
      if (finger.identifier != touch.identifier) return finger;
      return { ...finger, x: touch.pageX, y: touch.pageY }
    })
  }
}

const endTouch = (evt: TouchEvent) => {
  for (const touch of evt.changedTouches) {
    fingers.value = fingers.value.filter(finger => {
      if (finger.identifier == touch.identifier) {
        releaseHue(finger.hue)
        return false;
      } else {
        return true
      }
    })
    if (!winnerIdentifier.value || touch.identifier == winnerIdentifier.value) {
      winnerIdentifier.value = undefined
      resetTimer()
    }
  }
}


onMounted(() => {
  window.addEventListener('touchstart', startTouch, { passive: false });
  window.addEventListener('touchmove', trackTouch, { passive: false });
  window.addEventListener('touchend', endTouch);
  window.addEventListener('touchcancel', endTouch);
  window.addEventListener('contextmenu', preventContextMenu);

});

onUnmounted(() => {
  window.removeEventListener('touchstart', startTouch);
  window.removeEventListener('touchmove', trackTouch);
  window.removeEventListener('touchend', endTouch);
  window.removeEventListener('touchcancel', endTouch);
  window.removeEventListener('contextmenu', preventContextMenu);
});

function preventContextMenu(e: Event) {
  e.preventDefault();
}
</script>

<template>
  <main :style="{ backgroundColor: winner ? createHsl(winner.hue) : 'unset' }">
    <FingerCircle v-for="finger in fingers" :x="finger.x" :y="finger.y" :hue="finger.hue"
      :identifier="finger.identifier" :winner="winnerIdentifier" v-bind:key="finger.identifier" />
    <div v-if="!started" class="start">Touch to start</div>
    <Transition name="fade">
      <div class="hint" v-if="started && fingers.length == 0">
        Touch the screen
      </div>
    </Transition>
  </main>
</template>

<style lang="css" scoped>
main {
  flex: 1;
  transition: background-color 300ms 300ms ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.start {
  font-size: 1.5em;
}

.hint {
  opacity: 0.3;
}

.fade-enter-active {
  transition: opacity 3s 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 0.3;
}
</style>
