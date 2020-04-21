addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
//Responsible for rewriting the html doms depending on the variant url provided
class VariantWebRewriter {
  constructor(variantUrl) {
    this.variantUrl = variantUrl;
  }

  element(element) {
    let idOfElement = element.getAttribute("id");
    let tagOfElement = element.tagName;
    if (
      this.variantUrl ===
      "https://cfw-takehome.developers.workers.dev/variants/1"
    ) {
      if (tagOfElement === "title");
      element.setInnerContent("Variation 1: Ryan's Projects");
      if (tagOfElement === "h1" && idOfElement === "title");
      element.setInnerContent("Variation Numero Uno");
      if (tagOfElement === "p" && idOfElement === "description")
        element.setInnerContent("Ryan's UofT projects");
      if (tagOfElement === "a" && idOfElement === "url") {
        element.setInnerContent("Ryan Chang's website and school projects");
        element.setAttribute("href", "https://tyranitar898.github.io/UofT/");
      }
    } else if (
      this.variantUrl ===
      "https://cfw-takehome.developers.workers.dev/variants/2"
    ) {
      if (tagOfElement === "title");
      element.setInnerContent("Variation 2: Ryan's Uni");
      if (tagOfElement === "h1" && idOfElement === "title");
      element.setInnerContent("Variation Numero Dos");
      if (tagOfElement === "p" && idOfElement === "description")
        element.setInnerContent("What Ryan Chang is currently reading");
      if (tagOfElement === "a" && idOfElement === "url") {
        element.setInnerContent("How to Build a Multiplayer (.io) Web Game");
        element.setAttribute(
          "href",
          "https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering"
        );
      }
    }
    //else do nothing (sice we don't care if its not one of these two urls)
  }
}

//single rewriter through the worker
const rewriter = new HTMLRewriter();

/**
 * Respond with one of the two variants
 * @param {Request} request
 */

async function handleRequest(request) {
  const FAILEDFETCHRESPONSE = new Response(
    "Fetch didn't work so you're stuck with this!",
    {
      headers: { "content-type": "text/plain" },
    }
  );

  //cookieString represents the user's variant link stored in the cookie of the browser
  //Initialized as NULL in the beginning since it will have never been to this site.
  let cookieString = request.headers.get("cookie");

  if (cookieString) {
    //Visited before
    if (cookieString.includes("variants/1")) {
      cookieString = "https://cfw-takehome.developers.workers.dev/variants/1";
    } else {
      cookieString = "https://cfw-takehome.developers.workers.dev/variants/2";
    }
  } else {
    //Never visited before
    try {
      //Fetch the variants and put them in an array;
      const variantsResponse = await fetch(
        "https://cfw-takehome.developers.workers.dev/api/variants"
      );
      const data = await variantsResponse.json();
      let variArray = data.variants;

      //Get a random variant and put one of them in variable cookieString
      randPos = Math.floor(Math.random() * variArray.length);
      cookieString = variArray[randPos];
    } catch (err) {
      console.log(err);
      return FAILEDFETCHRESPONSE;
    }
  }

  let responseFromVariant;
  try {
    responseFromVariant = await fetch(cookieString);
  } catch (err) {
    console.log(err);
    responseFromVariant = FAILEDFETCHRESPONSE;
  }

  //Attach handlers depending on what variation we get using .on()
  rewriter
    .on("title", new VariantWebRewriter(cookieString))
    .on("h1#title", new VariantWebRewriter(cookieString))
    .on("p#description", new VariantWebRewriter(cookieString))
    .on("a#url", new VariantWebRewriter(cookieString));

  //finalRes is a reponse object with all the proper "transformation" and proper cookie header
  let finalRes = rewriter.transform(responseFromVariant);
  finalRes.headers.append("Set-Cookie", cookieString);
  return finalRes;
}
