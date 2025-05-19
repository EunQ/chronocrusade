import { nanoid } from 'nanoid';

export function generateTimestampId(): string {
  const now = new Date().toISOString();
  return now.slice(0, 16).replace(/[-T:]/g, '');
}

export function generateEventId(): string {
  return `EVT-${generateTimestampId()}-${nanoid(5)}`;
}

export function generateRewardId(): string {
  return `RWD-${generateTimestampId()}-${nanoid(5)}`;
}
