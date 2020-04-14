addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function fetchVariants() {
  var variants;
  await fetch("https://cfw-takehome.developers.workers.dev/api/variants")
    .then(res => res.json())
    .then(data => variants = data)
  return variants;
}

async function fetchURL(url) {
  var response;
  await fetch(url)
    .then(res => response = res)
  return response
}
async function handleRequest(request) {
  const variants = await fetchVariants();
  const varOne = variants["variants"][0]
  const varTwo = variants["variants"][1]
  const randomN = Math.round(Math.random()) //either 0 or 1


  if (randomN == 0) {
    console.log(randomN)
    return await fetchURL(varOne)
  } else {
    console.log(randomN)
    return await fetchURL(varTwo)
  }
}