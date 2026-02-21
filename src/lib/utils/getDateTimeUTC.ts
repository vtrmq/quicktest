export function getDateTimeUTC() {
  /*
  const now: Date = new Date();
  const isoString: string = now.toISOString(); 
  return isoString.slice(0, 19).replace('T', ' '); 
  */
  const date = new Date();
  return [
    date.getFullYear(),
    '-',
    String(date.getMonth() + 1).padStart(2, '0'),
    '-',
    String(date.getDate()).padStart(2, '0'),
    ' ',
    String(date.getHours()).padStart(2, '0'),
    ':',
    String(date.getMinutes()).padStart(2, '0'),
    ':',
    String(date.getSeconds()).padStart(2, '0')
  ].join('');
}
