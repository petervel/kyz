<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import FingerCircle from "../components/FingerCircle.vue"
import { createHsl, getHue, releaseHue } from '../components/hue'
import { playSound, stopSound } from '../components/sounds';

import { useMultitouch, type Touch } from '../components/multitouch';
import { choice } from '../components/util';

const DEV_MODE = false

const { touches, startListening, stopListening, clearTouches } = useMultitouch();

const hues = new Map<string, number>();
// colours
watch(touches, () => {
  for (const [id, hue] of hues.entries()) {
    const touch = Object.values(touches.value).find(f => f.id == id)
    if (!touch) {
      // touch no longer exists
      releaseHue(hue);
      hues.delete(id)
    }
  }
}, { deep: true })

const getHueForId = (id: string | undefined) => {
  if (id == undefined) return 0;

  if (!hues.has(id)) {
    hues.set(id, getHue());
  }
  return hues.get(id)!;
}

const getColourForId = (id: string | null) => {
  if (!id) {
    return 'unset'
  }
  const hue = getHueForId(id);
  return createHsl(hue);
}

const touchCount = computed(() => Object.keys(touches.value).length);

type WinnerState = {
  prevCount: number;
  timeout: ReturnType<typeof setTimeout> | null;
  soundTimeout: ReturnType<typeof setTimeout> | null;
  resetTimeout: ReturnType<typeof setTimeout> | null;
  winnerId: string | null
}

const winnerState = ref<WinnerState>({
  prevCount: 0,
  timeout: null,
  soundTimeout: null,
  resetTimeout: null,
  winnerId: null
});

const reset = () => {
  clearTouches()
  winnerState.value.prevCount = 0;
  winnerState.value.timeout = null;
  winnerState.value.soundTimeout = null;
  winnerState.value.resetTimeout = null;
  winnerState.value.winnerId = null;
}

const MIN_COUNT = DEV_MODE ? 1 : 2
// winner checking
watch(touches, () => {
  const counter = Object.keys(touches.value).length
  if (counter == winnerState.value.prevCount) return;
  winnerState.value.prevCount = counter;

  if (winnerState.value.timeout) {
    clearTimeout(winnerState.value.timeout);
    winnerState.value.timeout = null;

    if (winnerState.value.soundTimeout) {
      clearTimeout(winnerState.value.soundTimeout);
      winnerState.value.soundTimeout = null;
    }
    else {
      stopSound("choose")
    }
  }
  if (counter >= MIN_COUNT) {
    winnerState.value.soundTimeout = setTimeout(() => {
      playSound("choose");
      winnerState.value.soundTimeout = null;
    }, 1500);

    winnerState.value.timeout = setTimeout(() => {
      const winner = choice<Touch>(Object.values(touches.value))
      winnerState.value.winnerId = winner!.id
      winnerState.value.timeout = null;
      winnerState.value.resetTimeout = setTimeout(reset, 1500)
    }, 3000);
  }
}, { deep: true });

const started = ref(false);
function startGame() {
  started.value = true;
  playSound('touch', 0); // will now work since this is inside a user-initiated click/tap
  startListening();
}
onUnmounted(stopListening);
</script>

<template>
  <main :style="{ backgroundColor: getColourForId(winnerState.winnerId) }">
    <div v-if="!started" class="start-overlay" @click="startGame">
      Tap to start
    </div>
    <FingerCircle v-for="touch in touches" :touch="touch" :colour="getColourForId(touch.id)" :key="touch.id"
      :winner="winnerState.winnerId" />

    <Transition name="fade">
      <div class="hint" v-if="started && touchCount == 0">
        Touch the screen
      </div>
    </Transition>
  </main>
</template>

<style lang="css" scoped>
.start-overlay {
  z-index: 10;
  height: 100%;
  width: 100%;
  position: absolute;
  line-height: 100vh;
  text-align: center;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 300ms 300ms ease;
}

.hint {
  font-size: 2em;
  opacity: 0.8;
  animation: pulse 3s infinite;
}

/*  ===== FADE ANIMATION ===== */
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
