// Draft legal content (D-23): drafted from standard templates, clearly marked as
// draft-for-review. NOT legally binding until confirmed by counsel before launch.
// Operating entity: Abstract Tomorrow Unip. Lda (Q-07).

export type LegalDoc = "privacy" | "terms" | "cookies";
export const LEGAL_DOCS: LegalDoc[] = ["privacy", "terms", "cookies"];

export interface LegalSection {
  heading: string;
  body: string[];
}

type Content = Record<LegalDoc, Record<"en" | "pt", LegalSection[]>>;

const CONTACT_EN =
  "You can contact us about this policy at henriquesantana@loftz.net.";
const CONTACT_PT =
  "Pode contactar-nos sobre esta política através de henriquesantana@loftz.net.";

export const LEGAL_CONTENT: Content = {
  privacy: {
    en: [
      { heading: "Who we are", body: ["LOFTZ is a brand of Abstract Tomorrow Unip. Lda, the data controller for personal data collected through loftz.net."] },
      { heading: "What we collect", body: ["When you send a booking or visit request we collect the details you provide: name, email, phone (optional), nationality, date of birth, occupation, gender and your requested dates.", "We also collect basic, anonymised analytics about how the site is used — only after you consent to analytics cookies."] },
      { heading: "Why we use it", body: ["To respond to and manage your booking or visit request, to confirm availability, to comply with legal obligations relating to tenancy, and — with consent — to understand and improve the website."] },
      { heading: "Legal basis", body: ["We process request data on the basis of steps taken at your request prior to entering a contract, and our legitimate interest in operating the business. Analytics are processed only with your consent."] },
      { heading: "Sharing", body: ["We do not sell your data. We share it only with service providers who help us operate (for example, our email and hosting providers) under appropriate safeguards."] },
      { heading: "Retention", body: ["We keep request data only as long as necessary for the purposes above and to meet legal requirements, then delete it."] },
      { heading: "Your rights", body: ["Under the GDPR you may request access to, correction or deletion of your data, object to or restrict processing, and lodge a complaint with the Portuguese data protection authority (CNPD).", CONTACT_EN] },
    ],
    pt: [
      { heading: "Quem somos", body: ["A LOFTZ é uma marca da Abstract Tomorrow Unip. Lda, responsável pelo tratamento dos dados pessoais recolhidos através de loftz.net."] },
      { heading: "O que recolhemos", body: ["Quando envia um pedido de reserva ou visita, recolhemos os dados que fornece: nome, email, telefone (opcional), nacionalidade, data de nascimento, ocupação, género e as datas pretendidas.", "Recolhemos também estatísticas anónimas sobre a utilização do site — apenas depois de consentir os cookies de análise."] },
      { heading: "Porque os utilizamos", body: ["Para responder e gerir o seu pedido de reserva ou visita, confirmar disponibilidade, cumprir obrigações legais relativas ao arrendamento e — com consentimento — compreender e melhorar o website."] },
      { heading: "Fundamento legal", body: ["Tratamos os dados do pedido com base em diligências pré-contratuais efetuadas a seu pedido e no nosso interesse legítimo em operar o negócio. As estatísticas são tratadas apenas com o seu consentimento."] },
      { heading: "Partilha", body: ["Não vendemos os seus dados. Partilhamo-los apenas com prestadores de serviços que nos ajudam a operar (por exemplo, fornecedores de email e alojamento), com as devidas garantias."] },
      { heading: "Conservação", body: ["Conservamos os dados do pedido apenas pelo tempo necessário para as finalidades acima e para cumprir requisitos legais, eliminando-os depois."] },
      { heading: "Os seus direitos", body: ["Ao abrigo do RGPD pode solicitar acesso, retificação ou eliminação dos seus dados, opor-se ou limitar o tratamento e apresentar reclamação à CNPD.", CONTACT_PT] },
    ],
  },
  terms: {
    en: [
      { heading: "Overview", body: ["These terms govern your use of loftz.net. By using the site you agree to them."] },
      { heading: "Requests, not bookings", body: ["Submitting a booking or visit request does not create a tenancy or a confirmed reservation. A booking is only confirmed once we contact you and a contract is signed."] },
      { heading: "Room information", body: ["We take care to keep room details, prices and availability accurate, but they may change. Prices are per month and, where stated, all-inclusive of the services described."] },
      { heading: "Tenancy contract", body: ["Any tenancy is governed by the signed contract between you and Abstract Tomorrow Unip. Lda, which prevails over information on this website."] },
      { heading: "Acceptable use", body: ["You agree not to misuse the site, submit false information, or attempt to disrupt its operation."] },
      { heading: "Liability", body: ["The site is provided \"as is\". To the extent permitted by law, we are not liable for indirect or incidental damages arising from its use."] },
      { heading: "Governing law", body: ["These terms are governed by Portuguese law. Consumer disputes may be submitted to alternative dispute resolution and to the electronic complaints book (Livro de Reclamações)."] },
    ],
    pt: [
      { heading: "Enquadramento", body: ["Estes termos regem a utilização de loftz.net. Ao utilizar o site, aceita-os."] },
      { heading: "Pedidos, não reservas", body: ["O envio de um pedido de reserva ou visita não cria um arrendamento nem uma reserva confirmada. A reserva só é confirmada depois de o contactarmos e de ser assinado um contrato."] },
      { heading: "Informação dos quartos", body: ["Procuramos manter os detalhes, preços e disponibilidade dos quartos rigorosos, mas podem alterar-se. Os preços são mensais e, quando indicado, incluem os serviços descritos."] },
      { heading: "Contrato de arrendamento", body: ["Qualquer arrendamento rege-se pelo contrato assinado entre si e a Abstract Tomorrow Unip. Lda, que prevalece sobre a informação deste website."] },
      { heading: "Utilização aceitável", body: ["Aceita não fazer uso indevido do site, não submeter informação falsa e não tentar perturbar o seu funcionamento."] },
      { heading: "Responsabilidade", body: ["O site é fornecido \"tal como está\". Na medida permitida por lei, não somos responsáveis por danos indiretos ou acidentais decorrentes da sua utilização."] },
      { heading: "Lei aplicável", body: ["Estes termos regem-se pela lei portuguesa. Litígios de consumo podem ser submetidos a resolução alternativa e ao Livro de Reclamações eletrónico."] },
    ],
  },
  cookies: {
    en: [
      { heading: "What cookies we use", body: ["Essential cookies make the site work and are always on. Analytics cookies (Google Analytics 4) help us measure traffic and improve the site — these load only after you accept them."] },
      { heading: "Consent", body: ["When you first visit, we ask for your consent. No analytics or advertising cookies are set until you accept. You can change your choice at any time by clearing this site's data in your browser."] },
      { heading: "Managing cookies", body: ["You can block or delete cookies through your browser settings. Blocking essential cookies may affect how the site works."] },
      { heading: "Contact", body: [CONTACT_EN] },
    ],
    pt: [
      { heading: "Que cookies utilizamos", body: ["Os cookies essenciais fazem o site funcionar e estão sempre ativos. Os cookies de análise (Google Analytics 4) ajudam-nos a medir o tráfego e a melhorar o site — só são carregados depois de os aceitar."] },
      { heading: "Consentimento", body: ["Na primeira visita pedimos o seu consentimento. Não são ativados cookies de análise ou publicidade até que aceite. Pode alterar a sua escolha a qualquer momento limpando os dados deste site no navegador."] },
      { heading: "Gerir cookies", body: ["Pode bloquear ou eliminar cookies nas definições do navegador. Bloquear cookies essenciais pode afetar o funcionamento do site."] },
      { heading: "Contacto", body: [CONTACT_PT] },
    ],
  },
};
