export function profile(p: string) {
  let proFile: string = '';
  switch(p) {
    case 'A': proFile = 'Admin'; break;
    case 'T': proFile = 'Docente'; break;
    case 'S': proFile = 'Estudiante'; break;
  }
  return proFile;
}
