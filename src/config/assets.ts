/**
 * Images that ship with the site. The config refers to them by key (`{ asset: 'person_1' }`) so the dashboard can
 * later swap any of them for a Cloudinary upload without touching code.
 */
import person1 from '../assets/person/person_1.jpg';
import person2 from '../assets/person/person_2.jpg';
import person3 from '../assets/person/person_3.jpg';
import person4 from '../assets/person/person_4.jpg';
import person5 from '../assets/person/person_5.jpg';
import coachHeader from '../assets/images/coach-header.webp';
import coachMedal from '../assets/images/coach-medal.webp';
import instapay from '../assets/images/instapay.png';
import t16 from '../assets/transformation/16.jpg';
import t17 from '../assets/transformation/17.jpg';
import t18 from '../assets/transformation/18.jpg';

export const BUNDLED_ASSETS: Record<string, string> = {
  person_1: person1,
  person_2: person2,
  person_3: person3,
  person_4: person4,
  person_5: person5,
  'coach-header': coachHeader,
  'coach-medal': coachMedal,
  instapay,
  'transformation/16': t16,
  'transformation/17': t17,
  'transformation/18': t18,
  'brand-logo': '/brand-logo.png',
  favicon: '/favicon.svg',
};
