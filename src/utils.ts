// When using a tag function we get all individual components. This creates it into the string.
const tagCollect =
  <T>(map: (str: string) => T) =>
  (strings: TemplateStringsArray, ...values: unknown[]): T => {
    let str = "";
    for (let i = 0; i < strings.length; i++) {
      str += strings[i];
      if (i < values.length) str += values[i];
    }
    return map(str);
  };

export const dedent = tagCollect((str) => {
  const lines = str.split("\n");

  // find indent level
  let indent = 0;
  for (const line of lines) {
    if (line.trim() === "") continue;

    const count = line.search(/\S|$/);
    if (indent === 0 || count < indent) indent = count;
  }

  // remove leading empty lines
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();

  // remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();

  // remove indent
  return lines.map((line) => line.slice(indent)).join("\n");
});
