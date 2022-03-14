'use strict';
import { Subject } from 'rxjs';
import { multicast, refCount } from 'rxjs/operators';

const iFlightRxjs = {
  operators: {
    multicast,
    refCount,
  },
  Subject,
};

export { iFlightRxjs };
