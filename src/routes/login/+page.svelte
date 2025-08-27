<script lang="ts">
  import { goto } from '$app/navigation';
  import loginImage from '../../lib/assets/cms-stb-login.png';
  
  let email: string = '';
  let password: string = '';
  let showPassword: boolean = false;
  let rememberMe: boolean = false;
  let isLoading: boolean = false;
  let errorMessage: string = '';

  function togglePassword(): void {
    showPassword = !showPassword;
  }

  async function handleSubmit(): Promise<void> {
    isLoading = true;
    errorMessage = '';
    
    // Validasi input dasar
    if (!email || !password) {
      errorMessage = "Email dan password harus diisi";
      isLoading = false;
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorMessage = "Format email tidak valid";
      isLoading = false;
      return;
    }

    // Simulasi loading
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    
    // --- Ganti dengan API login beneran ---
    const isAuthenticated = true; // contoh hasil sukses
    const loggedInUserName = email.split('@')[0]; 
    
    // Redirect ke halaman dashboard admin jika login berhasil
    if (isAuthenticated) {
      await goto('/admin'); // Mengarahkan ke folder admin (+page.svelte)
    } else {
      errorMessage = "Email atau password salah";
    }
    
    isLoading = false;
  }
</script>

<main class="login-page">
  <div class="bg-ellipse-top-right"></div>
  <div class="bg-ellipse-bottom-left"></div>

  <div class="login-container">
    <div class="login-form">
      <div class="form-header">
        <h1>Login</h1>
        <p class="login-subtitle">Welcome to the Content Management System.</p>
        <p class="login-subtitle">Log in to start managing and updating your content.</p>
      </div>
      
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}
      
      <form class="form-container" on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="email">Email</label>
          <div class="form-input">
            <input 
              type="email" 
              id="email" 
              bind:value={email}
              placeholder="Add email"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="form-input">
            <input 
              type={showPassword ? 'text' : 'password'}
              id="password" 
              bind:value={password}
              placeholder="Add password"
              required
              disabled={isLoading}
            />
            <button type="button" class="password-toggle" on:click={togglePassword} disabled={isLoading}>
              {#if showPassword}
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.708zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                </svg>
              {:else}
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                </svg>
              {/if}
            </button>
          </div>
        </div>

        <div class="checkbox-group">
          <input type="checkbox" id="remember" bind:checked={rememberMe} disabled={isLoading} />
          <label for="remember">Ingat Saya</label>
        </div>

        <button type="submit" class="login-btn" disabled={isLoading}>
          {#if isLoading}
            <div class="loading-spinner"></div>
            Memproses...
          {:else}
            Login
          {/if}
        </button>
      </form>

      <div class="company-info">
        PT. Solusi Tiga Bersama
      </div>
    </div>

    <div class="login-illustration">
      <div class="illustration-content">
        <img src={loginImage} alt="Login Illustration" class="main-illustration" />
      </div>
    </div>
  </div>
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body:has(.login-page)) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #ECF6F9;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-x: hidden; /* Mencegah scroll horizontal */
    overflow-y: auto; /* Hanya izinkan scroll vertikal jika diperlukan */
  }

  .login-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    max-width: 100vw; /* Membatasi lebar maksimal */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow: hidden; /* Mencegah scroll dari background elements */
  }

  /* Background ellipses - ukuran asli dikembalikan */
  .bg-ellipse-top-right {
    position: absolute;
    top: -200px;
    right: -200px;
    width: 450px;
    height: 450px;
    background: #2448B1;
    border-radius: 50%;
    z-index: 0;
    opacity: 0.8;
  }

  .bg-ellipse-bottom-left {
    position: absolute;
    bottom: -250px;
    left: -250px;
    width: 550px;
    height: 550px;
    background: #2448B1;
    border-radius: 50%;
    z-index: 0;
    opacity: 0.8;
  }

  /* Container utama */
  .login-container {
    background: #ECF6F9;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(36, 72, 177, 0.1);
    display: flex;
    max-width: 900px;
    width: 100%;
    min-height: 500px;
    overflow: hidden;
    position: relative;
    z-index: 10;
    backdrop-filter: blur(10px);
  }

  .login-form {
    flex: 1;
    padding: 35px 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #ECF6F9;
    border-radius: 16px 0 0 16px;
    max-width: 450px;
    min-height: 100%;
  }

  .form-header {
    margin-bottom: 25px;
  }

  .login-form h1 {
    color: #2448B1;
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 6px;
    line-height: 1.2;
  }

  .login-subtitle {
    color: #64748B;
    margin-bottom: 3px;
    line-height: 1.4;
    font-size: 13px;
  }

  .error-message {
    background: #FEE2E2;
    color: #DC2626;
    padding: 10px 14px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 13px;
    border: 1px solid #FECACA;
    word-wrap: break-word;
  }

  .form-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    display: block;
    color: #1E293B;
    font-weight: 500;
    margin-bottom: 6px;
    font-size: 13px;
  }

  .form-input {
    position: relative;
    width: 100%;
  }

  .form-input input {
    width: 100%;
    padding: 10px 14px;
    padding-right: 40px;
    border: 1px solid #B2DBFF;
    border-radius: 6px;
    font-size: 13px;
    transition: all 0.2s ease;
    background: #F8FAFC;
    color: #64748B;
  }

  .form-input input:focus {
    outline: none;
    border-color: #2448B1;
    background: white;
    box-shadow: 0 0 0 3px rgba(36, 72, 177, 0.1);
    color: #1E293B;
  }

  .form-input input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-input input::placeholder {
    color: #94A3B8;
  }

  .password-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #94A3B8;
    border: none;
    background: none;
    padding: 6px;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .password-toggle:hover:not(:disabled) {
    color: #2448B1;
    background: rgba(36, 72, 177, 0.1);
  }

  .password-toggle:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    gap: 6px;
  }

  .checkbox-group input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: #2448B1;
    cursor: pointer;
  }

  .checkbox-group input[type="checkbox"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .checkbox-group label {
    color: #475569;
    font-size: 13px;
    margin-bottom: 0;
    font-weight: 400;
    cursor: pointer;
    user-select: none;
  }

  .login-btn {
    background: #2448B1;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 42px;
  }

  .login-btn:hover:not(:disabled) {
    background: #1e3a8a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(36, 72, 177, 0.3);
  }

  .login-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .loading-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .company-info {
    text-align: center;
    color: #94A3B8;
    font-size: 11px;
    margin-top: auto;
    padding-top: 16px;
  }

  .login-illustration {
    flex: 1;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 30px;
    border-radius: 0 16px 16px 0;
    min-height: 400px;
  }

  .illustration-content {
    position: relative;
    width: 100%;
    max-width: 350px;
    text-align: center;
  }

  .main-illustration {
    width: 100%;
    max-width: 350px;
    height: auto;
    border-radius: 12px;
    transition: transform 0.3s ease;
    object-fit: cover;
  }

  .main-illustration:hover {
    transform: scale(1.02);
  }

  /* Tablet styles */
  @media (max-width: 1024px) {
    .login-container {
      max-width: 750px;
    }

    .login-form {
      padding: 30px 25px;
    }
    

  }

  /* Mobile landscape and small tablet */
  @media (max-width: 768px) {
    .login-page {
      padding: 15px;
    }

    .login-container {
      flex-direction: column;
      max-width: 450px;
      min-height: auto;
    }

    .login-illustration {
      order: -1;
      min-height: 200px;
      padding: 20px;
      border-radius: 16px 16px 0 0;
      flex: none;
    }

    .login-form {
      padding: 25px 20px;
      border-radius: 0 0 16px 16px;
      max-width: none;
      flex: none;
    }

    .main-illustration {
      max-width: 250px;
    }


  }

  /* Mobile portrait */
  @media (max-width: 480px) {
    .login-container {
      margin: 10px 0;
      border-radius: 12px;
    }

    .login-form {
      padding: 20px 16px;
    }

    .login-illustration {
      min-height: 160px;
      padding: 12px;
      border-radius: 12px 12px 0 0;
    }

    .main-illustration {
      max-width: 200px;
    }

    .form-input input {
      font-size: 16px; /* Prevents zoom on iOS */
    }

    .bg-ellipse-top-right, 
    .bg-ellipse-bottom-left {
      display: none;
    }
  }

  /* Very small screens */
  @media (max-width: 360px) {
    .bg-ellipse-top-right, 
    .bg-ellipse-bottom-left {
      display: none;
    }
  }

  /* Landscape mobile optimization */
  @media (max-width: 768px) and (orientation: landscape) {
    .login-container {
      flex-direction: row;
      max-width: 650px;
      min-height: 350px;
    }

    .login-illustration {
      order: 0;
      border-radius: 0 16px 16px 0;
      min-height: 350px;
      flex: 0.8;
    }

    .login-form {
      border-radius: 16px 0 0 16px;
      flex: 1.2;
      padding: 20px 20px;
    }

    .form-header {
      margin-bottom: 12px;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .checkbox-group {
      margin-bottom: 16px;
    }

    .login-btn {
      margin-bottom: 12px;
    }
  }

  /* Focus and accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    .main-illustration:hover {
      transform: none;
    }

    .login-btn:hover:not(:disabled) {
      transform: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .form-input input {
      border-width: 2px;
    }

    .login-btn {
      border: 2px solid transparent;
    }

    .error-message {
      border-width: 2px;
    }
  }
</style>