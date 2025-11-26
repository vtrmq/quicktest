export function formatDateHour(fechaStr: string): string {
  const [fecha, hora] = fechaStr.split(' ');
  const [año, mes, dia] = fecha.split('-');
  const [horas, minutos] = hora.split(':');

  const h = parseInt(horas);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;

  return `${dia}/${mes}/${año} ${h12.toString().padStart(2, '0')}:${minutos} ${ampm}`;
}   
