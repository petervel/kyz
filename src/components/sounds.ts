const notes: Record<string, string> = {
	note1: 'sounds/notes/do.mp3',
	note2: 'sounds/notes/re.mp3',
	note3: 'sounds/notes/mi.mp3',
	note4: 'sounds/notes/fa.mp3',
	note5: 'sounds/notes/sol.mp3',
	note6: 'sounds/notes/la.mp3',
	note7: 'sounds/notes/si.mp3',
};

const sources: Record<string, string> = {
	touch: 'sounds/sonar.mp3',
	choose: 'sounds/choose.mp3',
	scary: 'sounds/climax/scary.mp3',
	...notes,
};

const sounds: Record<string, HTMLAudioElement> = {};

const getSound = (name: string) => {
	if (typeof sources[name] == 'undefined') {
		console.log(`Unknown sound: ${name}`);
		return;
	}

	if (typeof sounds[name] == 'undefined') {
		const audio = new Audio(sources[name]);
		// audio.preload = 'auto';
		sounds[name] = audio;
	}

	return sounds[name];
};

export const playSound = (name: string, volume: number = 1.0) => {
	const sound = getSound(name);
	if (!sound) return;

	sound.currentTime = 0;
	sound.volume = volume;
	sound.play().catch((err) => console.log('Playback blocked for ', name, ':', err));
};

export const playRandomNote = () => {
	const keys = Object.keys(notes);
	let retries = keys.length;
	while (true) {
		const key = keys[Math.floor(Math.random() * keys.length)];
		const sound = getSound(key);
		if (!sound) return;

		retries--;
		if (retries == 0 || sound.paused) {
			playSound(key, 0.3);
			return;
		}
	}
};

export const stopSound = (name: string) => {
	if (typeof sounds[name] == 'undefined') return;
	sounds[name].pause();
};
