# 📊 Google Analytics - Herdeiros da Promessa

## ✅ Implementação Concluída

O Google Analytics 4 foi implementado em todas as páginas do site. O código de rastreamento está centralizado em `/pagina/js/analytics.js` e é carregado automaticamente em todas as páginas.

---

## 🚀 Como Ativar o Google Analytics

### Passo 1: Criar conta no Google Analytics

1. Acesse: [analytics.google.com](https://analytics.google.com)
2. Clique em **"Começar a medir"** ou **"Criar conta"**
3. Preencha os dados:
   - Nome da conta: **Herdeiros da Promessa**
   - Nome da propriedade: **Site Herdeiros da Promessa**
   - Fuso horário: **Brasil (GMT-3)**
   - Moeda: **Real brasileiro (BRL)**

### Passo 2: Configurar propriedade

1. Selecione **"Web"** como plataforma
2. Configure o stream de dados:
   - URL do site: `https://herdeirosdapromessa.com.br` (ou seu domínio)
   - Nome do stream: **Site Principal**

### Passo 3: Obter o ID de Medição

1. Após criar a propriedade, você verá uma tela com instruções
2. Copie o **ID de Medição** (formato: `G-XXXXXXXXXX`)
3. Exemplo: `G-ABC123DEF4`

### Passo 4: Adicionar o ID no código

1. Abra o arquivo: `/pagina/js/analytics.js`
2. Na linha 5, substitua `'G-XXXXXXXXXX'` pelo seu ID real:

```javascript
const GA_MEASUREMENT_ID = 'G-ABC123DEF4'; // ⚠️ Substitua pelo seu ID
```

3. Salve o arquivo

### Passo 5: Testar se está funcionando

1. Publique o site com as alterações
2. Acesse seu site em um navegador
3. No Google Analytics, vá em **Relatórios → Tempo real**
4. Você deve ver sua visita sendo registrada em até 30 segundos

---

## 📈 O que está sendo rastreado?

### 🎯 Eventos Automáticos

O código implementado rastreia automaticamente:

#### 1. **Visualizações de Página**
- Toda vez que alguém acessa uma página do site

#### 2. **Cliques em Links Externos**
- Rastreia quando alguém clica em links que saem do seu site
- Útil para saber quantas pessoas clicam em links de compra, redes sociais, etc.

#### 3. **Downloads de PDF**
- Rastreia quando alguém baixa ou abre um PDF
- Importante para medir interesse nos materiais

#### 4. **Profundidade de Rolagem (Scroll Depth)**
- Mede até onde as pessoas rolam a página
- Registra quando atingem 25%, 50%, 75% e 100% da página
- Mostra se o conteúdo é interessante

#### 5. **Tempo na Página**
- Calcula quanto tempo cada visitante passa em cada página

---

## 📊 Relatórios Disponíveis no Google Analytics

### 1. Tempo Real
- Veja quem está no site **agora**
- Quais páginas estão sendo visitadas
- De onde os visitantes vêm

### 2. Aquisição de Usuários
- **Como** as pessoas encontram seu site:
  - Busca orgânica (Google, Bing)
  - Direto (digitaram o endereço)
  - Redes sociais
  - Referências (outros sites)

### 3. Engajamento
- Páginas mais visitadas
- Tempo médio na página
- Taxa de rejeição
- Eventos disparados

### 4. Dados Demográficos
- Idade dos visitantes
- Gênero
- Localização (país, estado, cidade)
- Idioma

### 5. Tecnologia
- Dispositivos (Desktop, Mobile, Tablet)
- Navegadores (Chrome, Safari, Firefox)
- Sistema Operacional (Windows, Android, iOS)

### 6. Conversões
- Rastreie objetivos específicos:
  - Compras realizadas
  - Formulários preenchidos
  - Downloads completados

---

## 🎨 Eventos Personalizados que Você Pode Adicionar

Se quiser rastrear ações específicas, você pode adicionar eventos personalizados no código. Exemplos:

### Rastrear Cliques em Botões Específicos

```javascript
document.querySelector('#botao-comprar').addEventListener('click', function() {
  gtag('event', 'click_botao_comprar', {
    'event_category': 'conversao',
    'event_label': 'Botão Comprar - Header',
    'value': 1
  });
});
```

### Rastrear Reprodução de Vídeo

```javascript
document.querySelector('video').addEventListener('play', function() {
  gtag('event', 'video_play', {
    'event_category': 'engagement',
    'event_label': 'Vídeo Apresentação',
  });
});
```

### Rastrear Envio de Formulário

```javascript
document.querySelector('form').addEventListener('submit', function() {
  gtag('event', 'form_submit', {
    'event_category': 'conversao',
    'event_label': 'Formulário de Contato',
  });
});
```

---

## 🔒 Privacidade e LGPD

O código já está configurado para ser compatível com a LGPD (Lei Geral de Proteção de Dados):

- ✅ **Anonimização de IP** ativada
- ✅ Não coleta dados pessoais identificáveis
- ✅ Respeita configurações de "Não Rastrear" do navegador

### Adicionar Aviso de Cookies (Recomendado)

Para total conformidade com a LGPD, considere adicionar um banner de consentimento de cookies. Opções:

1. **Cookie Consent by Osano** (gratuito)
2. **CookieYes** (gratuito para sites pequenos)
3. **Termly** (gratuito com branding)

---

## 🛠️ Solução de Problemas

### O Analytics não está registrando visitas?

**Verifique:**

1. ✅ O ID de Medição está correto no arquivo `analytics.js`?
2. ✅ O arquivo `analytics.js` está sendo carregado? (verifique no Console do navegador)
3. ✅ Você está testando com cache limpo? (Ctrl+Shift+R)
4. ✅ Há algum bloqueador de anúncios ativo? (desative para testar)
5. ✅ O site está publicado? (não funciona localmente sem configuração adicional)

### Como testar localmente?

O Google Analytics normalmente não funciona em `localhost`. Para testar:

```bash
# Opção 1: Usar um servidor local com domínio
# Adicione no /etc/hosts:
127.0.0.1 herdeirosdapromessa.local

# Opção 2: Usar Live Server do VS Code com configuração
```

### Erros no Console

Se aparecer erro no console do navegador:

- Verifique se o caminho do script está correto
- Certifique-se de que o arquivo `analytics.js` existe
- Limpe o cache do navegador

---

## 📚 Recursos Úteis

- [Documentação oficial do GA4](https://support.google.com/analytics/answer/9304153)
- [Academia do Google Analytics](https://analytics.google.com/analytics/academy/)
- [Guia de eventos do GA4](https://support.google.com/analytics/answer/9322688)
- [Como criar conversões](https://support.google.com/analytics/answer/9267568)

---

## 📞 Suporte

Se tiver dúvidas sobre a implementação:

1. Verifique este documento
2. Consulte a documentação oficial do Google Analytics
3. Teste os eventos no **modo Tempo Real** do GA4

---

**🎉 Pronto! Seu site agora está preparado para coletar dados de navegação assim que você adicionar o ID de Medição do Google Analytics.**
