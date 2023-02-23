const MIN_SLIDER_WIDTH = 0.1;

const getDefaultSliderWidth = (
  data_count: number,
  data_window_width: number,
  slider_min = 0,
  slider_max = 1,
) => {
  // if desired slider window is bigger than total data count, return the whole slider range
  if (data_count <= data_window_width) {
    return slider_max - slider_min;
  }

  // return slider window width as a fraction from the slider range
  const sliderWidth = (data_window_width / data_count) * (slider_max - slider_min);

  return sliderWidth < MIN_SLIDER_WIDTH ? MIN_SLIDER_WIDTH : sliderWidth;
};

export const getDefaultSliderPosition = (data_count: number, data_width: number) => {
  return {
    start: 1 - getDefaultSliderWidth(data_count, data_width),
    end: 1,
  };
};
