// Efeitos visuais: menu do celular, texto que se escreve e seções que aparecem ao rolar.

export function movimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function iniciarMenu() {
  const topo = document.querySelector('header.topo');
  const botao = topo?.querySelector('.menu-botao');
  if (!botao) return;

  const definir = (aberto) => {
    topo.classList.toggle('topo--aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    document.body.classList.toggle('sem-rolagem', aberto);
  };

  botao.addEventListener('click', () => definir(botao.getAttribute('aria-expanded') !== 'true'));
  topo.querySelectorAll('nav a').forEach((a) => a.addEventListener('click', () => definir(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && definir(false));

  const marcarRolagem = () => topo.classList.toggle('topo--rolado', window.scrollY > 24);
  window.addEventListener('scroll', marcarRolagem, { passive: true });
  marcarRolagem();
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export function iniciarDigitacao(el, frases, reduzido) {
  el.textContent = frases[0];
  if (reduzido || frases.length < 2) return;

  (async () => {
    for (let i = 0; ; i = (i + 1) % frases.length) {
      await espera(1600);
      for (let n = frases[i].length; n >= 0; n--) {
        el.textContent = frases[i].slice(0, n);
        await espera(35);
      }
      const proxima = frases[(i + 1) % frases.length];
      for (let n = 1; n <= proxima.length; n++) {
        el.textContent = proxima.slice(0, n);
        await espera(70);
      }
    }
  })();
}

export function iniciarRevelar(reduzido) {
  const elementos = document.querySelectorAll('.revelar');
  if (reduzido || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('visivel'));
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  elementos.forEach((el) => observador.observe(el));
}
