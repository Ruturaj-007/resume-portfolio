// Zero-dependency static generator: profile.json -> dist/
const fs = require('fs'), path = require('path');
const p = JSON.parse(fs.readFileSync('profile.json', 'utf8'));
const e = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const on = k => p[k] && p[k].show !== false && (!p[k].items || p[k].items.length || p[k].groups);
const LI = e(p.linkedin), ext = 'target="_blank" rel="noopener noreferrer"';
const h = p.hero, url = p.site.url.replace(/\/$/,'');
const secs = [['story','Journey'],['about','About'],['education','Education'],['experience','Experience'],['projects','Projects'],['skills','Skills'],['certifications','Certifications'],['contact','Contact']].filter(([k])=>on(k));
const first = secs.find(([k])=>['story','about','education'].includes(k));
const head = (k,i) => `<header class="sec-head"><span class="sec-no">${String(i+1).padStart(2,'0')}</span><h2>${e(p[k].heading)}</h2></header>`;
const idx = k => secs.filter(([x])=>x!=='story').findIndex(([x])=>x===k);
const S = {};
S.about = () => `<section id="about" class="sec reveal">${head('about',idx('about'))}${p.about.text.map(t=>`<p class="lead">${e(t)}</p>`).join('')}</section>`;
S.education = () => `<section id="education" class="sec reveal">${head('education',idx('education'))}<ol class="timeline">${p.education.items.map(i=>`<li><div class="when">${e(i.years)}</div><div><h3>${e(i.degree)}</h3><p class="org">${e(i.school)}</p><p class="meta">${e(i.meta)}</p></div></li>`).join('')}</ol></section>`;
S.experience = () => `<section id="experience" class="sec reveal">${head('experience',idx('experience'))}<div class="entries">${p.experience.items.map(i=>`<article class="entry"><div class="when">${e(i.dates)}</div><div><h3>${e(i.title)}</h3>${i.org?`<p class="org">${e(i.org)}</p>`:''}${i.place?`<p class="meta">${e(i.place)}</p>`:''}${i.status?`<p class="status">${e(i.status)}</p>`:''}${i.description?`<p>${e(i.description)}</p>`:''}${i.learning&&i.learning.length?`<p class="label">Intended learning areas</p><ul class="tags">${i.learning.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:''}${i.bullets&&i.bullets.length?`<ul class="bul">${i.bullets.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:''}</div></article>`).join('')}</div></section>`;
S.projects = () => `<section id="projects" class="sec reveal">${head('projects',idx('projects'))}<div class="entries">${p.projects.items.map((i,n)=>`<article class="entry"><div class="when">${String(n+1).padStart(2,'0')}</div><div><h3>${i.link?`<a href="${e(i.link)}" ${ext}>${e(i.title)} ↗</a>`:e(i.title)}</h3><p class="meta">${e(i.category)}</p><p>${e(i.description)}</p></div></article>`).join('')}</div></section>`;
S.skills = () => `<section id="skills" class="sec reveal">${head('skills',idx('skills'))}<div class="skill-groups">${p.skills.groups.map(g=>`<div class="sg"><p class="label">${e(g.label)}</p><ul class="tags">${g.items.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`).join('')}</div></section>`;
S.certifications = () => `<section id="certifications" class="sec reveal">${head('certifications',idx('certifications'))}<ul class="bul">${p.certifications.items.map(c=>`<li><strong>${e(c.name)}</strong> — ${e(c.issuer)}${c.date?` · ${e(c.date)}`:''}${c.url?` · <a href="${e(c.url)}" ${ext}>Credential ↗</a>`:''}</li>`).join('')}</ul></section>`;
S.contact = () => `<section id="contact" class="sec reveal">${head('contact',idx('contact'))}<p class="lead">${e(p.contact.text)}</p><a class="btn primary" href="${LI}" ${ext}>${e(p.contact.button)}</a></section>`;
S.story = () => { const it=p.story.items, n=it.length; return `<section id="story" class="story" style="--n:${n}" aria-label="${e(p.story.heading)}"><div class="stage"><div class="rail" aria-hidden="true"><span class="rail-line"><span class="rail-fill"></span></span>${it.map((c,i)=>`<i class="dot" style="top:${n>1?(i/(n-1)*100):0}%"><b>${e(c.kicker)}</b></i>`).join('')}</div><div class="chapters">${it.map((c,i)=>`<article class="chap" data-bg="${e(c.bg||'#F7F7F5')}"><div class="chap-text"><p class="kick"><span>${String(i+1).padStart(2,'0')}</span>${e(c.kicker)}</p><h2 class="split">${e(c.title)}</h2><p class="split body">${e(c.text)}</p>${c.tags&&c.tags.length?`<ul class="tags">${c.tags.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:''}</div>${c.image?`<figure class="mock"><div class="mock-bar"><i></i><i></i><i></i></div><img src="${e(c.image)}" alt="${e(c.alt||'')}" width="1200" height="750"></figure>`:''}</article>`).join('')}</div></div></section>`; };
const resumeBtn = p.resume&&p.resume.file ? `<a class="btn" href="${e(p.resume.file)}" download>${e(p.resume.label)}</a>` : `<button class="btn" type="button" data-print hidden>${e((p.resume&&p.resume.label)||'Download Resume')}</button>`;
const ld = {"@context":"https://schema.org","@type":"Person",name:p.name,url,sameAs:[p.linkedin],address:{"@type":"PostalAddress",addressLocality:"Pune",addressRegion:"Maharashtra",addressCountry:"IN"},alumniOf:[{"@type":"CollegeOrUniversity",name:"MIT World Peace University"},{"@type":"EducationalOrganization",name:"DES's Institute of Management Development and Research"}]};
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(p.site.title)}</title><meta name="description" content="${e(p.site.description)}">
<link rel="canonical" href="${e(url)}/"><meta name="theme-color" content="#F7F7F5">
<meta property="og:type" content="website"><meta property="og:title" content="${e(p.site.title)}"><meta property="og:description" content="${e(p.site.description)}"><meta property="og:url" content="${e(url)}/">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="style.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('pin')</script></head>
<body><a class="skip" href="#main">Skip to content</a><div id="progress" aria-hidden="true"></div>
<header class="top"><div class="wrap bar"><a class="brand" href="#top">${e(p.name.split(' ')[0])}</a>
<button class="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Toggle menu">Menu</button>
<nav id="nav" aria-label="Primary"><ul>${secs.map(([k,l])=>`<li><a href="#${k}">${l}</a></li>`).join('')}</ul></nav></div></header>
<main id="main"><section id="top" class="hero wrap"><div class="hero-copy">
<p class="eyebrow">${e(h.eyebrow)}</p><h1>${e(h.greeting)}</h1>
<p class="display">${h.lines.map(l=>l.replace(/<(?!\/?em>)[^>]*>/g,'')).join('<br>')}</p>
<p class="lead">${e(h.intro)}</p>
<p class="edu-hl"><strong>${e(h.highlight)}</strong><span>${e(h.highlight2)}</span></p>
<p class="strengths">${h.strengths.map(e).join(' · ')}</p>
<div class="actions">${first?`<a class="btn primary" href="#${first[0]}">Explore My Journey</a>`:''}<a class="btn" href="${LI}" ${ext}>Connect on LinkedIn ↗</a>${resumeBtn}</div></div>${h.image?`<figure class="hero-img"><img src="${e(h.image)}" alt="${e(h.imageAlt||'')}" width="1200" height="1000"></figure>`:''}</section>
${secs.some(([k])=>k==='story')?S.story():''}<div class="wrap">${secs.filter(([k])=>k!=='story').map(([k])=>S[k]()).join('')}</div></main>
<footer class="wrap foot"><p>${e(p.footer)}</p></footer><script src="main.js" defer></script></body></html>`;
fs.rmSync('dist',{recursive:true,force:true}); fs.mkdirSync('dist');
fs.writeFileSync('dist/index.html', html);
for (const f of ['style.css','main.js']) fs.copyFileSync(path.join('src',f), path.join('dist',f));
if(fs.existsSync('assets'))fs.cpSync('assets','dist/assets',{recursive:true});
fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n`);
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}/</loc></url></urlset>\n`);
console.log('Built dist/ with sections:', secs.map(s=>s[0]).join(', '));
