export function lpad(str, length, padString) {
  while (str.length < length) {
    str = padString + str;
  }
  return str;
}

export function formatDstValue(value) {
  if (!value) return '';
  value = parseInt(value, 10).toString();
  const paddedValue = lpad(value, 3, 0);
  let hours = paddedValue.substr(0, paddedValue.length - 2);
  let minutes = paddedValue.substr(-2);

  if (hours > 24) hours = '24';
  if (minutes > 59) minutes = '00';

  if (hours === '24') minutes = '00';

  return `${hours}h${minutes}`;
}

export function formatMinutesToHoursWithMinutes(minutes, lpadHours = 2) {
  if (typeof minutes === 'undefined') {
    return '';
  }
  let completeHours = Math.trunc(minutes / 60).toString();
  completeHours = lpad(completeHours, lpadHours, 0);
  let remainderMinutes = (minutes % 60).toString();
  remainderMinutes = lpad(remainderMinutes, 2, 0);
  return `${completeHours}h${remainderMinutes}`;
}

export function formatHoursToMinutes(time) {
  const timeSplit = time.split('h');
  const hours = parseInt(timeSplit[0], 10);
  const minutes = parseInt(timeSplit[1], 10);
  const totalMinutes = `${hours * 60 + minutes}`;

  return totalMinutes;
}
