import { ACTIVITY_ICON_NAMES, ActivityIconName } from '../ui/atoms/icon/icon';

/**
 * Imported activities carry Daylio's own opaque icon-pack id in `Activity.icon`
 * (e.g. "26143") instead of one of our curated icon names. Daylio doesn't
 * publish a mapping from those ids to what the icon actually depicts, so this
 * table has to be filled in by hand: look up what each id looks like in Daylio
 * and add an entry below. Ids left out fall back to a neutral icon until
 * either this table or the activity itself (via the edit form) says otherwise.
 *
 * Example: '26143': 'run',
 */
export const DAYLIO_ICON_MAP: Record<string, ActivityIconName> = {
  '26143' : 'balloon',
  '289': 'thumb-up',
  '66917': 'confetti',
  '11597': 'hearts',
  '137': 'sunset-2',
  '292': 'thumb-up',
  '70': 'bed',
  '9567': 'thinking-medium',
  '10092': 'leaf-maple',
  '246': 'cloud-bolt',
  //stressé '8961': '',
  //frustré '277': 'thinking-medium',
  '9269': 'cloud',
  '358': 'bed',
  '24': 'cloud',
  '104': 'first-aid-kit',
  '314': 'puzzle',
  '129': 'sign-right',
  '239': 'stairs',
  '177': 'thinking-medium',
  '124': 'cookie-man',
  '47': 'tree',
  '79': 'sun',
  '185': 'first-aid-kit',
  '302': 'brain',
  '187': 'zzz',
  //épuisé '313': '',
  '53': 'heart',
  //saoulé '175':
  '106': 'hammer',
  '198': 'grill',

  '41': "heart-handshake",
  '94': 'users',
  '34': 'confetti',
  '9999913': "home",
  '210': 'phone',
  '12696': 'glass-full',
  '11777': 'tie',
  '226': 'calendar',

  '69': 'shopping-cart',
  '139': 'plunger',
  '115': 'teapot',
  '88': 'wash-dry-1',
  '85': 'train',
  '145': 'books',
  '98': 'briefcase-2',
  '103': 'stethoscope',

  '22': 'chalkboard',
  '9480': 'book-2',
  '20117': 'device-laptop',
  '8118': 'list-check',
  '8951': 'users',

  '97': 'briefcase-2',
  '72': 'device-workstation',

  '91': 'device-tv',
  '12': 'book',
  '30': 'device-gamepad-2',
  '123': 'run',
  '33': 'pointer',
  '310': 'movie',
  '83': 'masks-theater',
  '43': 'run',
  '37': 'dice-3',
  '9999924': 'building-fortress',

  '355': 'bed',
  '357': 'bed',
  '356': 'bed',
  '124473': 'zzz-off',
  '52': 'mountain',
  '113': 'palette'
};

export const FALLBACK_ACTIVITY_ICON: ActivityIconName = 'circle-dashed-x';

function isActivityIconName(value: string): value is ActivityIconName {
  return (ACTIVITY_ICON_NAMES as string[]).includes(value);
}

/**
 * Resolves the icon to display for an activity: a value already saved as one
 * of our curated icon names wins, then the manually-curated Daylio id lookup,
 * then a neutral fallback.
 */
export function resolveActivityIcon(icon: string | null): ActivityIconName {
  if (icon && isActivityIconName(icon)) {
    return icon;
  }
  if (icon && DAYLIO_ICON_MAP[icon]) {
    return DAYLIO_ICON_MAP[icon];
  }
  return FALLBACK_ACTIVITY_ICON;
}
