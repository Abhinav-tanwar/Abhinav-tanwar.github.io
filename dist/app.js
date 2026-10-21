let projects = [];
const grid = document.querySelector('#projects');
const dialog = document.querySelector('#project-dialog');
let lastTrigger;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function githubLink(url, label) {
  if (!/^https:\/\/github\.com\//.test(url || '')) return null;
  const link = element('a', '', label); link.href = url; return link;
}
function metrics(items, className) {
  const list = element('dl', className);
  items.forEach(item => {
    const group = element('div');
    group.append(element('dt', '', item.label), element('dd', '', item.value));
    list.append(group);
  });
  return list;
}
function screenshot(project, expanded = false) {
  const figure = element('figure', expanded ? 'evidence-figure' : 'project-visual');
  const image = element('img'); image.src = project.image;
  image.alt = project.imageAlt || project.name; image.loading = 'lazy';
  image.width = 1512; image.height = 810;
  figure.append(image);
  if (expanded) {
    figure.append(element('figcaption', '', project.evidence.caption));
    if (/^assets\/[a-zA-Z0-9_./-]+\.png$/.test(project.image)) {
      const link = element('a', 'full-image', 'Open full-size screenshot ↗');
      link.href = project.image; link.target = '_blank'; link.rel = 'noopener'; figure.append(link);
    }
  }
  return figure;
}
function showProject(project, trigger) {
  lastTrigger = trigger;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-title').textContent = project.name;
  document.querySelector('#dialog-body').textContent = project.detail;
  document.querySelector('#dialog-stack').replaceChildren(...project.stack.map(tool => element('span', '', tool)));
  const content = document.querySelector('#dialog-evidence'); content.replaceChildren();
  if (project.evidence) {
    const evidence = project.evidence;
    content.append(metrics(evidence.metrics, 'evidence-metrics'));
    content.append(element('h3', '', 'Observed result'), element('p', '', evidence.result), screenshot(project, true));
    const method = element('details', 'method-details');
    method.append(element('summary', '', 'Method & limitations'), element('p', '', evidence.method), element('p', '', evidence.limit));
    content.append(method);
    const sources = element('div', 'evidence-sources'); sources.append(element('span', '', 'Inspect the evidence'));
    evidence.sources.forEach(source => { const link = githubLink(source.url, source.label + ' ↗'); if (link) sources.append(link); });
    content.append(sources);
  }
  const link = githubLink(project.repo, 'View repository ↗');
  document.querySelector('#dialog-link').replaceChildren(...(link ? [link] : []));
  dialog.showModal(); dialog.scrollTop = 0;
}
function render(filter = 'All') {
  grid.replaceChildren();
  const visible = projects.filter(project => filter === 'All' || project.category === filter);
  visible.forEach(project => {
    const article = element('article', 'project');
    const preview = project.image ? screenshot(project) : element('div', 'project-visual');
    const info = element('div', 'project-info');
    const button = element('button', '', '↗');
    button.setAttribute('aria-label', 'View results for ' + project.name);
    button.addEventListener('click', () => showProject(project, button));
    info.append(element('h3', '', project.name), button);
    const tags = element('div', 'tags'); project.stack.forEach(tool => tags.append(element('span', '', tool)));
    article.append(preview, element('span', 'project-category', project.category), info, element('p', '', project.description));
    if (project.evidence) article.append(metrics(project.evidence.metrics, 'project-metrics'));
    article.append(tags);
    const detail = element('button', 'results-link', 'Results & screenshots ↗');
    detail.setAttribute('aria-label', 'Explore evidence for ' + project.name);
    detail.addEventListener('click', () => showProject(project, detail));
    const actions = element('div', 'project-actions');
    actions.append(detail);
    const repository = githubLink(project.repo, 'GitHub ↗');
    if (repository) { repository.setAttribute('aria-label', 'View ' + project.name + ' on GitHub'); actions.append(repository); }
    article.append(actions); grid.append(article);
  });
  document.querySelector('#project-status').textContent = visible.length + ' projects shown';
  document.dispatchEvent(new Event('projects-rendered'));
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button));
  }); render(button.dataset.filter);
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => lastTrigger?.focus());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
fetch('projects.json?v=review-20261020', {cache: 'no-store'})
  .then(response => { if (!response.ok) throw Error('Project data unavailable'); return response.json(); })
  .then(data => { projects = data.filter(project => project.featured === true); render(); })
  .catch(() => { grid.textContent = 'Project details are temporarily unavailable. Explore my experience below or visit GitHub.'; });
