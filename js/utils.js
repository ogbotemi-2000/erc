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
   }, cLs=bool=>bool?'add':'remove';
  Abbr.dict(['childNodes', 'classList', 'parentNode', 'previousElementSibling', 'nextElementSibling', 'nextSibling', 'firstChild', 'firstElementChild', 'lastChild', 'lastElementChild']);

/*self contained component*/
function grow_shrink(e,i,c,n,d,k, cls){
  d=grow_shrink,n={500:'base',640:'sm',768:'md',1024:'lg',1280:'xl'},
  c=document.createElement("div"),
  !d.cached&&(d.cached={}),!d.arr&&(d.arr=[].slice.call((d.el=window.growShrink).querySelectorAll(".fluid"))),
  !d.dump&&(d.dump=d.el.querySelector("a+div>div")),
  (e=(k=Object.keys(n).filter((c,n)=>(i=n,c>e)))[0]), k = new RegExp(k.map(e=>n[e]+':show').join('|')),
  d.vw!==e&&!d.cached[d.vw=e]&&d.arr.forEach((n,r,o)=>{
    (n=n.cloneNode(!0)).classList.add(c.className=d.el.getAttribute('data-classname'));
    if(((cls=n.classList)+'').match(k)) cls.remove('clicked'), (cls+'').replace(/(base|sm|md|lg|xl):show/, function(a) {
      cls.remove(a, 'fluid')
    }), /* n.className=l?"clicked":"",*/ c.appendChild(n), !d.cached[e]&&(d.cached[e]=c)
  }),d.dump.replaceChild(d.cached[e]||c,d.dump.firstChild)}

window.addEventListener('DOMContentLoaded', _=>{
  window.growShrink&&(grow_shrink(innerWidth), this.onresize=_=>grow_shrink(innerWidth))
});

