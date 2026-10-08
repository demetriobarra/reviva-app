// ReViva — livro da Day. Para desligar a vitrine, mude "ativo" para false.
window.RV_LIVRO = {
  ativo: true,
  titulo: 'Depois daquela carta',
  subtitulo: 'O poder de uma carta e a fidelidade de um Deus que responde',
  autora: 'Dayane Martins',
  capa: '/livro/capa.jpg',
  sinopse: 'Um testemunho de fé, amor e recomeço. Uma história real que revela o quanto Deus está presente nos detalhes, transformando dores em propósitos e cartas em respostas vivas. Entre lágrimas e milagres, Dayane nos conduz por uma jornada de entrega e reconstrução, mostrando que nenhuma perda é o fim quando Deus é o começo de tudo.',
  preco: 'R$ 52,90',
  trecho: [],          // degustação: um item por parágrafo (aguardando o texto autorizado pela Day)
  frases: [],          // frases curtas do livro para o "Trecho do dia" (aguardando)
  cupom: 'REVIVA25',   // precisa ser criado na loja da Day (WooCommerce) com 25% de desconto
  desconto: '25% de desconto',
  links: {
    fisico: 'https://www.dayanemartinss.com.br/produto/depois-daquela-carta/',
    digital: ''        // a loja da Day ainda não vende e-book
  },
  // No iPhone, vender o e-book por link exige autorização da Apple (regras do Brasil).
  digitalNoApp: false
};
