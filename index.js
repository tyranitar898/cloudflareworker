addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
// responsible for rewriting the html doms depending on the variant url given
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
        element.setInnerContent(
          "Projects that I made in school that im proud of"
        );
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
        element.setInnerContent("UofT's Website");
      if (tagOfElement === "a" && idOfElement === "url") {
        element.setInnerContent("The offical website of my University");
        element.setAttribute("href", "https://www.utoronto.ca/");
      }
    }
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

  let cookieString = request.headers.get("cookie");
  console.log(cookieString);

  if (cookieString) {
    if (cookieString.includes("variants/1")) {
      cookieString = "https://cfw-takehome.developers.workers.dev/variants/1";
    } else {
      cookieString = "https://cfw-takehome.developers.workers.dev/variants/2";
    }
  } else {
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

      cookieString = oneOfVariants;
    } catch (err) {
      console.log(err);
      return;
    }
  }

  let res2;
  try {
    res2 = await fetch(cookieString);
  } catch (err) {
    console.log(err);
    res2 = FAILEDFETCHRESPONSE;
  }

  //attach handlers depending on what variation we get using .on()
  rewriter
    .on("title", new VariantWebRewriter(cookieString))
    .on("h1#title", new VariantWebRewriter(cookieString))
    .on("p#description", new VariantWebRewriter(cookieString))
    .on("a#url", new VariantWebRewriter(cookieString));

  let finalRes = rewriter.transform(res2);
  finalRes.headers.append("Set-Cookie", cookieString);
  return finalRes;
}

/*
async function handleRequest(request) {
  const NAME = "experiment-0";
  // Responses below are place holders, you could set up
  // a custom path for each test (e.g. /control/somepath )
  const TEST_RESPONSE = new Response("Test group"); // fetch('/test/sompath', request)
  const CONTROL_RESPONSE = new Response("Control group"); // fetch('/control/sompath', request)
  // Determine which group this requester is in.
  const cookie = request.headers.get("cookie");
  if (cookie && cookie.includes(`${NAME}=control`)) {
    return CONTROL_RESPONSE;
  } else if (cookie && cookie.includes(`${NAME}=test`)) {
    return TEST_RESPONSE;
  } else {
    // if no cookie then this is a new client, decide a group and set the cookie
    let group = Math.random() < 0.5 ? "test" : "control"; // 50/50 split
    let response = group === "control" ? CONTROL_RESPONSE : TEST_RESPONSE;
    response.headers.append("Set-Cookie", `${NAME}=${group}; path=/`);
    return response;
  }
}*/

/*
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
    return fetch(oneOfVariants);
  } catch (err) {
    console.log(err);
    return new Response("Fetch didn't work so you're stuck with this!", {
      headers: { "content-type": "text/plain" },
    });
  }
}*/

/**
 * Respond with one of the two variants
 * @param {Request} request
 */
