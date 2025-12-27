// Sistema de Integração com Gateway de Pagamento
class PaymentSystem {
  constructor() {
    this.db = null;
    // Configurar seu gateway de pagamento preferido
    this.gatewayConfig = {
      mercadoPago: {
        publicKey: 'SUA_PUBLIC_KEY_MERCADO_PAGO',
        accessToken: 'SEU_ACCESS_TOKEN_MERCADO_PAGO'
      },
      stripe: {
        publicKey: 'SUA_PUBLIC_KEY_STRIPE'
      }
    };
  }

  // Inicializar com Firebase
  init(db) {
    this.db = db;
  }

  // Criar checkout (Mercado Pago)
  async createMercadoPagoCheckout(productData, userEmail) {
    try {
      const preference = {
        items: [{
          title: productData.name,
          description: productData.description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: productData.price
        }],
        payer: {
          email: userEmail
        },
        back_urls: {
          success: `${window.location.origin}/membros/pagamento-sucesso.html`,
          failure: `${window.location.origin}/membros/pagamento-erro.html`,
          pending: `${window.location.origin}/membros/pagamento-pendente.html`
        },
        auto_return: 'approved',
        notification_url: `${window.location.origin}/backend/webhook-mercadopago.php`, // Você precisará criar este webhook
        external_reference: `${userEmail}_${productData.id}_${Date.now()}`
      };

      // NOTA: Esta chamada deve ser feita do lado do servidor por segurança
      // Este é apenas um exemplo de estrutura
      console.log('Criar preferência no Mercado Pago:', preference);
      
      return {
        success: true,
        checkoutUrl: 'URL_DO_CHECKOUT_MERCADO_PAGO',
        preferenceId: 'PREFERENCE_ID'
      };
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar status do pagamento
  async checkPaymentStatus(paymentId) {
    try {
      const paymentDoc = await this.db.collection('payments').doc(paymentId).get();
      
      if (!paymentDoc.exists) {
        return { success: false, error: 'Pagamento não encontrado' };
      }

      const paymentData = paymentDoc.data();
      return {
        success: true,
        status: paymentData.status,
        data: paymentData
      };
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      return { success: false, error: error.message };
    }
  }

  // Registrar pagamento no banco
  async registerPayment(paymentData) {
    try {
      await this.db.collection('payments').add({
        userId: paymentData.userId,
        productId: paymentData.productId,
        amount: paymentData.amount,
        status: paymentData.status,
        gateway: paymentData.gateway,
        gatewayPaymentId: paymentData.gatewayPaymentId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      return { success: false, error: error.message };
    }
  }

  // Processar webhook de pagamento aprovado
  async processPaymentApproved(paymentData) {
    try {
      // Atualizar status do pagamento
      await this.db.collection('payments')
        .where('gatewayPaymentId', '==', paymentData.id)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            doc.ref.update({ status: 'approved' });
          });
        });

      // Liberar acesso ao produto
      if (window.productsSystem) {
        await window.productsSystem.grantAccess(
          paymentData.userId,
          paymentData.productId,
          paymentData
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar link de pagamento direto (alternativa simples)
  createPaymentLink(productData) {
    // Exemplo com link do Mercado Pago
    const encodedProduct = encodeURIComponent(productData.name);
    const price = productData.price;
    
    return `https://www.mercadopago.com.br/checkout/v1/payment?preference-id=SEU_PREFERENCE_ID`;
  }

  // Inicializar SDK do Mercado Pago
  initMercadoPago() {
    if (typeof MercadoPago !== 'undefined') {
      const mp = new MercadoPago(this.gatewayConfig.mercadoPago.publicKey, {
        locale: 'pt-BR'
      });
      return mp;
    }
    return null;
  }
}

// Criar instância global
const paymentSystem = new PaymentSystem();

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.paymentSystem = paymentSystem;
}
