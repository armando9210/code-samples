import { useState, useEffect } from 'react';
import moment from 'moment';
import authentication from 'react-azure-b2c';
import { LOCAL_CACHE_TTL } from '../constants/config';
import { performLogout } from '../services/logout';
import store from '../redux/store';
import profileActions from '../redux/actions/profiles';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [delay, value],
  );

  return debouncedValue;
};

export const copyText = (elementRef) => {
  elementRef.current.select();
  document.execCommand('copy');
};

export const getCacheItem = (key) => {
  const item = window.localStorage.getItem(key);
  let ret = null;

  if (item) {
    try {
      const data = JSON.parse(item);
      const now = (new Date()).getTime();

      if (data && data.time && typeof data.time === 'number') {
        const interval = now - data.time;

        if (interval >= 0 && interval <= LOCAL_CACHE_TTL) {
          ret = data.value;
        }
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log(`Get cache error: ${e}`);
    }
  }

  return ret;
};

export const setCacheItem = (key, data) => {
  const now = (new Date()).getTime();
  const item = {
    time: now,
    value: data,
  };

  window.localStorage.setItem(key, JSON.stringify(item));
};

export function getDateElement(element, date) {
  switch (element){
    case 'month': return date.format('MMMM');
    case 'day': return date.date() > 9 ? date.date() : `${'0'}${date.date()}`;
    case 'year': return date.year();
    case 'weekDay': return date.format('dddd');
    case 'time': return date.format('hh:mm A');
    default: return date;
  }
}

export const formatDate = (date, type) => {
  if (!date) return '-';

  const gmtDateTime = moment.utc(date);
  switch (type) {
    case 'fullDate':
      return `${getDateElement('month', gmtDateTime)} ${getDateElement('day', gmtDateTime)}, ${getDateElement('year', gmtDateTime)}`;

    case 'dateTime':
      return gmtDateTime.format('MM/DD/YYYY - hh:mm A');

    case 'fullDateWeekDay':
      return `${getDateElement('weekDay', gmtDateTime)}, ${getDateElement('month', gmtDateTime)}, ${getDateElement('day', gmtDateTime)} ${getDateElement('year', gmtDateTime)}`;

    case 'time': return getDateElement('time', gmtDateTime);

    default: return gmtDateTime.format('MM/DD/YYYY');
  }
};

export const plainArray = ([head, ...tail]) => !head ? [] : plainArray(tail).concat(...head.packages);

export const objectToArray = (obj) => Object.keys(obj).map(key => obj[key]);

export const randomString = (length = 16) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  // eslint-disable-next-line
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const reduceTimeline = (list, dateKey, content) => list.reduce((acum, current) => {
  const date = formatDate(current[dateKey], 'fullDateWeekDay');

  if (acum[date]) {
    acum[date].push({
      content: current[content],
      time: formatDate(current[dateKey], 'time'),
    });
  } else {
    // eslint-disable-next-line
    acum[date] = [{
      content: current[content],
      time: formatDate(current[dateKey], 'time'),
    }];
  }

  return acum;
}, {});

export const getProfiles = () => {
  const reducerProfile = JSON.parse(localStorage.getItem('persist:root'));
  return reducerProfile ? JSON.parse(reducerProfile.profiles).profiles : [];
};

export const getProfileIndex = () => {
  const reducerProfile = JSON.parse(localStorage.getItem('persist:root'));
  return reducerProfile ? JSON.parse(reducerProfile.profiles).selectedIndex : 0;
};

export const isEmail = (email, isRequired = false) => {
  if (email === '' && !isRequired) return true;
  // eslint-disable-next-line no-control-regex
  const pattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  return pattern.exec(email) !== null;
};

export const isZipCode = (zip, isRequired = false) => {
  if (zip === '' && !isRequired) return true;
  // eslint-disable-next-line no-control-regex
  const pattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
  return pattern.exec(zip) !== null;
};

export const isPhoneFax = (number, isRequired = false) => {
  if (number === '' && !isRequired) return true;
  // eslint-disable-next-line no-control-regex
  const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return pattern.exec(number) !== null;
};

export const isWeb = (url, isRequired = false) => {
  if (url === '' && !isRequired) return true;
  // eslint-disable-next-line no-control-regex
  const pattern = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
  return pattern.exec(url) !== null;
};

export const leftTrim = (str) => str.replace(/^\s+/, '');

// eslint-disable-next-line
export let isLoggingOut = false;

export const logout = async () => {
  isLoggingOut = true;
  performLogout();
  authentication.signOut();
  store.dispatch(profileActions.setIsProfileSelected(false));
};

export const compareStrings = (a, b, order) =>
  order === 'ascend' ?
    a.localeCompare(b) :
    b.localeCompare(a);

export const compareNumbers = (a, b, order) =>
  order === 'ascend' ?
    a - b :
    b - a;

export const isString = (v) => typeof v === 'string';

export const sortDataTable = (data = [], { field, order }) =>
  data.sort((a = {}, b = {}) =>
    isString(a[field]) ?
      compareStrings(a[field], b[field], order) :
      compareNumbers(a[field], b[field], order));

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))  } ${  sizes[i]}`;
};

/**
 * Given any string, convert it to snake case
 *
 * @param {string} input
 */
export function toSnakeCase(input) {
  return input
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(w => w.toLowerCase())
    .join('_');
}

export function cartesian() {
  // eslint-disable-next-line prefer-rest-params
  const r = []; const arg = arguments[0].map(m => m); const max = arg.length - 1;
  function helper(arr, i) {
    // eslint-disable-next-line no-plusplus
    for (let j = 0, l = arg[i].length; j < l; j++) {
      const a = arr.slice(0);
      a.push(arg[i][j]);
      if (i === max) {
        r.push(a);
      } else
        helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
}
