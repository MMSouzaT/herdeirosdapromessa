// Sistema de Autenticação
class AuthSystem {
  constructor() {
    this.auth = null;
    this.db = null;
    this.currentUser = null;
  }

  // Inicializar com Firebase
  init(auth, db) {
    this.auth = auth;
    this.db = db;
    this.setupAuthListener();
  }

  // Monitorar estado de autenticação
  setupAuthListener() {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        console.log('Usuário autenticado:', user.email);
        this.checkUserAccess(user.uid);
      } else {
        console.log('Usuário não autenticado');
      }
    });
  }

  // Registrar novo usuário
  async register(email, password, name) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Atualizar perfil
      await user.updateProfile({ displayName: name });

      // Criar documento do usuário no Firestore
      await this.db.collection('users').doc(user.uid).set({
        name: name,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        hasAccess: false, // Acesso bloqueado até confirmação de pagamento
        products: []
      });

      return { success: true, user: user };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Login de usuário
  async login(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Logout
  async logout() {
    try {
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: error.message };
    }
  }

  // Recuperar senha
  async resetPassword(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return { success: true };
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Verificar acesso do usuário
  async checkUserAccess(userId) {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData.hasAccess || false;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      return false;
    }
  }

  // Obter dados do usuário
  async getUserData(userId) {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        return { success: true, data: userDoc.data() };
      }
      return { success: false, error: 'Usuário não encontrado' };
    } catch (error) {
      console.error('Erro ao obter dados:', error);
      return { success: false, error: error.message };
    }
  }

  // Traduzir mensagens de erro
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'Este email já está cadastrado',
      'auth/invalid-email': 'Email inválido',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet'
    };
    return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente';
  }

  // Verificar se está autenticado
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Obter usuário atual
  getCurrentUser() {
    return this.currentUser;
  }
}

// Criar instância global
const authSystem = new AuthSystem();

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.authSystem = authSystem;
}
