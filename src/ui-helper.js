import color from 'color';

export function getContrastColor(referenceColor, transparency = 0) {
  const c = color(referenceColor).isLight() ? '#000' : '#FFF';
  return transparency ? color(c).alpha(transparency).toString() : c;
}
