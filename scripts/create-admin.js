// Script para criar usuário admin no Firebase
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

// Configurações do Firebase do projeto barbearia-375bd
const firebaseConfig = {
  apiKey: "AIzaSyB6cAbasdUji6QtJtPQZm8bMHEdQJ6QykE",
  authDomain: "barbearia-375bd.firebaseapp.com",
  projectId: "barbearia-375bd",
  storageBucket: "barbearia-375bd.firebasestorage.app",
  messagingSenderId: "274515780717",
  appId: "1:274515780717:web:66adc05bf278b2208b0b64",
  measurementId: "G-241BYGEHP1",
}

async function createAdminUser() {
  try {
    console.log("🔧 Inicializando Firebase...")
    console.log("📋 Projeto:", firebaseConfig.projectId)
    console.log("")

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    console.log("👤 Criando usuário administrador...")
    console.log("📧 Email: admin@barbearia.com")
    console.log("🔒 Senha: admin123")
    console.log("")

    // Criar usuário admin
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@barbearia.com", "admin123")

    console.log("✅ USUÁRIO ADMIN CRIADO COM SUCESSO!")
    console.log("=" * 50)
    console.log("📧 Email:", userCredential.user.email)
    console.log("🆔 UID:", userCredential.user.uid)
    console.log("📅 Criado em:", new Date().toLocaleString("pt-BR"))
    console.log("")
    console.log("🔑 CREDENCIAIS DE ACESSO:")
    console.log("Email: admin@barbearia.com")
    console.log("Senha: admin123")
    console.log("")
    console.log("🌐 LINKS DE ACESSO:")
    console.log("Site: https://barbearia-375bd.firebaseapp.com")
    console.log("Admin: https://barbearia-375bd.firebaseapp.com/admin/login")
    console.log("")
    console.log("📋 PRÓXIMOS PASSOS:")
    console.log("1. Acesse o painel admin usando as credenciais acima")
    console.log("2. Teste o sistema de agendamentos")
    console.log("3. Configure as informações da barbearia")
    console.log("")
  } catch (error) {
    console.error("❌ ERRO AO CRIAR USUÁRIO ADMIN")
    console.log("=" * 50)
    console.error("Código do erro:", error.code)
    console.error("Mensagem:", error.message)
    console.log("")

    // Tratar erros específicos
    switch (error.code) {
      case "auth/email-already-in-use":
        console.log("ℹ️ USUÁRIO ADMIN JÁ EXISTE!")
        console.log("🔑 Use as credenciais existentes:")
        console.log("Email: admin@barbearia.com")
        console.log("Senha: admin123")
        console.log("")
        console.log("🌐 Acesse o painel admin em:")
        console.log("https://barbearia-375bd.firebaseapp.com/admin/login")
        break

      case "auth/invalid-api-key":
        console.log("❌ API Key inválida!")
        console.log("Verifique as configurações do Firebase no console.")
        break

      case "auth/project-not-found":
        console.log("❌ Projeto Firebase não encontrado!")
        console.log("Verifique se o Project ID está correto: barbearia-375bd")
        break

      case "auth/operation-not-allowed":
        console.log("❌ Autenticação por email/senha não está ativada!")
        console.log("📋 Para ativar:")
        console.log("1. Acesse: https://console.firebase.google.com/")
        console.log("2. Selecione o projeto: barbearia-375bd")
        console.log("3. Vá em Authentication > Sign-in method")
        console.log("4. Ative 'Email/Password'")
        break

      case "auth/weak-password":
        console.log("❌ Senha muito fraca!")
        console.log("A senha deve ter pelo menos 6 caracteres.")
        break

      default:
        console.log("❌ Erro desconhecido. Verifique:")
        console.log("1. Conexão com a internet")
        console.log("2. Configurações do Firebase")
        console.log("3. Se a autenticação está ativada no console")
        break
    }
    console.log("")
  }
}

// Função para verificar configurações
function verificarConfiguracoes() {
  console.log("🔍 VERIFICANDO CONFIGURAÇÕES...")
  console.log("=" * 50)
  console.log("API Key:", firebaseConfig.apiKey ? "✅ Configurada" : "❌ Não configurada")
  console.log("Auth Domain:", firebaseConfig.authDomain ? "✅ Configurada" : "❌ Não configurada")
  console.log("Project ID:", firebaseConfig.projectId ? "✅ Configurada" : "❌ Não configurada")
  console.log("Storage Bucket:", firebaseConfig.storageBucket ? "✅ Configurada" : "❌ Não configurada")
  console.log("Messaging Sender ID:", firebaseConfig.messagingSenderId ? "✅ Configurada" : "❌ Não configurada")
  console.log("App ID:", firebaseConfig.appId ? "✅ Configurada" : "❌ Não configurada")
  console.log("")
}

// Executar verificações e criar usuário
console.log("🚀 INICIANDO CRIAÇÃO DO USUÁRIO ADMIN")
console.log("=" * 50)
verificarConfiguracoes()
createAdminUser()
