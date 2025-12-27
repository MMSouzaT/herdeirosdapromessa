# Área de Membros - Herdeiros da Promessa

Sistema completo de área de membros com autenticação, pagamentos e distribuição de e-books.

## 📁 Estrutura do Projeto

```
/backend                    # Código do servidor
  ├── firebase-config.js    # Configuração do Firebase
  ├── auth.js              # Sistema de autenticação
  ├── products.js          # Gerenciamento de produtos e e-books
  └── payment.js           # Integração com pagamentos

/membros                    # Páginas da área de membros
  ├── login.html           # Página de login
  ├── cadastro.html        # Página de cadastro
  ├── recuperar-senha.html # Recuperação de senha
  ├── dashboard.html       # Dashboard do usuário
  ├── leitor.html          # Leitor de e-books
  └── styles.css           # Estilos da área de membros
```

## 🚀 Configuração Inicial

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga os passos para criar seu projeto
4. Ative os seguintes serviços:
   - **Authentication** (Email/Senha)
   - **Firestore Database**
   - **Storage**

### 2. Obter Credenciais do Firebase

1. No Firebase Console, vá em **Configurações do Projeto**
2. Role até "Seus aplicativos"
3. Clique no ícone da web `</>`
4. Copie as credenciais fornecidas
5. Cole no arquivo `/backend/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 3. Configurar Firestore Database

1. No Firebase Console, vá em **Firestore Database**
2. Crie as seguintes coleções:

#### Coleção: `users`
```javascript
{
  name: "Nome do Usuário",
  email: "email@exemplo.com",
  createdAt: timestamp,
  hasAccess: false,
  products: []
}
```

#### Coleção: `products`
```javascript
{
  name: "Nome do Produto",
  description: "Descrição do produto",
  price: 49.90,
  active: true,
  createdAt: timestamp
}
```

#### Subcoleção: `products/{productId}/ebooks`
```javascript
{
  title: "Título do E-book",
  description: "Descrição",
  filePath: "ebooks/meu-ebook.pdf",
  fileName: "meu-ebook.pdf",
  coverImage: "url_da_capa",
  order: 1,
  createdAt: timestamp
}
```

#### Coleção: `purchases`
```javascript
{
  userId: "user_id",
  productId: "product_id",
  purchaseDate: timestamp,
  paymentInfo: {},
  status: "completed"
}
```

#### Coleção: `payments`
```javascript
{
  userId: "user_id",
  productId: "product_id",
  amount: 49.90,
  status: "approved",
  gateway: "mercadopago",
  gatewayPaymentId: "12345",
  createdAt: timestamp
}
```

### 4. Configurar Storage

1. No Firebase Console, vá em **Storage**
2. Crie a estrutura de pastas:
   ```
   /ebooks
     /produto-1
       ebook1.pdf
       ebook2.pdf
     /produto-2
       ebook3.pdf
   ```

3. Configure as regras de segurança em **Rules**:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /ebooks/{productId}/{fileName} {
      allow read: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.products.hasAny([productId]);
    }
  }
}
```

### 5. Configurar Gateway de Pagamento

#### Opção A: Mercado Pago

1. Crie conta em [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Obtenha suas credenciais em **Credenciais**
3. Adicione no `/backend/payment.js`:
```javascript
mercadoPago: {
  publicKey: 'SUA_PUBLIC_KEY',
  accessToken: 'SEU_ACCESS_TOKEN'
}
```

#### Opção B: Stripe

1. Crie conta em [Stripe](https://stripe.com)
2. Obtenha suas chaves em **Developers > API keys**
3. Adicione no `/backend/payment.js`

### 6. Regras de Segurança do Firestore

Configure em **Firestore > Regras**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler apenas seus próprios dados
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Apenas via admin ou Cloud Functions
    }
    
    // Produtos são públicos para leitura
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
      
      // E-books do produto
      match /ebooks/{ebookId} {
        allow read: if request.auth != null;
        allow write: if false;
      }
    }
    
    // Compras são privadas
    match /purchases/{purchaseId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow write: if false;
    }
  }
}
```

## 📝 Como Usar

### Fluxo do Usuário

1. **Cadastro**: Usuário cria conta em `/membros/cadastro.html`
2. **Compra**: Usuário escolhe produto e realiza pagamento
3. **Acesso Liberado**: Após confirmação do pagamento, acesso é liberado
4. **Login**: Usuário faz login em `/membros/login.html`
5. **Dashboard**: Acessa e-books em `/membros/dashboard.html`
6. **Leitura**: Lê ou baixa e-books

### Adicionar Produtos (Manualmente)

Via Firebase Console:

1. Acesse **Firestore Database**
2. Crie documento em `products`:
   ```javascript
   {
     name: "Coleção de Histórias Bíblicas",
     description: "10 e-books ilustrados",
     price: 49.90,
     active: true
   }
   ```

3. Adicione e-books na subcoleção `ebooks`:
   ```javascript
   {
     title: "História de Noé",
     description: "A arca de Noé ilustrada",
     filePath: "ebooks/produto-1/noe.pdf",
     fileName: "historia-de-noe.pdf",
     coverImage: "url_da_imagem",
     order: 1
   }
   ```

4. Faça upload dos PDFs no **Storage** seguindo o `filePath`

### Liberar Acesso Manualmente

Via Firebase Console:

1. Acesse **Firestore Database**
2. Encontre o documento do usuário em `users/{userId}`
3. Edite:
   ```javascript
   {
     hasAccess: true,
     products: ["id_do_produto"]
   }
   ```

## 🔧 Funções Administrativas

Para automatizar processos, você pode criar Cloud Functions:

### Exemplo: Webhook Mercado Pago

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.mercadopagoWebhook = functions.https.onRequest(async (req, res) => {
  const payment = req.body;
  
  if (payment.type === 'payment' && payment.data.status === 'approved') {
    // Buscar informações do pagamento
    // Liberar acesso ao usuário
    // Enviar email de confirmação
  }
  
  res.status(200).send('OK');
});
```

## 🎨 Personalização

### Modificar Cores

Edite `/membros/styles.css`:

```css
:root {
    --primary-color: #4a90e2;      /* Cor principal */
    --secondary-color: #50c878;     /* Cor secundária */
    --danger-color: #e74c3c;        /* Cor de alerta */
}
```

### Adicionar Logo

Adicione ao header em cada página HTML:

```html
<div class="header-content">
    <img src="../logo.png" alt="Logo" class="logo">
    <h1>Minha Área</h1>
</div>
```

## 📧 Emails Automatizados

Configure email templates no Firebase:

1. Vá em **Authentication > Templates**
2. Personalize os templates:
   - Verificação de email
   - Redefinição de senha
   - Mudança de email

## 🔒 Segurança

- ✅ Autenticação via Firebase
- ✅ Senhas criptografadas
- ✅ Acesso controlado por usuário
- ✅ URLs de download temporárias
- ✅ Validação no servidor

## 🌐 Deploy

### Opção 1: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Opção 2: GitHub Pages

1. Faça commit dos arquivos
2. Vá em Settings > Pages
3. Selecione a branch main
4. Site publicado!

## 💰 Custos Estimados

### Firebase (Plano Spark - Gratuito)
- 10GB de armazenamento
- 50.000 leituras/dia
- 20.000 escritas/dia
- Suficiente para começar!

### Mercado Pago
- Taxa por transação: ~4.99% + R$ 0,49

## 🆘 Suporte

### Problemas Comuns

**Erro: Firebase not defined**
- Verifique se os scripts do Firebase estão carregando

**Erro: Permission denied**
- Verifique as regras de segurança no Firestore e Storage

**E-books não carregam**
- Verifique se os arquivos estão no Storage
- Verifique o caminho `filePath` no Firestore

## 📚 Recursos

- [Documentação Firebase](https://firebase.google.com/docs)
- [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)

## 🚀 Próximos Passos

1. Configure suas credenciais do Firebase
2. Adicione seus produtos no Firestore
3. Faça upload dos e-books no Storage
4. Configure o gateway de pagamento
5. Teste o fluxo completo
6. Faça o deploy!

---

**Desenvolvido para Herdeiros da Promessa**
