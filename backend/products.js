// Sistema de Gerenciamento de Produtos e E-books
class ProductsSystem {
  constructor() {
    this.db = null;
    this.storage = null;
  }

  // Inicializar com Firebase
  init(db, storage) {
    this.db = db;
    this.storage = storage;
  }

  // Liberar acesso ao produto para usuário
  async grantAccess(userId, productId, paymentInfo) {
    try {
      // Atualizar documento do usuário
      await this.db.collection('users').doc(userId).update({
        hasAccess: true,
        products: firebase.firestore.FieldValue.arrayUnion(productId),
        lastPurchase: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Registrar compra
      await this.db.collection('purchases').add({
        userId: userId,
        productId: productId,
        purchaseDate: firebase.firestore.FieldValue.serverTimestamp(),
        paymentInfo: paymentInfo,
        status: 'completed'
      });

      // Enviar email de boas-vindas (implementar com Cloud Functions)
      await this.sendWelcomeEmail(userId, productId);

      return { success: true };
    } catch (error) {
      console.error('Erro ao liberar acesso:', error);
      return { success: false, error: error.message };
    }
  }

  // Obter produtos do usuário
  async getUserProducts(userId) {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      const userData = userDoc.data();
      const productIds = userData.products || [];

      // Buscar informações dos produtos
      const products = [];
      for (const productId of productIds) {
        const productDoc = await this.db.collection('products').doc(productId).get();
        if (productDoc.exists) {
          products.push({ id: productDoc.id, ...productDoc.data() });
        }
      }

      return { success: true, products: products };
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
      return { success: false, error: error.message };
    }
  }

  // Obter lista de e-books de um produto
  async getProductEbooks(productId) {
    try {
      const ebooksSnapshot = await this.db.collection('products')
        .doc(productId)
        .collection('ebooks')
        .orderBy('order', 'asc')
        .get();

      const ebooks = [];
      ebooksSnapshot.forEach(doc => {
        ebooks.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, ebooks: ebooks };
    } catch (error) {
      console.error('Erro ao obter e-books:', error);
      return { success: false, error: error.message };
    }
  }

  // Obter URL de download do e-book
  async getEbookDownloadUrl(productId, ebookId, userId) {
    try {
      // Verificar se usuário tem acesso
      const hasAccess = await this.checkUserProductAccess(userId, productId);
      if (!hasAccess) {
        return { success: false, error: 'Acesso negado' };
      }

      // Obter informações do e-book
      const ebookDoc = await this.db.collection('products')
        .doc(productId)
        .collection('ebooks')
        .doc(ebookId)
        .get();

      if (!ebookDoc.exists) {
        return { success: false, error: 'E-book não encontrado' };
      }

      const ebookData = ebookDoc.data();
      const filePath = ebookData.filePath;

      // Gerar URL de download temporária (válida por 1 hora)
      const fileRef = this.storage.ref(filePath);
      const downloadUrl = await fileRef.getDownloadURL();

      // Registrar download
      await this.logDownload(userId, productId, ebookId);

      return { success: true, url: downloadUrl, fileName: ebookData.fileName };
    } catch (error) {
      console.error('Erro ao obter URL de download:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar se usuário tem acesso ao produto
  async checkUserProductAccess(userId, productId) {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (!userDoc.exists) return false;

      const userData = userDoc.data();
      return userData.products && userData.products.includes(productId);
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      return false;
    }
  }

  // Registrar download
  async logDownload(userId, productId, ebookId) {
    try {
      await this.db.collection('downloads').add({
        userId: userId,
        productId: productId,
        ebookId: ebookId,
        downloadDate: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao registrar download:', error);
    }
  }

  // Enviar email de boas-vindas (placeholder - implementar com Cloud Functions)
  async sendWelcomeEmail(userId, productId) {
    // Este método deve ser implementado via Cloud Functions
    console.log(`Email de boas-vindas enviado para usuário ${userId}`);
    return true;
  }

  // Criar produto (admin)
  async createProduct(productData) {
    try {
      const productRef = await this.db.collection('products').add({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        active: true
      });

      return { success: true, productId: productRef.id };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return { success: false, error: error.message };
    }
  }

  // Adicionar e-book ao produto (admin)
  async addEbookToProduct(productId, ebookData) {
    try {
      await this.db.collection('products')
        .doc(productId)
        .collection('ebooks')
        .add({
          title: ebookData.title,
          description: ebookData.description,
          filePath: ebookData.filePath,
          fileName: ebookData.fileName,
          coverImage: ebookData.coverImage,
          order: ebookData.order || 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar e-book:', error);
      return { success: false, error: error.message };
    }
  }
}

// Criar instância global
const productsSystem = new ProductsSystem();

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.productsSystem = productsSystem;
}
