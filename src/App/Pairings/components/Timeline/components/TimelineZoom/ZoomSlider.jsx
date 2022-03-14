import React from 'react';
import SliderMUI from '@material-ui/lab/Slider';

import { MAX_ZOOM_IN, MAX_ZOOM_OUT, SLIDER_STEP } from './constants';

function ZoomSlider(props) {
  return (
    <div className="zoom-slider-container">
      <SliderMUI
        {...props}
        classes={{
          container: 'zm-slider',
          track: 'zm-slider-track',
          trackBefore: 'zm-slider-track-before',
          trackAfter: 'zm-slider-track-after',
          thumb: 'zm-slider-thumb',
          activated: 'zm-slider-thumb-activated',
        }}
        min={MAX_ZOOM_OUT}
        max={MAX_ZOOM_IN}
        step={SLIDER_STEP}
      />
    </div>
  );
}

export default ZoomSlider;
