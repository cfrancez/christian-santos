// Funções puras do site: não mexem na página, por isso são testadas no Node.

export const PAGINAS = ['inicio', 'video', 'marketing', 'sites'];
export const FORMATOS = ['vertical', 'horizontal', 'largo'];

const preenchido = (valor) => typeof valor === 'string' && valor.trim() !== '';

export function linkWhatsApp(numero, mensagem) {
  const digitos = String(numero).replace(/\D/g, '');
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

export function caminho(base, relativo) {
  return `${base}${relativo}`;
}

export function ehVideo(arquivo) {
  return /\.(mp4|webm)$/i.test(arquivo);
}

export function itemValido(item, categorias) {
  return (
    preenchido(item.arquivo) &&
    preenchido(item.poster) &&
    preenchido(item.titulo) &&
    typeof item.marca === 'string' &&
    Object.hasOwn(categorias, item.categoria) &&
    FORMATOS.includes(item.formato) &&
    Array.isArray(item.paginas) &&
    item.paginas.length > 0 &&
    item.paginas.every((p) => PAGINAS.includes(p))
  );
}

export function itensDaPagina(portfolio, pagina, categorias) {
  return portfolio.filter((item) => itemValido(item, categorias) && item.paginas.includes(pagina));
}

export function categoriasPresentes(itens, categorias) {
  return Object.keys(categorias).filter((chave) => itens.some((item) => item.categoria === chave));
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
    if (reel !== null && !(reel && ['video', 'poster', 'loop', 'loopPoster'].every((k) => preenchido(reel[k])))) {
      erros.push(`reels.${pagina}: use null ou preencha video, poster, loop e loopPoster`);
    }
  }
  (site.portfolio ?? []).forEach((item, i) => {
    if (!itemValido(item, site.categorias ?? {})) erros.push(`portfolio[${i}] (${item.titulo ?? 'sem título'}): item inválido`);
  });
  if (site.lancamentos !== null && !(Number.isInteger(site.lancamentos) && site.lancamentos > 0)) {
    erros.push('lancamentos: use null ou um número inteiro maior que 0');
  }
  return erros;
}
