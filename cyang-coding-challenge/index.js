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
    .catch(function (err) {
      console.log('Error: ', err);
    });
  return variants;
}

async function fetchURL(url) {
  var response;
  await fetch(url)
    .then(res => response = res)
    .catch(function (err) {
      console.log('Error: ', err);
    });
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
  const variantOne = data["variants"][0]
  const variantTwo = data["variants"][1]
  var variantSelector = null;

  let cookiesStr = request.headers.get('Cookie') || ""
  let cookiesArr = cookiesStr.split(";")
  let cookieFound = null
  cookiesArr.forEach(cookie => {
    if (cookie.includes("returning"))
      cookieFound = cookie
  });
  if (cookieFound) //if cookie exists, set variantSelector to the value of the cookie-key
  {
    variantSelector = parseInt(cookieFound.slice(-1))
    if (variantSelector === 0) 
    {
      let res = await fetchURL(variantOne)
      return REWRITER_V1.transform(res)
    }
    else 
    {
      let res = await fetchURL(variantTwo)
      return REWRITER_V2.transform(res)
    }
  }
  else //if cookie doesn't exist, randomly redirect to one of the variants and create cookie to persist for every url revisit
  {
    variantSelector = Math.round(Math.random()) //either 0 or 1; 0 corresponds to variantOne; 1 corresponds to variantTwo;
    if (variantSelector == 0) 
    {
      let res = await fetchURL(variantOne)
      res = new Response(res.body, res)
      let cookieStr = "returning=" + variantSelector.toString()
      res.headers.set("Set-Cookie", cookieStr)
      return REWRITER_V1.transform(res)
    }
    else 
    {
      let res = await fetchURL(variantTwo)
      res = new Response(res.body, res)
      let cookieStr = "returning=" + variantSelector.toString()
      res.headers.set("Set-Cookie", cookieStr)
      return REWRITER_V2.transform(res)
    }
  }
}