export function searchUtil(input: string, template: string) {
  try {
    return new URL(input).toString();
  } catch (error) {}
  try {
    const url = new URL(`http://${input}`);
    if (url.hostname.includes(".")) return url.toString();
  } catch (error) {}
  return template.replace("%s", encodeURIComponent(input));
}
