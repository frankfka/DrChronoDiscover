import { DateTime, Duration, Interval } from 'luxon';

type ISOFormat = 'date' | 'time' | 'standard';
export const dateTimeToISO = (
  dateTime: DateTime,
  format: ISOFormat = 'standard'
): string => {
  switch (format) {
    case 'standard':
      return dateTime.toISO({
        suppressMilliseconds: true,
        suppressSeconds: true,
        includeOffset: false,
      });
    case 'time':
      return dateTime.toISOTime();
    case 'date':
      return dateTime.toISODate();
  }
};

export const dateTimeFromISO = (
  isoDate: string,
  dateOnly = false
): DateTime => {
  const dt = DateTime.fromISO(isoDate);
  return dateOnly
    ? dt.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
    : dt;
};

export const intervalToDurationInMinutes = (interval: Interval): number => {
  return durationToMinutes(interval.toDuration('minutes'));
};

export const durationToMinutes = (duration: Duration): number => {
  return duration.as('minutes');
};

export const durationFromMinutes = (numMinutes: number): Duration => {
  return Duration.fromMillis(numMinutes * 60 * 1000);
};

type FormatDateTimeStringType = 'date' | 'time';
export const dateTimeToFormattedString = (
  dateTime: DateTime,
  type: FormatDateTimeStringType
): string => {
  switch (type) {
    case 'date':
      return dateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    case 'time':
      return dateTime.toLocaleString(DateTime.TIME_SIMPLE);
  }
};

export const isoToFormattedString = (
  isoDate: string,
  type: FormatDateTimeStringType
): string => {
  return dateTimeToFormattedString(DateTime.fromISO(isoDate), type);
};
