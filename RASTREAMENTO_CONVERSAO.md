# 📊 Rastreamento de Conversão - Herdeiros da Promessa

## ✅ O Que Está Sendo Rastreado

### 1. **Visualizações da Página "Adquira Já"**
- Toda vez que alguém acessa `/pagina/adquira_ja.html`
- Métrica automática do Google Analytics
- **Onde ver**: Google Analytics → Relatórios → Páginas e telas

### 2. **Cliques no Botão de Compra** 🎯 **(PRINCIPAL MÉTRICA)**
Dois eventos são registrados quando alguém clica no botão de compra:

#### Evento 1: `purchase_click`
- **Categoria**: conversao
- **Label**: Botao de Compra - Cakto
- **Valor**: 19.90 BRL
- **Informações extras**:
  - Texto do botão clicado
  - URL da página onde ocorreu o clique

#### Evento 2: `begin_checkout` 
- Evento padrão do Google Analytics para e-commerce
- Registra o início do processo de checkout
- **Valor**: 19.90 BRL
- **Item**: Colecao Herdeiros da Promessa

## 📈 Como Visualizar os Dados no Google Analytics

### **Método 1: Relatório de Eventos (Recomendado)**
1. Acesse [Google Analytics](https://analytics.google.com/)
2. Selecione sua propriedade (Herdeiros da Promessa)
3. Vá em: **Relatórios** → **Engajamento** → **Eventos**
4. Procure pelo evento: `purchase_click`
5. Clique no evento para ver detalhes como:
   - Número de cliques
   - Taxa de conversão (cliques/visualizações)
   - Informações por página

### **Método 2: Exploração Personalizada**
1. Vá em: **Explorar** (menu lateral)
2. Crie uma nova exploração
3. Configure:
   - **Dimensões**: Nome da página, Nome do evento
   - **Métricas**: Contagem de eventos
   - **Filtros**: Nome do evento = "purchase_click"

### **Método 3: Visualização em Tempo Real**
1. Vá em: **Relatórios** → **Tempo real**
2. Role até "Eventos por nome do evento"
3. Veja cliques acontecendo ao vivo quando alguém clicar no botão

## 📊 Métricas Importantes para Acompanhar

### **Taxa de Conversão**
```
Taxa de Conversão = (Cliques no Botão ÷ Visualizações da Página) × 100
```

**Exemplo:**
- 100 pessoas acessaram a página
- 15 clicaram no botão de compra
- Taxa de conversão: 15%

### **Onde Monitorar:**
- **Visualizações da página**: Relatórios → Páginas e telas → buscar "adquira_ja"
- **Cliques no botão**: Relatórios → Eventos → buscar "purchase_click"

## 🎯 Criando um Painel Personalizado

Para facilitar o monitoramento diário, crie um painel:

1. Vá em **Biblioteca** → **Painéis** → **Criar painel**
2. Adicione os seguintes cartões:
   - **Visualizações de página** (filtrado por adquira_ja.html)
   - **Total de eventos purchase_click**
   - **Taxa de conversão** (calculada)
   - **Usuários ativos** na página adquira_ja
3. Salve e nomeie como "Funil de Conversão"

## 🔔 Configurando Alertas

Você pode criar alertas automáticos:

1. Acesse: **Administrador** → **Alertas personalizados**
2. Crie um alerta para:
   - "Quando taxa de conversão cair abaixo de X%"
   - "Quando houver mais de X cliques por dia"

## 📱 Outros Eventos Rastreados Automaticamente

Além do botão de compra, seu site já rastreia:

- ✅ **Links externos** - Quando alguém clica em links para fora do site
- ✅ **Downloads de PDF** - Quando arquivos PDF são baixados
- ✅ **Profundidade de scroll** - Quanto da página o usuário rolou (25%, 50%, 75%, 100%)
- ✅ **Tempo na página** - Quanto tempo cada visitante permanece

## 🔍 Exemplo de Análise

**Cenário:**
- Dia 1: 500 visualizações → 50 cliques = 10% conversão
- Dia 2: 500 visualizações → 75 cliques = 15% conversão ✅ **Melhorou!**

**O que pode ter influenciado:**
- Mudança no texto do botão
- Melhor posicionamento
- Tráfego mais qualificado
- Alterações na página

## ⚠️ Importante

- Os dados podem levar até 24-48 horas para aparecer completamente no Google Analytics
- Dados em tempo real aparecem instantaneamente, mas são limitados
- Para análises precisas, espere pelo menos 1 semana de dados

## 🆘 Suporte

Se tiver dúvidas sobre os dados:
1. Verifique se o Google Analytics está configurado corretamente (ID: G-7RYQMMDY9V)
2. Teste fazendo você mesmo um clique e verificando em Tempo Real
3. Consulte a documentação do Google Analytics 4

---

**Data de implementação**: 29 de Dezembro de 2025
**Status**: ✅ Ativo e funcionando
