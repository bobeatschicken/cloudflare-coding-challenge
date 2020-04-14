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

const REWRITER = new HTMLRewriter()
  .on('title', { element: e => e.setInnerContent("bobeatschicken") })
  .on('h1#title', { element: e => e.setInnerContent("Christopher Yang") })
  .on('p#description', { element: e => e.setInnerContent("Thank you Cloudflare for doubling the intern class size to accomodate for those who have had their internships cancelled due to the COVID-19 pandemic! <3") })
  .on('a#url', { element: e => e.setInnerContent("Link to my GitHub (pardon the name; I made it when I was in middle school lol)") })
  .on('a#url', { element: e => e.setAttribute("href", "https://github.com/bobeatschicken") })

async function handleRequest(request) {
  const variants = await fetchVariants();
  const varOne = variants["variants"][0]
  const varTwo = variants["variants"][1]
  const randomN = Math.round(Math.random()) //either 0 or 1


  if (randomN == 0) {
    console.log(randomN)
    const res = await fetchURL(varOne)
    return REWRITER.transform(res)
  } else {
    console.log(randomN)
    const res = await fetchURL(varTwo)
    return REWRITER.transform(res)
  }
}