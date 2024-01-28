(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function c(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=c(r);fetch(r.href,s)}})();var i=(e=>(e.Binary="Binary",e.Multivalue="Multivalue",e))(i||{}),n=(e=>(e.SRSW="SRSW",e.MRSW="MRSW",e.MRMW="MRMW",e))(n||{}),a=(e=>(e.Safe="Safe",e.Regular="Regular",e.Atomic="Atomic",e))(a||{});const p=e=>`${e.cardinality} ${e.interface} ${e.type}`,g=(()=>{const e=[];for(const t of Object.values(i))for(const c of Object.values(n))for(const o of Object.values(a))e.push({cardinality:t,interface:c,type:o});return e})(),v=(e,t)=>{switch(e){case"Binary":return!0;case"Multivalue":return t=="Multivalue"}},W=(e,t)=>{switch(e){case"SRSW":return!0;case"MRSW":return t=="MRSW"||t=="MRMW";case"MRMW":return t=="MRMW"}},j=(e,t)=>{switch(e){case"Safe":return!0;case"Regular":return t=="Regular"||t=="Atomic";case"Atomic":return t=="Atomic"}},y=(e,t)=>v(e.cardinality,t.cardinality)&&W(e.interface,t.interface)&&j(e.type,t.type),d=(e,t)=>e.cardinality==t.cardinality&&e.interface==t.interface&&e.type==t.type,w=e=>(t,...c)=>{let o="";for(let r=0;r<t.length;r++)o+=t[r],r<c.length&&(o+=c[r]);return e(o)},f=w(e=>{const t=e.split(`
`);let c=0;for(const o of t){if(o.trim()==="")continue;const r=o.search(/\S|$/);(c===0||r<c)&&(c=r)}for(;t.length>0&&t[0].trim()==="";)t.shift();for(;t.length>0&&t[t.length-1].trim()==="";)t.pop();return t.map(o=>o.slice(c)).join(`
`)}),B=[{maps:[{from:{cardinality:i.Binary,interface:n.SRSW,type:a.Safe},to:{cardinality:i.Binary,interface:n.MRSW,type:a.Safe}},{from:{cardinality:i.Multivalue,interface:n.SRSW,type:a.Safe},to:{cardinality:i.Multivalue,interface:n.MRSW,type:a.Safe}},{from:{cardinality:i.Binary,interface:n.SRSW,type:a.Regular},to:{cardinality:i.Binary,interface:n.MRSW,type:a.Regular}},{from:{cardinality:i.Multivalue,interface:n.SRSW,type:a.Regular},to:{cardinality:i.Multivalue,interface:n.MRSW,type:a.Regular}}],code:f`
      «init»
        Reg[1..N] := 0

      func Read()
        return Reg[i].read()
      
      func Write(v)
        for j in 1..N
          Reg[j].write(v)
    `},{maps:[{from:{cardinality:i.Binary,interface:n.SRSW,type:a.Safe},to:{cardinality:i.Binary,interface:n.SRSW,type:a.Regular}},{from:{cardinality:i.Binary,interface:n.MRSW,type:a.Safe},to:{cardinality:i.Binary,interface:n.MRSW,type:a.Regular}}],code:f`
      «init»
        Reg := 0
        old := 0
      
      func Read()
        return Reg.read()
      
      func Write(v)
        if old ≠ v
          Reg.write(v)
          old := v
    `},{maps:[{from:{cardinality:i.Binary,interface:n.SRSW,type:a.Regular},to:{cardinality:i.Multivalue,interface:n.SRSW,type:a.Regular}},{from:{cardinality:i.Binary,interface:n.MRSW,type:a.Regular},to:{cardinality:i.Multivalue,interface:n.MRSW,type:a.Regular}}],code:f`
      «init»
        Reg[0..M] := [1, 0, .., 0]
      
      func Read()
        for j in 0..M
          if Reg[j].read() = 1
            return j
      
      func Write(v)
        Reg[v].write(1)
        for j in (v-1)..0
          Reg[j].write(0)
    `},{maps:[{from:{cardinality:i.Binary,interface:n.SRSW,type:a.Regular},to:{cardinality:i.Binary,interface:n.SRSW,type:a.Atomic}},{from:{cardinality:i.Multivalue,interface:n.SRSW,type:a.Regular},to:{cardinality:i.Multivalue,interface:n.SRSW,type:a.Atomic}}],code:f`
      «init»
        Reg := (0, 0)
        t := 0
        x := 0
      
      func Read()
        (t', x') := Reg.read()
        if t' > t
          t := t'
          x := x'
        return x
      
      func Write(v)
        t := t + 1
        Reg.write((t, v))
    `},{maps:[{from:{cardinality:i.Binary,interface:n.SRSW,type:a.Atomic},to:{cardinality:i.Binary,interface:n.MRSW,type:a.Atomic}},{from:{cardinality:i.Multivalue,interface:n.SRSW,type:a.Atomic},to:{cardinality:i.Multivalue,interface:n.MRSW,type:a.Atomic}}],code:f`
      «init»
        RReg[(1, 1), (1, 2), .., (N, N)] := (0, 0)
        WReg[1..N] := (0, 0)
        t := 0
      
      func Read()
        for j in 1..N
          (t[j], x[j]) := RReg[i, j].read()
        (t[0], x[0]) := WReg[i].read()
        (t', x') := highest(t[..], x[..])
        for j in 1..N
          RReg[j, i].write((t', x'))
        return x'
      
      func Write(v)
        t := t + 1
        for j in 1..N
          WReg[j].write((t, v))
    `},{maps:[{from:{cardinality:i.Binary,interface:n.MRSW,type:a.Atomic},to:{cardinality:i.Binary,interface:n.MRMW,type:a.Atomic}},{from:{cardinality:i.Multivalue,interface:n.MRSW,type:a.Atomic},to:{cardinality:i.Multivalue,interface:n.MRMW,type:a.Atomic}}],code:f`
      «init»
        Reg[1..N] := (0, 0)
      
      func Read()
        for j in 1..N
          (t[j], x[j]) := Reg[j].read()
        (t', x') := highest(t[..], x[..])
        return x
        
      func Write(v)
        for j in 1..N
          (t[j], x[j]) := Reg[j].read()
        (t', x') := highest(t[..], x[..])
        Reg[i].write((t' + 1, v))
    `}],m=(()=>{const e=[];for(const t of g){const c=[];for(const o of B)for(const r of o.maps)if(y(r.from,t))for(const s of g)y(s,r.to)&&c.push({target:s,code:o.code});e.push([t,c])}return e})();console.assert(m.length===Object.keys(i).length*Object.keys(n).length*Object.keys(a).length);const x=(e,t)=>{if(d(e,t))return"same register";if(y(t,e))return"weakening";const c=[],o=s=>c.find(l=>d(l,s))!==void 0,r=[{node:e,path:[]}];for(;r.length>0;){const{node:s,path:l}=r.shift();if(d(s,t))return l;const M=m.find(([u])=>d(u,s))[1];for(const u of M)o(u.target)||(c.push(u.target),r.push({node:u.target,path:[...l,{from:s,to:u.target,code:u.code}]}))}return[]},S=e=>({get cardinality(){return document.querySelector(`input[name="${e}-cardinality"]:checked`).value},get interface(){return document.querySelector(`input[name="${e}-interface"]:checked`).value},get type(){return document.querySelector(`input[name="${e}-type"]:checked`).value}}),b=S("base"),A=S("target"),R=e=>{const t=["return","func","if","«init»","for","in"],c=["RReg","WReg","Reg"];let o=e.code;for(const r of t)o=o.split(r).join(`<span class="keyword">${r}</span>`);for(const r of c)o=o.split(r).join(`<span class="register">${r}</span>`);return`<pre><code>${o}</code></pre>`},h=()=>{const e=document.querySelector("#transformation"),t=x(b,A);switch(t){case"same register":e.innerHTML="Base and target register are the same kind of register.";break;case"weakening":e.innerHTML="The base register is strictly stronger than the target register.";break;default:if(t.length==0){e.innerHTML='<span class="error">No transformation found. This is most likely an error, please report it in the repository.</span>';break}else if(t.length==1){e.innerHTML=R(t[0]);break}e.innerHTML=t.map((c,o)=>`
            <div>
              <h3>Step #${o+1}: ${p(c.from)} ⟶ ${p(c.to)}</h3>
              ${R(c)}
            </div>`).join("");break}};for(const e of document.querySelectorAll("input"))e.addEventListener("input",h);h();
