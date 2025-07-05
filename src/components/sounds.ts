import touch from '../../public/sounds/sonar.mp3';
import choose from '../../public/sounds/choose.mp3';
// import movie from '../../public/sounds/climax/movie.mp3';
import scary from '../../public/sounds/climax/scary.mp3';
import note1 from '../../public/sounds/notes/do.mp3';
import note2 from '../../public/sounds/notes/re.mp3';
import note3 from '../../public/sounds/notes/mi.mp3';
import note4 from '../../public/sounds/notes/fa.mp3';
import note5 from '../../public/sounds/notes/sol.mp3';
import note6 from '../../public/sounds/notes/la.mp3';
import note7 from '../../public/sounds/notes/si.mp3';

const NOTES_DICT = { note1, note2, note3, note4, note5, note6, note7 };

const sources: Record<string, string> = {
	touch,
	choose,
	scary,
	...NOTES_DICT,
};

const sounds: Record<string, HTMLAudioElement> = {};

const getSound = (name: string) => {
	if (typeof sources[name] == 'undefined') {
		console.log(`Uknown sound: ${name}`);
		return;
	}

	if (typeof sounds[name] == 'undefined') {
		sounds[name] = new Audio(sources[name]);
	}

	return sounds[name];
};

export const playSound = (name: string, volume: number = 1.0) => {
	const sound = getSound(name);
	if (!sound) return;

	sound.currentTime = 0;
	sound.volume = volume;
	sound.play().catch((err) => console.log('Playback blocked:', err));
};

export const playRandomNote = () => {
	const keys = Object.keys(NOTES_DICT);
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
