import LocalizedStrings from 'react-native-localization';
import english from './en.json';
import hindi from './hi.json';
import punjabi from './pb.json';

export const strings = new LocalizedStrings({
  hi: hindi,
  en: english,
  pb: punjabi,
});
