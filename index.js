addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
// responsible for rewriting variation 1
class Variant1WebRewriter {
  element(element) {
    let idOfElement = element.getAttribute("id");
    let tagOfElement = element.tagName;

    if (tagOfElement === "h1" && idOfElement === 'title');
      element.setInnerContent("Variation numero uno");
    if (tagOfElement === "p" && idOfElement === 'description') element.setInnerContent("Ryan's Website");
    if (tagOfElement === "a" && idOfElement === 'url')
      element.setInnerContent("http://tyranitar898.github.io/UofT");
  }
   
}
// responsible for rewriting variation 2
class Variant2WebRewriter {
  element(element) {
    
    let idOfElement = element.getAttribute("id");
    let tagOfElement = element.tagName;

    if (tagOfElement === "h1" && idOfElement === 'title');
      element.setInnerContent("Variation numero dos");
    if (tagOfElement === "p" && idOfElement === 'description') element.setInnerContent("UofT's Website");
    if (tagOfElement === "a" && idOfElement === 'url')
      element.setInnerContent("http://tyranitar898.github.io/UofT");
  }  
}

//single rewriter through the worker
const rewriter = new HTMLRewriter();


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

    
    //attach handlers depending on what variation we get using .on()  
    if (oneOfVariants === "https://cfw-takehome.developers.workers.dev/variants/1"){
      rewriter.on("h1#title", new Variant1WebRewriter())
      .on("p#description", new Variant1WebRewriter())
      .on("a#url", new Variant1WebRewriter());
    }else{
      rewriter.on("h1#title", new Variant2WebRewriter())
      .on("p#description", new Variant2WebRewriter())
      .on("a#url", new Variant2WebRewriter());
    }
    return rewriter.transform(res2);
    
  } catch (err) {
    console.log(err);
    return new Response("Fetch didn't work so you're stuck with this!", {
      headers: { "content-type": "text/plain" },
    });
  }
}


/* what I submitted
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});


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
}

*/

/**
 * Respond with one of the two variants
 * @param {Request} request
 */

