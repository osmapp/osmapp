import { isBrowser } from '../components/helpers';

export const isIOS = () =>
  isBrowser() &&
  ([
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document));

export const isAndroid = () =>
  isBrowser() && navigator.userAgent.toLowerCase().indexOf('android') > -1;

export const getPlatform = () => {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'desktop';
};
