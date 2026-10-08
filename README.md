# ReViva: Jardim de Superação

App de acolhimento no luto. Este repositório tem o **site (PWA)** e o **app iOS** (via Capacitor).

## Estrutura
- Arquivos na raiz (`index.html`, `privacidade.html` etc.) = o site publicado em appreviva.online (Vercel).
- `native.js` = recursos que só funcionam dentro do app: lembretes gentis, salvamento seguro no aparelho e vibração leve.
- `fonts/` = fontes Fraunces e Karla embutidas (o app funciona offline).
- `assets/` = ícone (1024 px) e tela de abertura do app.
- `scripts/ios-setup.sh` = monta o projeto iOS (usado pelo Codemagic).
- `codemagic.yaml` = compila na nuvem e envia para o TestFlight / App Store Connect.

## Gerar um build iOS (sem Mac)
1. No Codemagic, conecte este repositório.
2. Em Team settings → Integrations → App Store Connect, adicione a chave de API com o nome **ReViva ASC**.
3. Em Code signing identities, gere ou importe um certificado de distribuição para `online.appreviva.app`.
4. Clique em **Start new build** → workflow **ReViva iOS (App Store)**.
