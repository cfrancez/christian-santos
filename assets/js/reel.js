// Vídeo principal da página: o loop mudo da capa e o reel completo (no popup ou na seção #reel).
import { caminho } from './lib.js';

export function iniciarCapa(reel, base, reduzido) {
  const video = document.querySelector('video.capa-video');

  if (!reel) {
    video?.remove();
    document.querySelectorAll('[data-abrir-reel]').forEach((el) => { el.hidden = true; });
    const secao = document.getElementById('reel');
    if (secao) secao.hidden = true;
    return;
  }
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  video.poster = caminho(base, reel.loopPoster);
  if (reduzido) return;

  video.src = caminho(base, reel.loop);
  video.play().catch(() => {});
}

export function iniciarReel(reel, base) {
  const video = document.querySelector('video[data-reel]');
  if (!reel || !video) return;

  // preload="none": o arquivo só é baixado no primeiro play, para não pesar a página.
  video.preload = 'none';
  video.poster = caminho(base, reel.poster);
  video.src = caminho(base, reel.video);
  const popup = video.closest('dialog');
  const tocar = () => video.play().catch(() => {});

  document.querySelectorAll('[data-abrir-reel]').forEach((botao) => {
    botao.addEventListener('click', (evento) => {
      if (popup) {
        popup.showModal();
      } else {
        evento.preventDefault();
        document.getElementById('reel')?.scrollIntoView({ block: 'center' });
      }
      tocar();
    });
  });

  if (!popup) return;
  // Pausa antes de fechar: o evento 'close' é assíncrono e o áudio seguiria por um instante.
  const fechar = () => {
    video.pause();
    popup.close();
  };
  popup.addEventListener('cancel', () => video.pause());
  popup.addEventListener('close', () => video.pause());
  popup.addEventListener('click', (evento) => {
    if (evento.target === popup) fechar();
  });
  popup.querySelector('[data-fechar-reel]')?.addEventListener('click', fechar);
}
