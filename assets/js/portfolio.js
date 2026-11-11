// Mosaico do portfólio: monta as peças, os filtros e toca cada loop só quando ele está na tela.
import { caminho, ehVideo, categoriasPresentes } from './lib.js';

function criarMidia(item, base) {
  if (!ehVideo(item.arquivo)) {
    const img = document.createElement('img');
    img.src = caminho(base, item.arquivo);
    img.alt = item.titulo;
    img.loading = 'lazy';
    return img;
  }
  const video = document.createElement('video');
  video.className = 'peca-video';
  // Mudo + inline são obrigatórios para o loop tocar sozinho no iPhone.
  for (const atributo of ['muted', 'loop', 'playsinline']) video.setAttribute(atributo, '');
  video.muted = true;
  video.preload = 'none';
  video.poster = caminho(base, item.poster);
  video.dataset.src = caminho(base, item.arquivo);
  video.setAttribute('aria-hidden', 'true');
  return video;
}

function criarPeca(item, categorias, base) {
  const figura = document.createElement('figure');
  figura.className = `peca peca--${item.formato}`;
  figura.dataset.categoria = item.categoria;

  const legenda = document.createElement('figcaption');
  const nome = document.createElement('strong');
  nome.textContent = item.marca || item.titulo;
  const detalhe = document.createElement('span');
  detalhe.textContent = item.marca ? `${item.titulo} · ${categorias[item.categoria]}` : categorias[item.categoria];
  legenda.append(nome, detalhe);

  figura.append(criarMidia(item, base), legenda);
  return figura;
}

function criarFiltros(presentes, categorias, pecas) {
  const barra = document.createElement('div');
  barra.className = 'filtros';
  barra.setAttribute('role', 'group');
  barra.setAttribute('aria-label', 'Filtrar portfólio');

  const botoes = [['todos', 'Todos'], ...presentes.map((c) => [c, categorias[c]])].map(([chave, nome]) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = nome;
    botao.dataset.filtro = chave;
    botao.setAttribute('aria-pressed', String(chave === 'todos'));
    return botao;
  });

  barra.addEventListener('click', (evento) => {
    const escolhido = evento.target.closest('button');
    if (!escolhido) return;
    botoes.forEach((b) => b.setAttribute('aria-pressed', String(b === escolhido)));
    const filtro = escolhido.dataset.filtro;
    pecas.forEach((p) => { p.hidden = filtro !== 'todos' && p.dataset.categoria !== filtro; });
  });

  barra.append(...botoes);
  return barra;
}

export function montarMosaico(container, itens, categorias, base, filtros) {
  if (!container) return;
  if (!itens.length) {
    const secao = container.closest('section');
    if (secao) secao.hidden = true;
    return;
  }
  const pecas = itens.map((item) => criarPeca(item, categorias, base));
  container.append(...pecas);

  const presentes = categoriasPresentes(itens, categorias);
  if (filtros && presentes.length > 1) container.before(criarFiltros(presentes, categorias, pecas));
}

export function observarLoops(reduzido) {
  if (reduzido || !('IntersectionObserver' in window)) return;
  const observador = new IntersectionObserver((entradas) => {
    for (const { target: video, isIntersecting } of entradas) {
      if (isIntersecting) {
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, { threshold: 0.25 });
  document.querySelectorAll('video.peca-video').forEach((v) => observador.observe(v));
}
