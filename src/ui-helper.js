import color from 'color';

export function getContrastColor(referenceColor) {
  return color(referenceColor).isLight() ? '#000' : '#FFF';
}
