// Script de inicialização e teste para área de membros
// Execute este arquivo no console do Firebase para popular dados de teste

// ===========================
// PRODUTOS DE EXEMPLO
// ===========================

const productosExemplo = [
  {
    name: "Coleção Histórias Bíblicas",
    description: "10 histórias bíblicas ilustradas para crianças",
    price: 49.90,
    active: true
  },
  {
    name: "Kit Alfabetização Cristã",
    description: "Material completo para alfabetização com base bíblica",
    price: 79.90,
    active: true
  },
  {
    name: "Ilustrações Bíblicas Premium",
    description: "Coleção completa de ilustrações para ensino",
    price: 99.90,
    active: true
  }
];

// ===========================
// E-BOOKS DE EXEMPLO
// ===========================

const ebooksExemplo = {
  "historias-biblicas": [
    {
      title: "A História de Noé",
      description: "A arca de Noé e o dilúvio ilustrados",
      filePath: "ebooks/historias-biblicas/noe.pdf",
      fileName: "historia-de-noe.pdf",
      coverImage: "",
      order: 1
    },
    {
      title: "Davi e Golias",
      description: "A coragem de Davi contra o gigante",
      filePath: "ebooks/historias-biblicas/davi-golias.pdf",
      fileName: "davi-e-golias.pdf",
      coverImage: "",
      order: 2
    },
    {
      title: "Jonas e a Baleia",
      description: "A aventura de Jonas no mar",
      filePath: "ebooks/historias-biblicas/jonas.pdf",
      fileName: "jonas-e-a-baleia.pdf",
      coverImage: "",
      order: 3
    }
  ]
};

// ===========================
// FUNÇÕES DE INICIALIZAÇÃO
// ===========================

async function inicializarProdutos() {
  console.log('Iniciando criação de produtos...');
  
  for (const produto of productosExemplo) {
    try {
      const docRef = await firebase.firestore().collection('products').add({
        ...produto,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✓ Produto criado: ${produto.name} (ID: ${docRef.id})`);
      
      // Se for histórias bíblicas, adicionar e-books
      if (produto.name.includes('Histórias')) {
        await adicionarEbooks(docRef.id, ebooksExemplo["historias-biblicas"]);
      }
    } catch (error) {
      console.error(`✗ Erro ao criar produto ${produto.name}:`, error);
    }
  }
  
  console.log('Produtos criados com sucesso!');
}

async function adicionarEbooks(productId, ebooks) {
  console.log(`  Adicionando e-books ao produto ${productId}...`);
  
  for (const ebook of ebooks) {
    try {
      await firebase.firestore()
        .collection('products')
        .doc(productId)
        .collection('ebooks')
        .add({
          ...ebook,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      
      console.log(`  ✓ E-book adicionado: ${ebook.title}`);
    } catch (error) {
      console.error(`  ✗ Erro ao adicionar e-book ${ebook.title}:`, error);
    }
  }
}

// ===========================
// FUNÇÕES ADMINISTRATIVAS
// ===========================

async function liberarAcessoUsuario(userEmail, productId) {
  try {
    // Buscar usuário por email
    const usersSnapshot = await firebase.firestore()
      .collection('users')
      .where('email', '==', userEmail)
      .get();
    
    if (usersSnapshot.empty) {
      console.error('Usuário não encontrado');
      return;
    }
    
    const userId = usersSnapshot.docs[0].id;
    
    // Liberar acesso
    await firebase.firestore().collection('users').doc(userId).update({
      hasAccess: true,
      products: firebase.firestore.FieldValue.arrayUnion(productId),
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`✓ Acesso liberado para ${userEmail} ao produto ${productId}`);
  } catch (error) {
    console.error('Erro ao liberar acesso:', error);
  }
}

async function listarProdutos() {
  try {
    const snapshot = await firebase.firestore().collection('products').get();
    
    console.log('\n=== PRODUTOS CADASTRADOS ===\n');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Nome: ${data.name}`);
      console.log(`Preço: R$ ${data.price.toFixed(2)}`);
      console.log(`Ativo: ${data.active ? 'Sim' : 'Não'}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
  }
}

async function listarUsuarios() {
  try {
    const snapshot = await firebase.firestore().collection('users').get();
    
    console.log('\n=== USUÁRIOS CADASTRADOS ===\n');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Nome: ${data.name}`);
      console.log(`Email: ${data.email}`);
      console.log(`Tem Acesso: ${data.hasAccess ? 'Sim' : 'Não'}`);
      console.log(`Produtos: ${data.products ? data.products.length : 0}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  }
}

// ===========================
// TESTES
// ===========================

async function testarSistema() {
  console.log('=== INICIANDO TESTES DO SISTEMA ===\n');
  
  // 1. Testar conexão com Firebase
  console.log('1. Testando conexão com Firebase...');
  try {
    const testDoc = await firebase.firestore().collection('_test').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    await firebase.firestore().collection('_test').doc(testDoc.id).delete();
    console.log('✓ Conexão com Firebase OK\n');
  } catch (error) {
    console.error('✗ Erro na conexão:', error);
    return;
  }
  
  // 2. Verificar produtos
  console.log('2. Verificando produtos...');
  const productsSnapshot = await firebase.firestore().collection('products').get();
  console.log(`✓ ${productsSnapshot.size} produtos encontrados\n`);
  
  // 3. Verificar usuários
  console.log('3. Verificando usuários...');
  const usersSnapshot = await firebase.firestore().collection('users').get();
  console.log(`✓ ${usersSnapshot.size} usuários encontrados\n`);
  
  console.log('=== TESTES CONCLUÍDOS ===');
}

// ===========================
// EXPORTAR FUNÇÕES
// ===========================

if (typeof window !== 'undefined') {
  window.adminFunctions = {
    inicializarProdutos,
    liberarAcessoUsuario,
    listarProdutos,
    listarUsuarios,
    testarSistema
  };
  
  console.log(`
╔════════════════════════════════════════════════════════╗
║  FUNÇÕES ADMINISTRATIVAS CARREGADAS                    ║
╚════════════════════════════════════════════════════════╝

Use as seguintes funções no console:

  adminFunctions.inicializarProdutos()
    → Cria produtos de exemplo

  adminFunctions.listarProdutos()
    → Lista todos os produtos

  adminFunctions.listarUsuarios()
    → Lista todos os usuários

  adminFunctions.liberarAcessoUsuario(email, productId)
    → Libera acesso de um usuário a um produto

  adminFunctions.testarSistema()
    → Executa testes básicos do sistema

Exemplo de uso:
  adminFunctions.liberarAcessoUsuario('usuario@email.com', 'abc123')
  `);
}
