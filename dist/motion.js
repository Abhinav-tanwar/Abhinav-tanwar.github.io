/* Orbital signal study: a small, dependency-free canvas scene. */
(() => {
  'use strict';
  const canvas = document.querySelector('#signal-field');
  const button = document.querySelector('#motion-toggle');
  const progress = document.querySelector('.reading-progress');
  if (!canvas || !button) return;
  const context = canvas.getContext('2d');
  if (!context) { button.hidden = true; return; }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let frame = 0, width = 1, height = 1, time = 0, last = 0;
  let pointerX = 0, pointerY = 0, visible = true;
  const points = Array.from({length: 144}, (_, i) => {
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    const y = 1 - 2 * (i + .5) / 144;
    const radius = Math.sqrt(1 - y * y);
    return {x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius};
  });
  const edges = [];
  for(let i=0;i<points.length;i++) for(let j=i+1;j<points.length;j++) {
    const p=points[i],q=points[j];
    const distance=(p.x-q.x)**2+(p.y-q.y)**2+(p.z-q.z)**2;
    if(distance<=.15)edges.push([i,j,distance]);
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width, height) * .34;
    const rotation = time * .12 + pointerX * .12;
    const tilt = -.23 + pointerY * .08;
    const projected = points.map(point => {
      const x = point.x * Math.cos(rotation) + point.z * Math.sin(rotation);
      const z = point.z * Math.cos(rotation) - point.x * Math.sin(rotation);
      const y = point.y * Math.cos(tilt) - z * Math.sin(tilt);
      const depth = z * Math.cos(tilt) + point.y * Math.sin(tilt);
      const perspective = 2.7 / (2.7 - depth * .35);
      return {x: width / 2 + x * scale * perspective,
        y: height / 2 + y * scale * perspective, depth};
    });
    for(const [i,j,distance] of edges){
      const a=projected[i],b=projected[j];
      const alpha=(.04+(a.depth+b.depth+2)*.035)*(1-distance/.2);
      context.strokeStyle=`rgba(224,181,114,${alpha})`;context.lineWidth=.65;
      context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();
    }
    for (let i = 0; i < projected.length; i++) {
      const a = projected[i];
      const pulse = .6 + .4 * Math.sin(time * .8 + i * .7);
      context.fillStyle = `rgba(238,201,142,${.25 + (a.depth + 1) * .28})`;
      context.beginPath();context.arc(a.x,a.y,(a.depth+2)*.7 + pulse*.25,0,Math.PI*2);context.fill();
    }
    // Elliptical paths give the point cloud a clear orbital silhouette.
    for (let orbit = 0; orbit < 3; orbit++) {
      context.save(); context.translate(width/2,height/2);
      context.rotate(orbit * Math.PI/3 + time * .025);
      context.strokeStyle = 'rgba(230,183,117,.22)';context.lineWidth = .8;
      context.beginPath();context.ellipse(0,0,scale*1.25,scale*.46,0,0,Math.PI*2);context.stroke();
      const phase = time * (.18 + orbit*.035) + orbit*2;
      const x = Math.cos(phase)*scale*1.25, y = Math.sin(phase)*scale*.46;
      context.fillStyle = '#e6b775';context.beginPath();context.arc(x,y,2.7,0,Math.PI*2);context.fill();context.restore();
    }
  }
  function tick(now) {
    frame = 0;
    if (paused || document.hidden || !visible) { last = 0; return; }
    if (last) time += Math.min((now-last)/1000,.05);
    last=now; draw();frame=requestAnimationFrame(tick);
  }
  function start() { if (!frame && !paused && !document.hidden && visible) frame=requestAnimationFrame(tick); }
  function stop() { cancelAnimationFrame(frame);frame=0;last=0; }
  function sync() {
    document.documentElement.classList.toggle('motion-paused',paused);
    button.setAttribute('aria-pressed', String(!paused));
    button.textContent = paused ? 'Play motion ↗' : 'Pause motion Ⅱ';
    stop();draw();start();
  }
  function resize() {
    const bounds=canvas.getBoundingClientRect();width=bounds.width;height=bounds.height;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    context.setTransform(ratio,0,0,ratio,0,0);draw();
  }
  new ResizeObserver(resize).observe(canvas);
  button.addEventListener('click',()=>{paused=!paused;sync();});
  reduced.addEventListener('change',event=>{paused=event.matches;sync();});
  document.addEventListener('visibilitychange',()=>{stop();start();});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;stop();start();},{rootMargin:'100px'}).observe(canvas);
    const reveal = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}
    }),{threshold:.08});
    function observeReveals(){document.querySelectorAll('.project:not(.reveal-ready),.job:not(.reveal-ready),.about-grid:not(.reveal-ready),.toolkit:not(.reveal-ready)').forEach(element=>{
      if(!paused){element.classList.add('reveal-ready');reveal.observe(element);}
    });}
    observeReveals();document.addEventListener('projects-rendered',observeReveals);
  }
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.querySelector('.hero').addEventListener('pointermove',event=>{
      const bounds=canvas.getBoundingClientRect();
      pointerX=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
      pointerY=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
    },{passive:true});
  }
  function updateProgress(){const range=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${range>0?scrollY/range:0})`;}
  addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress,{passive:true});
  resize();sync();updateProgress();
})();
