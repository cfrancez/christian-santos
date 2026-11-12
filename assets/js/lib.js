// Funções puras do site: não mexem na página, por isso são testadas no Node.

export const PAGINAS = ['inicio', 'video', 'marketing', 'sites'];
export const FORMATOS = ['vertical', 'horizontal', 'largo'];
const CAMPOS_REEL = ['video', 'poster', 'loop', 'loopPoster'];

const preenchido = (valor) => typeof valor === 'string' && valor.trim() !== '';
const ehObjeto = (valor) => typeof valor === 'object' && valor !== null;

// Caminho de arquivo do próprio site: relativo, sem barra no início e sem barra invertida.
const caminhoLocal = (valor) => preenchido(valor) && !valor.startsWith('/') && !valor.includes('\\');

export function linkWhatsApp(numero, mensagem) {
  const digitos = String(numero).replace(/\D/g, '');
  const link = `https://wa.me/${digitos}`;
  return preenchido(mensagem) ? `${link}?text=${encodeURIComponent(mensagem)}` : link;
}

export function caminho(base, relativo) {
  return `${base}${relativo}`;
}

export function ehVideo(arquivo) {
  return /\.(mp4|webm)$/i.test(arquivo);
}

// "656", "2s" ou "1m30s" → segundos.
function segundos(tempo) {
  if (!tempo) return 0;
  if (/^\d+$/.test(tempo)) return Number(tempo);
  const partes = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(tempo);
  return partes ? Number(partes[1] ?? 0) * 3600 + Number(partes[2] ?? 0) * 60 + Number(partes[3] ?? 0) : 0;
}

// Link do YouTube (youtu.be, watch, live, shorts) → endereço do player sem cookies, ou null.
export function embedDoYoutube(link) {
  let url;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m)\./, '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.slice(1);
  else if (host === 'youtube.com') {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)/)?.[1] ?? null;
  }
  if (!id || !/^[\w-]{6,}$/.test(id)) return null;
  const inicio = segundos(url.searchParams.get('t') ?? url.searchParams.get('start'));
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${inicio ? `&start=${inicio}` : ''}`;
}

function problemasDoItem(item, categorias) {
  if (!ehObjeto(item)) return ['não é uma peça; confira vírgulas e chaves'];
  const problemas = [];
  for (const campo of ['arquivo', 'poster']) {
    if (!preenchido(item[campo])) problemas.push(`${campo} vazio`);
    else if (!caminhoLocal(item[campo])) {
      problemas.push(`${campo} '${item[campo]}': escreva sem barra no início e com / (ex.: assets/media/portfolio/peca.mp4)`);
    }
  }
  if (!preenchido(item.titulo)) problemas.push('titulo vazio');
  if (typeof item.marca !== 'string') problemas.push("marca: use '' quando não houver");
  const validas = Object.keys(ehObjeto(categorias) ? categorias : {});
  if (!validas.includes(item.categoria)) {
    problemas.push(`categoria '${item.categoria}' não existe; use: ${validas.join(', ')}`);
  }
  if (!FORMATOS.includes(item.formato)) {
    problemas.push(`formato '${item.formato}' não existe; use: ${FORMATOS.join(', ')}`);
  }
  if (!Array.isArray(item.paginas) || !item.paginas.length || !item.paginas.every((p) => PAGINAS.includes(p))) {
    problemas.push(`paginas: use uma ou mais de: ${PAGINAS.join(', ')}`);
  }
  if (item.youtube !== undefined && embedDoYoutube(item.youtube) === null) {
    problemas.push(`youtube '${item.youtube}': cole o link do vídeo (ex.: https://youtu.be/...)`);
  }
  if (item.link !== undefined && !/^https:\/\//.test(item.link)) {
    problemas.push(`link '${item.link}': cole o endereço completo, começando com https://`);
  }
  return problemas;
}

export function itemValido(item, categorias) {
  return problemasDoItem(item, categorias).length === 0;
}

export function itensDaPagina(portfolio, pagina, categorias) {
  return portfolio.filter((item) => itemValido(item, categorias) && item.paginas.includes(pagina));
}

export function categoriasPresentes(itens, categorias) {
  return Object.keys(categorias).filter((chave) => itens.some((item) => item.categoria === chave));
}

export function textoLancamentos(n) {
  return Number.isInteger(n) && n > 0 ? `+${n} lançamentos` : null;
}

export function validarConfig(site) {
  const erros = [];
  const digitos = String(site.whatsapp ?? '').replace(/\D/g, '');
  if (digitos.length < 12 || digitos.length > 13) {
    erros.push('whatsapp: use DDI + DDD + número, ex.: 5511986174142');
  }
  for (const pagina of PAGINAS) {
    if (!preenchido(site.mensagens?.[pagina])) erros.push(`mensagens.${pagina}: mensagem vazia ou faltando`);
    const reel = site.reels?.[pagina];
    if (reel !== null && !(ehObjeto(reel) && CAMPOS_REEL.every((k) => caminhoLocal(reel[k])))) {
      erros.push(`reels.${pagina}: use null ou preencha video, poster, loop e loopPoster (caminhos sem barra no início)`);
    }
  }
  for (const [rede, link] of Object.entries(site.redes ?? {})) {
    if (link !== '' && !/^https:\/\//.test(link)) erros.push(`redes.${rede}: cole o link completo, começando com https://`);
  }
  if (!ehObjeto(site.categorias)) erros.push('categorias: a lista de categorias sumiu do config');
  const portfolio = Array.isArray(site.portfolio) ? site.portfolio : [];
  portfolio.forEach((item, i) => {
    const problemas = problemasDoItem(item, site.categorias);
    if (problemas.length) erros.push(`portfolio[${i}] (${item?.titulo ?? 'sem título'}): ${problemas.join('; ')}`);
  });
  if (site.lancamentos != null && textoLancamentos(site.lancamentos) === null) {
    erros.push('lancamentos: use null ou um número inteiro maior que 0');
  }
  return erros;
}
