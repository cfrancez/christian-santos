// Ponto de entrada: descobre em qual página está e liga cada parte do site.
import { SITE } from './config.js';
import { linkWhatsApp, validarConfig, itensDaPagina, textoLancamentos } from './lib.js';
import { movimentoReduzido, iniciarMenu, iniciarDigitacao, iniciarRevelar } from './efeitos.js';
import { iniciarCapa, iniciarReel } from './reel.js';
import { montarMosaico, observarLoops } from './portfolio.js';

const raiz = document.documentElement;
const pagina = raiz.dataset.pagina;
const base = raiz.dataset.base;
const reduzido = movimentoReduzido();

// Cada parte roda isolada: um erro no config.js não pode esconder o resto da página.
function etapa(nome, fazer) {
  try {
    fazer();
  } catch (erro) {
    console.error(`Falha em "${nome}". Revise o config.js.`, erro);
  }
}

// Menu e animações de entrada primeiro: não dependem do config.
raiz.classList.add('js');
etapa('menu', iniciarMenu);
etapa('animações de entrada', () => iniciarRevelar(reduzido));
etapa('texto da capa', () => {
  document.querySelectorAll('[data-digitar]').forEach((el) => {
    iniciarDigitacao(el, JSON.parse(el.dataset.digitar), reduzido);
  });
});

etapa('conferência do config', () => {
  const erros = validarConfig(SITE);
  if (erros.length) console.warn('Revise o config.js:\n' + erros.join('\n'));
});

etapa('WhatsApp', () => {
  const whatsapp = linkWhatsApp(SITE.whatsapp, SITE.mensagens?.[pagina] ?? SITE.mensagens?.inicio);
  document.querySelectorAll('a[data-whatsapp]').forEach((a) => {
    a.href = whatsapp;
    a.target = '_blank';
    a.rel = 'noopener';
  });
});

etapa('redes sociais', () => {
  document.querySelectorAll('[data-rede]').forEach((el) => {
    const link = SITE.redes?.[el.dataset.rede];
    if (link) el.href = link;
    else el.hidden = true;
  });
});

etapa('lançamentos', () => {
  document.querySelectorAll('[data-lancamentos]').forEach((el) => {
    const texto = textoLancamentos(SITE.lancamentos);
    if (texto) el.querySelector('strong').textContent = texto;
    else el.hidden = true;
  });
});

etapa('reel', () => {
  const reel = SITE.reels?.[pagina] ?? null;
  iniciarCapa(reel, base, reduzido);
  iniciarReel(reel, base);
});

etapa('portfólio', () => {
  montarMosaico(
    document.querySelector('[data-mosaico]'),
    itensDaPagina(SITE.portfolio ?? [], pagina, SITE.categorias ?? {}),
    SITE.categorias ?? {},
    base,
    pagina !== 'inicio',
  );
  observarLoops(reduzido);
});
