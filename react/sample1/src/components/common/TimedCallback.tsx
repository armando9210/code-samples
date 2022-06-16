import { Progress, ProgressProps } from 'antd';
import React, { useEffect, useState } from 'react';

interface TimedCallbackProps extends ProgressProps {
  /**
   * Indicates if the timer must be on pause
   */
  paused?: boolean;
  /**
   * Specify how many seconds will be used to count down
   */
  seconds?: number;
  /**
   * Callback used when the counter reaches 0
   */
  onCountDownFinished: () => void;
  /**
   * If false, the component won't render a progress bar
   */
  render?: boolean;
}

/**
 * Component used to execute a callback every N seconds.
 *
 * Normally renders a progress bar but also can be used as a non-render component
 * setting `renderProgress = false`
 */
const TimedCallback: React.FC<TimedCallbackProps> = (
  {
    seconds = 60,
    onCountDownFinished,
    render = true,
    paused = false,
    ...progressProps
  },
) => {
  const [percentage, setPercentage] = useState<number>(100);

  // Reset the percentage whenever the seconds change
  useEffect(() => setPercentage(100), [seconds]);

  useEffect(() => {
    if (paused) {
      return () => {
      };
    }

    const timeout = setTimeout(() => {
      const newPercentage = percentage - (100 / seconds);

      if (newPercentage >= 0) {
        setPercentage(newPercentage);
        return;
      }

      onCountDownFinished?.();
      setPercentage(100);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onCountDownFinished, percentage, seconds, paused]);

  if (!render) {
    return null;
  }

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Progress
      strokeColor={{
        '0%': '#006dff',
        '100%': '#006dff',
      }}
      strokeWidth={2}
      showInfo={false}
      {...progressProps}
      percent={percentage}
    />
  );
};

export default TimedCallback;
