/**
 * Simple encapsulation of message function for antd message.
 * Embed a custom style into the message. Currently does not support importing custom styles.
 * When click the message, it will be destroyed.
 * The calling method is the same as the original, but it only allows incoming objects as call parameters.
 * Note: can not define your own onClick handler at the moment.
 * Message handlers currently available include: error, info, loading, success and warning.
 */

//import { v4 as uuid } from 'uuid';
import { message } from 'antd';
import { DEFAULT_ERR_MSG_DISPLAY_DURATION } from '../../constants/config';
import { messageStyle } from './styledComponents';

const randomString = (length: number = 16) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const makeMessage = (msg: StringKAnyVPair) => {
  //const id = uuid();
  const id = `m-${randomString()}`;
  const duration =
    'number' === typeof msg.duration
      ? msg.duration
      : DEFAULT_ERR_MSG_DISPLAY_DURATION;
  const msgObj = {
    duration,
    ...msg,
    content: msg.content ? msg.content : ' ',
    key: id,
    style: messageStyle,
    onClick() {
      if (duration > 0) {
        //console.log('dd', duration);
        message.destroy(id);
      }

      if ('function' === typeof msg.onClick) {
        msg.onClick();
      }
    },
  };

  if (!msg.content) {
    console.log('message can not be logic empty');
  }

  return msgObj;
};

/**
 * Return the corresponding message handler.
 */
const handleMessage = (handler: Function) => {
  return (param: StringKAnyVPair | string) => {
    const msg = 'string' === typeof param ? { content: param } : param;
    const msgObj = makeMessage(msg);

    handler(msgObj);

    return () => {
      message.destroy(msgObj.key);
    };
  };
};

/**
 * The namespace of the message handlers.
 */
const msgSpace = {
  error: handleMessage(message.error),

  info: handleMessage(message.info),

  loading: handleMessage(message.loading),

  open: handleMessage(message.open),

  success: handleMessage(message.success),

  warning: handleMessage(message.warning),
};

export default msgSpace;
