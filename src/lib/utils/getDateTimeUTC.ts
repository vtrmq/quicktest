export function getDateTimeUTC() {
  const now: Date = new Date();
  const isoString: string = now.toISOString(); 
  return isoString.slice(0, 19).replace('T', ' '); 
}
