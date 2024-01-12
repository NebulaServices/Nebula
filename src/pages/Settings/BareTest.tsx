export function BareTest(bareUrl) {
  const headers = new Headers({
    "x-bare-url": "https://www.google.com",
    "X-Bare-Headers": JSON.stringify({
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
    })
  });

  return fetch(bareUrl, {
    method: "GET",
    headers: headers
  })
    .then((response) => {
      if (
        response.headers.get("x-bare-status") === "200" ||
        response.headers.get("x-bare-status") === "302"
      ) {
        return true;
      } else {
        // the site is a real site but doesn't act like a bare server
        return false;
      }
    })
    .catch((error) => {
      // incase the site doesn't exist
      return false;
    });
}
