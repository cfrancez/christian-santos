// ============================================================================
//  CONFIGURAÇÃO DO SITE — este é o único arquivo que você precisa editar.
// ============================================================================
//
//  • WhatsApp: DDI + DDD + número, só dígitos (ex.: 5511986174142).
//  • Mensagens: o texto que já aparece escrito quando a pessoa abre o WhatsApp.
//  • Redes: cole o link completo; deixe '' para esconder o ícone.
//  • lancamentos: número de lançamentos que você fez (ex.: 15). Deixe null para esconder.
//  • reels: o vídeo principal de cada página. Use null enquanto não houver reel.
//      video/poster  → reel completo (MP4 1080p, até 25 MB) e a imagem de capa dele
//      loop/loopPoster → trecho de ~10 s, mudo, que roda no fundo da capa
//  • portfolio: cada linha é uma peça do mosaico.
//      peca('nome-do-arquivo', 'Marca', 'Título', 'categoria', 'formato', paginas)  → loop em vídeo (.mp4 + .jpg)
//      imagem('nome-do-arquivo', 'Marca', 'Título', 'categoria', paginas)           → imagem parada (.jpg)
//      categoria → uma das chaves de `categorias` abaixo
//      formato   → 'vertical' (9:16), 'horizontal' (16:9 ou 4:3) ou 'largo' (painéis 2:1)
//      paginas   → onde a peça aparece: 'inicio', 'video', 'marketing', 'sites'
//      No fim da linha, opcional:
//        { youtube: 'https://youtu.be/...' } → o clique abre o vídeo completo num popup
//        { link: 'https://...' }             → o clique abre o site numa nova aba
//      Peça com youtube ou link e sem a imagem .jpg? Rode `npm run capas` que eu baixo/tiro a imagem.
//
//  FICHA PARA EXPORTAR UM LOOP NOVO (Premiere / Media Encoder):
//      MP4 H.264, de 3 a 5 segundos, SEM áudio, maior lado até 720 px, até 1 MB.
//      Salve o vídeo e uma imagem .jpg (o primeiro quadro) em assets/media/portfolio/
//      com o mesmo nome, e acrescente uma linha na lista `portfolio`.
// ============================================================================

const reelVideo = { video: 'assets/media/reels/video.mp4', poster: 'assets/media/reels/video.jpg' };

const peca = (slug, marca, titulo, categoria, formato, paginas, extra = {}) => ({
  arquivo: `assets/media/portfolio/${slug}.mp4`,
  poster: `assets/media/portfolio/${slug}.jpg`,
  titulo,
  marca,
  categoria,
  formato,
  paginas,
  ...extra,
});

const imagem = (slug, marca, titulo, categoria, paginas, extra = {}) => ({
  arquivo: `assets/media/portfolio/${slug}.jpg`,
  poster: `assets/media/portfolio/${slug}.jpg`,
  titulo,
  marca,
  categoria,
  formato: 'horizontal',
  paginas,
  ...extra,
});

const DESTAQUE = ['inicio', 'video'];
const VIDEO = ['video'];
const SITES = ['sites'];

export const SITE = {
  nome: 'Christian Santos',
  whatsapp: '5511986174142',

  mensagens: {
    inicio: 'Olá, Christian! Vi seu site e quero conversar sobre um projeto.',
    video: 'Olá, Christian! Vim pela página de Vídeo e quero um orçamento.',
    marketing: 'Olá, Christian! Vim pela página de Marketing e quero conversar sobre uma estratégia.',
    sites: 'Olá, Christian! Vim pela página de Sites e quero um orçamento.',
  },

  redes: {
    instagram: '',
    youtube: '',
    linkedin: '',
  },

  lancamentos: null,

  categorias: {
    publicidade: 'Publicidade',
    cursos: 'Cursos e educação',
    podcasts: 'Podcasts e YouTube',
    musica: 'Música e eventos',
    redes: 'Redes sociais',
    campanhas: 'Campanhas',
    sites: 'Sites',
  },

  reels: {
    inicio: { ...reelVideo, loop: 'assets/media/capa/inicio.mp4', loopPoster: 'assets/media/capa/inicio.jpg' },
    video: { ...reelVideo, loop: 'assets/media/capa/video.mp4', loopPoster: 'assets/media/capa/video.jpg' },
    marketing: null,
    sites: null,
  },

  portfolio: [
    peca('mackenzie-1', 'Mackenzie', 'Vestibular Mackenzie', 'publicidade', 'vertical', DESTAQUE),
    peca('mcdonalds-tasty-turbo', "McDonald's", 'Novo Tasty Turbo', 'publicidade', 'horizontal', DESTAQUE),
    peca('visit-brasil-praia', 'Visit Brasil', 'Praias do Brasil', 'publicidade', 'vertical', DESTAQUE),
    peca('cielo-oktoberfest', 'Cielo', 'Oktoberfest Blumenau', 'publicidade', 'largo', DESTAQUE),
    peca('mcdonalds-sobremesas-vertical', "McDonald's", 'Sobremesas', 'publicidade', 'vertical', DESTAQUE),
    peca('swift-pascoa', 'Swift', 'Páscoa', 'publicidade', 'horizontal', DESTAQUE),
    peca('visit-brasil-mar', 'Visit Brasil', 'Fundo do mar', 'publicidade', 'vertical', DESTAQUE),
    peca('surf-tira-onda', 'Surf', 'Tira onda', 'publicidade', 'horizontal', DESTAQUE),
    peca('mackenzie-2', 'Mackenzie', 'Vestibular Mackenzie', 'publicidade', 'vertical', VIDEO),
    peca('itaipava', 'Itaipava', 'Ita-pra você', 'publicidade', 'largo', VIDEO),
    peca('mcdonalds-queijolicia', "McDonald's", 'Queijolícia no Drive', 'publicidade', 'horizontal', VIDEO),
    peca('visit-brasil-mergulho', 'Visit Brasil', 'Mergulho', 'publicidade', 'horizontal', VIDEO),
    peca('mcdonalds-novo-tasty', "McDonald's", 'Novo Tasty', 'publicidade', 'horizontal', VIDEO),
    peca('mcdonalds-sobremesas-painel', "McDonald's", 'Sobremesas', 'publicidade', 'largo', VIDEO),
    peca('mackenzie-3', 'Mackenzie', 'Vestibular Mackenzie', 'publicidade', 'vertical', VIDEO),
    peca('visit-brasil-bike', 'Visit Brasil', 'Rio de bike', 'publicidade', 'horizontal', VIDEO),
    peca('mcdonalds-mclanche-feliz', "McDonald's", 'McLanche Feliz', 'publicidade', 'horizontal', VIDEO),
    peca('evento-medicina', '', 'Evento presencial de medicina', 'cursos', 'horizontal', VIDEO,
      { youtube: 'https://youtu.be/__btxAotJFo' }),
    peca('plataforma-medicina', '', 'Plataforma de estudos de medicina', 'cursos', 'horizontal', VIDEO,
      { youtube: 'https://youtu.be/1Nv1-VnqdII' }),
    imagem('maura-versiculos', 'Maura de Albanesi', 'Vídeo para YouTube', 'cursos', VIDEO,
      { youtube: 'https://www.youtube.com/watch?v=5sqMaQjUvmg' }),
    imagem('maura-curso', 'Maura de Albanesi', 'Aula de curso', 'cursos', VIDEO,
      { youtube: 'https://www.youtube.com/watch?v=m9sTa2QY7bk&t=2s' }),
    imagem('curso-medicina', '', 'Curso de residência médica', 'cursos', VIDEO,
      { youtube: 'https://www.youtube.com/watch?v=9_4xiktpBIk' }),
    imagem('live-masterclass', '', 'Live de masterclass', 'cursos', VIDEO,
      { youtube: 'https://www.youtube.com/live/EdpR1-Yi2LY?si=PNPXiJtfawrmwvzP&t=656' }),
    imagem('podcast-ep42', '', 'Podcast em estúdio · episódio 42', 'podcasts', VIDEO,
      { youtube: 'https://www.youtube.com/watch?v=6hngHlod2sc' }),
    imagem('podcast-ep23', '', 'Podcast em estúdio · episódio 23', 'podcasts', VIDEO,
      { youtube: 'https://www.youtube.com/watch?v=Brj-nrmlaG0' }),
    imagem('react-trailer', '', 'React de trailer', 'podcasts', VIDEO,
      { youtube: 'https://www.youtube.com/watch?v=cJiEpqu16JI' }),
    imagem('react-analise', '', 'Vídeo de análise', 'podcasts', VIDEO,
      { youtube: 'https://www.youtube.com/watch?v=uBNpi7phyT4' }),

    imagem('site-learnup', 'Learnup', 'Site institucional', 'sites', SITES,
      { link: 'https://learnup.com.br/' }),
    imagem('site-learnup-visual-editor', 'Learnup', 'Página de vendas · Visual Editor Pro', 'sites', SITES,
      { link: 'https://learnup.com.br/visual-editor-pro-v2/' }),
    imagem('site-abracam-formacao', 'ABRACAM', 'Formação em Câmbio', 'sites', SITES,
      { link: 'https://abracam.com/educacional/formacao-em-cambio-abracam/' }),
    imagem('site-abracam-cambio-em-dia', 'ABRACAM', 'Câmbio em Dia', 'sites', SITES,
      { link: 'https://abracam.com/cambio-em-dia/' }),
    imagem('site-anatomy-facial', 'Anatomy Facial', 'Site institucional', 'sites', SITES,
      { link: 'https://www.anatomyfacial.com.br/' }),
    imagem('site-orlando-vidros', 'Orlando Vidros', 'Site institucional', 'sites', SITES,
      { link: 'https://orlandovidros.com.br/' }),
    imagem('este-site', 'Christian Santos', 'Este site', 'sites', SITES),
  ],
};
