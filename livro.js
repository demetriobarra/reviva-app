// ReViva — livro da Day. Preencha os campos e mude "ativo" para true para mostrar no app.
window.RV_LIVRO = {
  ativo: false,
  titulo: 'Depois daquela carta',
  autora: 'Day Martins',
  capa: '',            // ex.: '/livro/capa.jpg' (imagem enviada para a pasta livro/)
  sinopse: '',         // 2 a 4 linhas sobre o livro
  trecho: [],          // degustação: um item por parágrafo, ex.: ['Primeiro parágrafo...', 'Segundo...']
  frases: [],          // frases curtas do livro para o "Trecho do dia"
  cupom: '',           // cupom de desconto para quem usa o ReViva, ex.: 'REVIVA15'
  desconto: '',        // como aparece para a pessoa, ex.: '15% de desconto'
  links: {
    fisico: '',        // link de compra do livro físico
    digital: ''        // link de compra do e-book
  },
  // No iPhone, vender o e-book por link exige autorização da Apple (regras do Brasil).
  // Deixe false até a Apple liberar; o botão do e-book continua aparecendo no site.
  digitalNoApp: false
};
