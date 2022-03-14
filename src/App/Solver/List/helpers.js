import moment from 'moment';

export const sortRequests = requests =>
  requests.sort(
    (a, b) =>
      // moment.utc(b.statusTimestamp).diff(moment.utc(a.statusTimestamp))
      Number(b.id) - Number(a.id)
  );
