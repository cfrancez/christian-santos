// Mosaico do portfólio: monta as peças, os filtros e toca cada loop só quando ele está na tela.
import { caminho, ehVideo, categoriasPresentes, embedDoYoutube } from './lib.js';

function icone(id) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icone');
  const uso = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  uso.setAttribute('href', `#${id}`);
  svg.append(uso);
  return svg;
}

// Popup único para os vídeos do YouTube, criado no primeiro clique.
let popupYoutube;

function criarPopupYoutube() {
  const popup = document.createElement('dialog');
  popup.className = 'reel-popup youtube-popup';
  popup.setAttribute('aria-label', 'Vídeo do portfólio');
  const caixa = document.createElement('div');
  caixa.className = 'reel-caixa';
  const fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.className = 'reel-fechar';
  fechar.dataset.fecharVideo = '';
  fechar.setAttribute('aria-label', 'Fechar vídeo');
  fechar.append(icone('i-fechar'));
  const moldura = document.createElement('div');
  moldura.className = 'youtube-moldura';
  caixa.append(fechar, moldura);
  popup.append(caixa);
  document.body.append(popup);

  // Tirar o player é o que faz o som parar; acontece antes de o popup fechar.
  const tirarPlayer = () => moldura.replaceChildren();
  const fecharPopup = () => {
    tirarPlayer();
    popup.close();
  };
  popup.addEventListener('cancel', tirarPlayer);
  popup.addEventListener('close', tirarPlayer);
  popup.addEventListener('click', (evento) => {
    if (evento.target === popup) fecharPopup();
  });
  fechar.addEventListener('click', fecharPopup);
  return popup;
}

function abrirYoutube(link, titulo) {
  popupYoutube ??= criarPopupYoutube();
  const player = document.createElement('iframe');
  player.src = embedDoYoutube(link);
  player.title = titulo;
  player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  player.allowFullscreen = true;
  popupYoutube.querySelector('.youtube-moldura').replaceChildren(player);
  popupYoutube.showModal();
}

// Camada clicável sobre a peça: abre o vídeo no popup ou o site numa nova aba.
function criarAbertura(item) {
  const selo = document.createElement('span');
  selo.className = 'peca-selo';
  if (item.youtube) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'peca-abrir';
    botao.setAttribute('aria-label', `Assistir: ${item.titulo}`);
    botao.addEventListener('click', () => abrirYoutube(item.youtube, item.titulo));
    selo.append(icone('i-play'));
    botao.append(selo);
    return botao;
  }
  const link = document.createElement('a');
  link.className = 'peca-abrir peca-abrir--site';
  link.href = item.link;
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', `Abrir site: ${item.titulo}${item.marca ? ` (${item.marca})` : ''}`);
  selo.append(icone('i-seta'));
  link.append(selo);
  return link;
}

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
  if (item.youtube || item.link) {
    figura.classList.add('peca--clicavel');
    figura.append(criarAbertura(item));
  }
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
  // As peças entram antes do que já estiver no HTML (ex.: o card final de chamada).
  container.prepend(...pecas);

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
