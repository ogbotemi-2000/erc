function inView(value) { 
            const item = value.getBoundingClientRect(); 
            return ( 
                item.top >= 0 && 
                item.left >= 0 && 
                item.bottom <= ( 
                    window.innerHeight || 
                    document.documentElement.clientHeight) && 
                item.right <= ( 
                    window.innerWidth || 
                    document.documentElement.clientWidth) 
            );
}
function onScroll(page, mthd, sTop, t) {
  !(t = onScroll).lastY&&(t.lastY=0), sTop = page.scrollY||page.scrollTop,
  mthd = cLs, window.topCta&&['show', 'relative', 'absolute']
  .forEach((e, i, a, cls)=>{(cls = topCta.classList)[mthd(heap = sTop < t.lastY)](e),
    i===2&&cls[mthd(!heap)](e), i===1&&cls[mthd(heap)](e)
  }),
  setTimeout(_=>t.lastY=sTop);
  return t.lastY/(page.scrollHeight||innerHeight)
}


function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of the white box if rendered for any reason.
  ['color', 'background'].forEach(e=>textArea.style[e] = 'transparent'),
  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let msg;
  try {
    var successful = document.execCommand('copy');
    msg = successful ? 'copied' : 'failed to copy';
  } catch (err) {
    msg = 'cannot copy; no support'
  }
  document.body.removeChild(textArea);
  return msg
}


/*
Used for development purposes only
*/

function minMax(obj, isRem, arr=['min','max'], vary, cnst, fn, str) {
  minMax.switch = fn = (value, isRem) =>isRem ? value*16 : value/16,
    
  arr.forEach((e, i, arr, max)=>{
    arr[i] = obj[e], max = arr[2+i] = obj['v'+e],
    !i ? vary = (obj[arr[1+i]] - arr[i])/(obj['v'+arr[i+1]] - max) : (cnst = (arr[i] - max * vary)/16, str = `clamp(${fn(arr[i-1], false)}rem, ${cnst.toFixed(3)}rem + ${(100*vary).toFixed(2)}vw, ${fn(arr[i], false)}rem ) `)
  });
  return str
}
