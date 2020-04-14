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

const REWRITER_V1 = new HTMLRewriter()
  .on('title', { element: e => e.setInnerContent("CYang - Variant One") })
  .on('h1#title', { element: e => e.setInnerContent("Christopher Yang (Variant One)") })
  .on('p#description', { element: e => e.setInnerContent("Thank you Cloudflare for doubling the intern class size to accomodate for those who have had their internships cancelled due to the COVID-19 pandemic! <3") })
  .on('a#url', { element: e => e.setInnerContent("Link to my GitHub (pardon the name; I made it when I was in middle school)") })
  .on('a#url', { element: e => e.setAttribute("href", "https://github.com/bobeatschicken") })

const REWRITER_V2 = new HTMLRewriter()
  .on('title', { element: e => e.setInnerContent("CYang - Variant Two") })
  .on('h1#title', { element: e => e.setInnerContent("Christopher Yang (Variant Two)") })
  .on('p#description', { element: e => e.setInnerContent("Thank you Cloudflare for doubling the intern class size to accomodate for those who have had their internships cancelled due to the COVID-19 pandemic! <3") })
  .on('a#url', { element: e => e.setInnerContent("Link to my GitHub (pardon the name; I made it when I was in middle school)") })
  .on('a#url', { element: e => e.setAttribute("href", "https://github.com/bobeatschicken") })

async function handleRequest(request) {
  const data = await fetchVariants();
  const varOne = data["variants"][0]
  const varTwo = data["variants"][1]
  let randomN = Math.round(Math.random()) //either 0 or 1

  let cookies = request.headers.get('Cookie') || ""
  if (cookies.includes("returning")) { //if cookie exists, set randomN to key-value 
    randomN = parseInt(cookies.substring(10))
  } else { //if cookie doesn't exist, create cookie
    let res = null;
    if (randomN == 0) {
      let res = await fetchURL(varOne)
      res = new Response(res.body, res)
      let cookieStr = "returning=" + randomN.toString()
      res.headers.set("Set-Cookie", cookieStr)
      return REWRITER_V1.transform(res)
    } else {
      let res = await fetchURL(varTwo)
      res = new Response(res.body, res)
      let cookieStr = "returning=" + randomN.toString()
      res.headers.set("Set-Cookie", cookieStr)
      return REWRITER_V2.transform(res)
    }
  } //this part only executes if cookie exists; persist variant based on what the value of randomN was stored in cookie
  if (randomN == 0) {
    let res = await fetchURL(varOne)
    return REWRITER_V1.transform(res)
  } else {
    let res = await fetchURL(varTwo)
    return REWRITER_V2.transform(res)
  }
}