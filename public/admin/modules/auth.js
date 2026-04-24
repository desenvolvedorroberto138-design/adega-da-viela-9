import { auth } from '../../js/firebase.js';
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/**
 * Realiza o login administrativo
 * Retorna true em caso de sucesso para o chamador saber que pode prosseguir
 */
export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true; 
    } catch (err) {
        let mensagem = "Erro ao acessar o painel.";
        
        // Switch case para erros comuns do Firebase
        switch (err.code) {
            case 'auth/invalid-credential':
                mensagem = "E-mail ou senha incorretos.";
                break;
            case 'auth/user-not-found':
                mensagem = "Usuário não cadastrado.";
                break;
            case 'auth/too-many-requests':
                mensagem = "Muitas tentativas. Tente novamente mais tarde.";
                break;
        }
        
        console.error("Erro Firebase:", err.code);
        alert(mensagem);
        return false;
    }
}

/**
 * Finaliza a sessão e limpa redirecionamentos
 */
export async function logout() {
    if (confirm("Deseja sair do painel administrativo?")) {
        try {
            await signOut(auth);
            window.location.reload(); 
        } catch (err) {
            console.error("Erro ao deslogar:", err);
        }
    }
}