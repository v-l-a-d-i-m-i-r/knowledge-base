import crypto from 'crypto';

export function calcMd5Hash(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

export function getTimestampFromUuidV7(uuid: string): Date {
  // Remove hyphens and take first 12 hex digits (48 bits = 6 bytes)
  const hexTime = uuid.replace(/-/g, '').substring(0, 12);

  // Parse hex as integer (milliseconds since Unix epoch)
  const unixMillis = parseInt(hexTime, 16);

  return new Date(unixMillis);
}
