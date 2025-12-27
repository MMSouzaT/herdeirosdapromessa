# Guia Rápido de Início

## 🚀 Começando em 5 Passos

### 1. Configure o Firebase (15 minutos)

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
4. Copie as credenciais e cole em `backend/firebase-config.js`

### 2. Configure as Regras de Segurança

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
    }
    match /products/{productId} {
      allow read: if true;
      match /ebooks/{ebookId} {
        allow read: if request.auth != null;
      }
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /ebooks/{allPaths=**} {
      allow read: if request.auth != null;
    }
  }
}
```

### 3. Adicione Produtos de Teste

1. Abra `membros/dashboard.html` no navegador
2. Abra o Console (F12)
3. Cole e execute:

```javascript
// Criar produto de teste
firebase.firestore().collection('products').add({
  name: "E-book de Teste",
  description: "Produto para teste do sistema",
  price: 29.90,
  active: true,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
}).then(docRef => {
  console.log("Produto criado com ID:", docRef.id);
  
  // Adicionar e-book ao produto
  firebase.firestore()
    .collection('products')
    .doc(docRef.id)
    .collection('ebooks')
    .add({
      title: "Meu Primeiro E-book",
      description: "E-book de teste",
      filePath: "ebooks/teste.pdf",
      fileName: "teste.pdf",
      order: 1,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
});
```

### 4. Faça Upload de um PDF de Teste

1. No Firebase Console, vá em **Storage**
2. Crie a pasta `ebooks/`
3. Faça upload de um PDF qualquer como `teste.pdf`

### 5. Libere Acesso para Teste

Após criar uma conta no site:

```javascript
// Substitua pelo seu email
const meuEmail = "seu@email.com";
const produtoId = "ID_DO_PRODUTO_CRIADO";

firebase.firestore()
  .collection('users')
  .where('email', '==', meuEmail)
  .get()
  .then(snapshot => {
    const userId = snapshot.docs[0].id;
    
    firebase.firestore().collection('users').doc(userId).update({
      hasAccess: true,
      products: [produtoId]
    });
    
    console.log("Acesso liberado!");
  });
```

## 📁 Estrutura de Arquivos

```
/backend/
  ├── firebase-config.js  ← Configure suas credenciais aqui
  ├── auth.js            ← Sistema de login/cadastro
  ├── products.js        ← Gerenciamento de e-books
  ├── payment.js         ← Integração com pagamentos
  └── admin.js           ← Funções administrativas

/membros/
  ├── login.html         ← Página de login
  ├── cadastro.html      ← Página de cadastro
  ├── dashboard.html     ← Área do usuário
  ├── leitor.html        ← Visualizador de PDF
  └── checkout.html      ← Página de pagamento
```

## 🔧 Integração com Mercado Pago (Opcional)

### Conta Teste

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Use as credenciais de teste para desenvolvimento
4. Cole em `backend/payment.js`:

```javascript
mercadoPago: {
  publicKey: 'TEST-...',
  accessToken: 'TEST-...'
}
```

### Webhook (Produção)

Para receber notificações de pagamento, você precisará:
1. Ter um servidor (pode usar Firebase Functions)
2. Configurar URL do webhook no Mercado Pago
3. Processar automaticamente após pagamento aprovado

## 💡 Dicas Importantes

### Para Desenvolvimento
- Use as credenciais de **TESTE** do gateway
- Teste com emails diferentes
- Limpe o cache se algo não funcionar

### Para Produção
- Troque para credenciais de **PRODUÇÃO**
- Configure domínio personalizado
- Ative SSL/HTTPS obrigatoriamente
- Configure backup do Firestore

## 🎯 Fluxo Completo

```
1. Usuário acessa o site
   ↓
2. Clica em "Comprar Produto"
   ↓
3. Faz cadastro (se novo usuário)
   ↓
4. Preenche dados de pagamento
   ↓
5. Gateway processa pagamento
   ↓
6. Webhook notifica aprovação
   ↓
7. Sistema libera acesso automaticamente
   ↓
8. Usuário recebe email
   ↓
9. Faz login e acessa e-books
```

## 📧 Configurar Emails

1. No Firebase Console: **Authentication > Templates**
2. Personalize:
   - Email de verificação
   - Recuperação de senha
   - Mudança de email

## 🆘 Problemas Comuns

### "Firebase not defined"
- Verifique se os scripts estão carregando
- Veja o Network tab do DevTools

### "Permission denied"
- Verifique as regras do Firestore
- Usuário precisa estar autenticado

### E-books não aparecem
- Verifique se o produto tem e-books cadastrados
- Verifique se o usuário tem o produto liberado

### PDF não carrega
- Verifique se o arquivo existe no Storage
- Verifique o caminho `filePath` no Firestore
- Teste a URL diretamente

## 📊 Monitoramento

### Firebase Console
- **Authentication**: Ver usuários cadastrados
- **Firestore**: Ver dados em tempo real
- **Storage**: Ver arquivos e uso
- **Analytics**: Ver acessos (ative se quiser)

### Logs úteis
Abra o Console (F12) para ver:
- Erros de autenticação
- Problemas de carregamento
- Status das operações

## 🚀 Deploy

### GitHub Pages (Gratuito)
```bash
git add .
git commit -m "Área de membros completa"
git push
```

Ative em: Settings > Pages > Source: main branch

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 💰 Custos

### Plano Gratuito Firebase
- ✅ 10GB armazenamento
- ✅ 50.000 leituras/dia
- ✅ 20.000 escritas/dia
- ✅ Suficiente para começar

### Quando crescer
- Upgrade para Blaze (pague pelo uso)
- ~R$ 20-50/mês para 100-500 usuários

## 🎓 Próximos Passos

1. ✅ Configure Firebase (este guia)
2. 📧 Configure emails personalizados
3. 💳 Integre gateway de pagamento real
4. 🎨 Personalize o design
5. 📱 Teste em dispositivos móveis
6. 🚀 Faça o deploy
7. 📈 Monitore e ajuste

## 📚 Recursos Úteis

- [Documentação Firebase](https://firebase.google.com/docs)
- [Mercado Pago API](https://www.mercadopago.com.br/developers/pt/docs)
- [Comunidade Firebase](https://firebase.community)

---

**Precisa de ajuda?** Verifique o arquivo `backend/README.md` para documentação completa.
