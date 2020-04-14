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
async function handleRequest(request) {
  var variants = await fetchVariants();
  console.log(variants)
  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
}