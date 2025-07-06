import { onMounted, onUnmounted, readonly, ref } from 'vue';

let idCounter = 1;
export type Touch = {
	id: string;
	x: number;
	y: number;
	identifier: number;
};

const touches = ref<Record<number, Touch>>({});

const startTouch = (evt: TouchEvent) => {
	for (const touch of evt.changedTouches) {
		touches.value = {
			...touches.value,
			[touch.identifier]: {
				id: `touch_${idCounter++}`,
				identifier: touch.identifier,
				x: touch.clientX,
				y: touch.clientY,
			},
		};
	}
};

const trackTouch = (evt: TouchEvent) => {
	evt.preventDefault();
	for (const touch of evt.changedTouches) {
		if (touches.value[touch.identifier]) {
			touches.value[touch.identifier].x = touch.pageX;
			touches.value[touch.identifier].y = touch.pageY;
		}
	}
};

const endTouch = (evt: TouchEvent) => {
	for (const touch of evt.changedTouches) {
		delete touches.value[`${touch.identifier}`];
	}
};

const clearTouches = () => {
	touches.value = {};
};

const preventContextMenu = (e: Event) => {
	e.preventDefault();
};

export const useMultitouch = () => {
	onMounted(() => {
		window.addEventListener('touchstart', startTouch);
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

	return { touches: readonly(touches), clearTouches };
};
