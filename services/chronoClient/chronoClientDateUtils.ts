import { DateTime } from 'luxon';

export function toChronoDateString(dateTime: DateTime): string {
  return dateTime.toISODate(); // YYYY-MM-DD
}

export function toChronoDateTimeString(dateTime: DateTime): string {
  return dateTime.toISO({
    includeOffset: false,
    suppressMilliseconds: true,
    suppressSeconds: true,
  }); // YYYY-MM-DDTHH:mm
}

export function fromChronoDateTimeString(dateString: string): DateTime {
  return DateTime.fromISO(dateString);
}
