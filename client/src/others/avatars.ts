export function userAvatarUrl(userHash: string) {
  return `https://identicon-api.herokuapp.com/${encodeURIComponent(userHash)}/50?format=png`;
}

function stringToHslColor(str: string, s: number = 30, l: number = 80): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  hash = hash >= 0 ? hash : -hash;
  const h = hash % 360;
  //return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  return hslToHex(h, s, l);
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function groupAvatarUrl(groupName: string) {
  const color = stringToHslColor(groupName).substring(1);
  return `https://eu.ui-avatars.com/api/?background=${color}&size=50&name=${encodeURIComponent(
    groupName
  )}`;
}

export function groupAvatarUrl2(groupName: string) {
  return `https://avatar.oxro.io/avatar.png?name=${encodeURIComponent(groupName)}`;
}

export function personAvatarUrl(nr: number) {
  return `https://i.pravatar.cc/100?a=${nr}`;
}
