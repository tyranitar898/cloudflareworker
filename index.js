addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

class VariantWebRewriter {
  constructor() {}

  element(element) {
    if (element.tagName === "h1")
      element.setInnerContent("Variation numero uno");
    if (element.tagName === "p") element.setInnerContent("Ryan's Website");
    if (element.tagName === "a")
      element.setInnerContent("http://tyranitar898.github.io/UofT");
  }
}

const rewriter = new HTMLRewriter()
  .on("h1#title", new VariantWebRewriter())
  .on("p#description", new VariantWebRewriter())
  .on("a#url", new VariantWebRewriter());

/**
 * Respond with one of the two variants
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    //Fetch the variants and put them in an array;
    const res = await fetch(
      "https://cfw-takehome.developers.workers.dev/api/variants"
    );
    const data = await res.json();
    let variArray = data.variants;

    //Get a random variant and put one of them in variable oneOfTwo
    let oneOfVariants;
    randPos = Math.floor(Math.random() * variArray.length);
    oneOfVariants = variArray[randPos];

    const res2 = await fetch(oneOfVariants);
    console.log(res2);
    return rewriter.transform(res2);

    //return fetch(oneOfVariants);
  } catch (err) {
    console.log(err);
    return new Response("Fetch didn't work so you're stuck with this!", {
      headers: { "content-type": "text/plain" },
    });
  }
}
