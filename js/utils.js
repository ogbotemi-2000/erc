  function relation(parent, child) {
      return [parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINED_BY,
              parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINS]
  }

  let Abbr={
    dict: function(arr) {
      arr.forEach((str, abbr)=>{
        abbr=str.charAt(0), str.replace(/[A-Z]/g, a=>abbr+=a),
        (this.__dict||={})[abbr] = str
      })
    },
    to  : function(node, arg, flag, dict, arr) {
      dict = this.__dict, str='', arr = Array.isArray(arg)?arg:[arg];
      for(let e, p=[], k=0, j=arr.length; p=[], e=arr[k], k<j; k++) {
        if(typeof e==="object") {
          if(e.at) p=e;
          else { for(let i in e) { (e[i]+' ').repeat(i).split(/\s+/).forEach(e=>e&&p.push(e)) } } 
        }
        else p=[e];
        p.find((str, v, bool)=>((v=node[str]||node[dict[str]])?node=v:/*break*/k=j, /*enforce*/flag&&(node=v), !v))
      }
      return node
    }
   };
  Abbr.dict(['childNodes', 'classList', 'parentNode', 'previousElementSibling', 'nextElementSibling', 'nextSibling', 'firstChild', 'firstElementChild', 'lastChild', 'lastElementChild']);

(function() {  
  function detectInconsistentEval() {
    let length = eval.toString().length;
    let userAgent = navigator.userAgent.toLowerCase();
    let browser;

    if (userAgent.indexOf("edg/") !== -1) {
      browser = "edge";
    } else if (
      userAgent.indexOf("trident") !== -1 ||
      userAgent.indexOf("msie") !== -1
    ) {
      browser = "internet_explorer";
    } else if (userAgent.indexOf("firefox") !== -1) {
      browser = "firefox";
    } else if (
      userAgent.indexOf("opera") !== -1 ||
      userAgent.indexOf("opr") !== -1
    ) {
      browser = "opera";
    } else if (userAgent.indexOf("chrome") !== -1) {
      browser = "chrome";
    } else if (userAgent.indexOf("safari") !== -1) {
      browser = "safari";
    } else {
      browser = "unknown";
    }

    if (browser === "unknown") return false;

    return (
      (length === 33 && !["chrome", "opera", "edge"].includes(browser)) ||
      (length === 37 && !["firefox", "safari"].includes(browser)) ||
      (length === 39 && !["internet_explorer"].includes(browser))
    );
  }
  function byUserAgent(ev, axes) {
    if(navigator.userAgent.includes("Headless") || !navigator.languages.length || navigator.webdriver|| document.$cdc_asdjflasutopfhvcZLmcfl_|| detectInconsistentEval()) return;
    /*events like click can't be so precisely fired by a human as to have the coordinates of the point clicked to be at the top right i.e 0. 0*/
    axes = ['clientX', 'clientY', 'pageX', 'pageY', 'screenX', 'screenY', 'x', 'y'].map(e=>ev[e]).filter(e=>e);
    /*bots powered by selenium may fool browsers by making dispatched events seem user-prompted hence why isTrusted comes second*/
    return !!(axes.length||ev.isTrusted||ev.detail)
  }
  window.byUserAgent = byUserAgent
})()