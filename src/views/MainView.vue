<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import FingerCircle, { type Finger } from "../components/FingerCircle.vue"
import { createHsl, getHue, releaseHue } from '../components/hue'
import { playRandomNote, playSound, stopSound } from '../components/sounds';

const TEST_COUNT = 0
const MIN_COUNT = TEST_COUNT > 0 ? TEST_COUNT + 1 : 2;

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
      stopSound("choose")
      clearTimeout(soundTimeout)
    }
  }

  if (fingers.value.length >= MIN_COUNT) {
    winnerIdentifier.value = undefined
    soundTimeout = setTimeout(() => {
      playSound("choose");
    }, 1500);
    timeout = setTimeout(() => {
      const winnerIndex = Math.floor(Math.random() * fingers.value.length)
      winnerIdentifier.value = fingers.value[winnerIndex].identifier
    }, 3000)
  }
}

while (fingers.value.length < TEST_COUNT) {
  const len = fingers.value.length
  fingers.value.push({
    x: (len + 1) * 100,
    y: (len + 1) * 100,
    hue: getHue(),
    identifier: 1337 + len
  })
  resetTimer()
}

const started = ref(false);

const startTouch = (evt: TouchEvent) => {
  if (!started.value) {
    started.value = true;
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
    playRandomNote()
  }
  resetTimer()
}

const trackTouch = (evt: TouchEvent) => {
  evt.preventDefault();
  for (const touch of evt.changedTouches) {
    const finger = fingers.value.find(f => f.identifier == touch.identifier);
    if (finger) {
      finger.x = touch.pageX;
      finger.y = touch.pageY
    }
  }
}

const removeFinger = (identifier: number) => {
  fingers.value = fingers.value.filter(finger => {
    if (finger.identifier == identifier) {
      releaseHue(finger.hue)
      return false;
    } else {
      return true
    }
  })
  if (!winnerIdentifier.value || identifier == winnerIdentifier.value) {
    winnerIdentifier.value = undefined
    resetTimer()
  }
}

const endTouch = (evt: TouchEvent) => {
  for (const touch of evt.changedTouches) {
    removeFinger(touch.identifier)
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
    <FingerCircle v-for="finger in fingers" :finger="finger" :winner="winnerIdentifier"
      v-bind:key="finger.identifier" />
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

.hint.hidden {
  opacity: 0;
}

.hint {
  font-size: 1.5em;
  opacity: 0.7;
  animation: pulse 3s infinite;
}

.fade-enter-active {
  transition: opacity 3s 3s ease;
}

.fade-leave-active {
  transition: none;
  /* instant disappear */
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 0.7;
}

.fade-leave-from,
.fade-leave-to {
  opacity: 0;
}
</style>
