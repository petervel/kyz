import touch from '../../public/sounds/sonar.mp3';
import choose from '../../public/sounds/choose.mp3';
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
  ...NOTES_DICT,
};

const sounds: Record<string, HTMLAudioElement> = {};

export const playRandomNote = () => {
  const keys = Object.keys(NOTES_DICT);
  const key = keys[Math.floor(Math.random() * keys.length)];
  playSound(key);
};

export const playSound = (name: string) => {
  if (typeof sources[name] == 'undefined') {
    console.log(`Uknown sound: ${name}`);
    return;
  }

  if (typeof sounds[name] == 'undefined') {
    sounds[name] = new Audio(sources[name]);
  }

  const sound = sounds[name];
  sound.currentTime = 0;
  sound.play().catch((err) => console.log('Playback blocked:', err));
};
