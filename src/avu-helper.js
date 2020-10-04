export const MAX_AVUS = 1000000000;

export function getAvuFactorFromWorkspaceWidth(workspaceWidth, horizontalMargin, sideBarWidth) {
  const ignoredSpace = (2 * horizontalMargin) + sideBarWidth;
  return (workspaceWidth - ignoredSpace) / MAX_AVUS;
}

export function avu2Px(avus, avuFactor) {
  return avus * avuFactor;
}
