// Ponto de entrada: descobre em qual página está e liga cada parte do site.
import { SITE } from './config.js';
import { linkWhatsApp, validarConfig } from './lib.js';
import { movimentoReduzido, iniciarMenu, iniciarDigitacao, iniciarRevelar } from './efeitos.js';

const raiz = document.documentElement;
const pagina = raiz.dataset.pagina;
const reduzido = movimentoReduzido();

raiz.classList.add('js');

const erros = validarConfig(SITE);
if (erros.length) console.warn('Revise o config.js:\n' + erros.join('\n'));

const whatsapp = linkWhatsApp(SITE.whatsapp, SITE.mensagens[pagina]);
document.querySelectorAll('a[data-whatsapp]').forEach((a) => {
  a.href = whatsapp;
  a.target = '_blank';
  a.rel = 'noopener';
});

document.querySelectorAll('[data-rede]').forEach((el) => {
  const link = SITE.redes[el.dataset.rede];
  if (link) el.href = link;
  else el.hidden = true;
});

iniciarMenu();
iniciarRevelar(reduzido);
document.querySelectorAll('[data-digitar]').forEach((el) => {
  iniciarDigitacao(el, JSON.parse(el.dataset.digitar), reduzido);
});
