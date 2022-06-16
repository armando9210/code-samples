import { RuleObject, StoreValue } from 'rc-field-form/es/interface';
import {isZipCode, isEmail, isPhoneFax, isWeb} from './index';

export const validateZipcode = async (rule: RuleObject, value: StoreValue) => {
  if (!rule.required && !value) {
    return;
  }

  const valid = isZipCode(value, rule.required);
  if (!valid) {
    throw new Error('Invalid Zipcode');
  }
};

export const validateEmail = async (rule: RuleObject, value: StoreValue) => {
  if (!rule.required && !value) {
    return;
  }

  const valid = isEmail(value, rule.required);
  if (!valid) {
    throw new Error('Invalid email');
  }
};

export const validatePhoneFaxNumber = async (rule: RuleObject, value: StoreValue) => {
  if (!rule.required && !value) {
    return;
  }

  const valid = isPhoneFax(value, rule.required);
  if (!valid) {
    throw new Error('Invalid Phone/Fax Number');
  }
};

export const validateURL = async (rule: RuleObject, value: StoreValue) => {
  if (!rule.required && !value) {
    return;
  }

  const valid = isWeb(value, rule.required);
  if (!valid) {
    throw new Error('Invalid URL');
  }
};
