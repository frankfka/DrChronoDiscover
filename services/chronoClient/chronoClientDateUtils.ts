import { DateTime } from 'luxon';
import { dateTimeFromISO, dateTimeToISO } from '../../utils/dateUtils';

export function toChronoDateString(dateTime: DateTime): string {
  return dateTime.toISODate(); // YYYY-MM-DD
}

export function toChronoDateTimeString(dateTime: DateTime): string {
  return dateTimeToISO(dateTime);
}

export function fromChronoDateTimeString(dateString: string): DateTime {
  return dateTimeFromISO(dateString);
}
