<script>
  import { goto } from '$app/navigation';
  import loginImage from '../../lib/assets/cms-stb-login.png';
 
  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let rememberMe = $state(false);
  let isLoading = $state(false);
  let errorMessage = $state('');
  
  function togglePassword() {
    showPassword = !showPassword;
  }
  
  async function handleSubmit() {
    isLoading = true;
    errorMessage = '';
   
    if (!email || !password) {
      errorMessage = "Email dan password harus diisi";
      isLoading = false;
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorMessage = "Format email tidak valid";
      isLoading = false;
      return;
    }
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
   
    const isAuthenticated = true;
    const loggedInUserName = email.split('@')[0];
   
    if (isAuthenticated) {
      await goto('/admin');
    } else {
      errorMessage = "Email atau password salah";
    }
   
    isLoading = false;
  }
</script>

<main class="login-page relative w-full min-h-screen max-w-full flex items-center justify-center p-5 overflow-hidden">
  <div class="bg-ellipse-top-right absolute -top-50 -right-50 w-[450px] h-[450px] bg-[#2448B1] rounded-full z-0 opacity-80"></div>
  <div class="bg-ellipse-bottom-left absolute -bottom-64 -left-64 w-[550px] h-[550px] bg-[#2448B1] rounded-full z-0 opacity-80"></div>
  <div class="login-container bg-[#ECF6F9] rounded-2xl shadow-[0_8px_32px_rgba(36,72,177,0.1)] flex max-w-[900px] w-full min-h-[500px] overflow-hidden relative z-10 backdrop-blur-[10px]">
    <div class="login-form flex-1 px-9 py-12 flex flex-col justify-center bg-[#ECF6F9] rounded-l-2xl max-w-[450px] min-h-full">
      <div class="form-content flex flex-col max-w-[350px] mx-auto w-full">
        <div>
          <div class="form-header mb-4 mt-10">
            <h1 class="text-[#2448B1] text-[2rem] font-bold mb-4 leading-[1.2]">Login</h1>
            <p class="login-subtitle text-[#64748B] mb-1 leading-[1.4] text-[14px]">
              Welcome to the Content Management System.
            </p>
            <p class="login-subtitle text-[#64748B] mb-4 leading-[1.4] text-[14px]">
              Log in to start managing and updating your content.
            </p>
          </div>
       
          {#if errorMessage}
            <div class="error-message bg-[#FEE2E2] text-[#DC2626] px-4 py-3 rounded-md mb-2 text-[13px] border border-[#FECACA] break-words">
              {errorMessage}
            </div>
          {/if}
       
          <form class="form-container flex flex-col mt-6" onsubmit={handleSubmit}>
            <!-- Email -->
            <div class="form-group mb-2">
              <label for="email" class="block text-[#1E293B] font-medium mb-2 text-[14px]">Email</label>
              <div class="form-input relative w-full">
                <input
                  type="email"
                  id="email"
                  bind:value={email}
                  placeholder="Add email"
                  required
                  disabled={isLoading}
                  class="w-full h-9 px-2 border border-[#CBD5E1] rounded-md text-[14px]
                         bg-[#B2DBFF] text-[#1E293B]
                         focus:outline-none focus:border-[#2448B1] focus:bg-white
                         focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]
                         disabled:opacity-60 placeholder:text-[#94A3B8]"
                />
              </div>
            </div>
            <!-- Password -->
            <div class="form-group mb-2">
              <label for="password" class="block text-[#1E293B] font-medium mb-2 text-[14px]">Password</label>
              <div class="form-input relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  bind:value={password}
                  placeholder="Add password"
                  required
                  disabled={isLoading}
                  class="w-full h-9 px-2 pr-12 border border-[#CBD5E1] rounded-md text-[14px]
                         bg-[#B2DBFF] text-[#1E293B]
                         focus:outline-none focus:border-[#2448B1] focus:bg-white
                         focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]
                         disabled:opacity-60 placeholder:text-[#94A3B8]"
                />
                <button
                  type="button"
                  class="password-toggle absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#94A3B8] border-none bg-none p-1 rounded transition-all duration-200 flex items-center justify-center hover:text-[#2448B1] hover:bg-[rgba(36,72,177,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
                  onclick={togglePassword}
                  disabled={isLoading}
                >
                  {#if showPassword}
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.708zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                    </svg>
                  {:else}
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                  {/if}
                </button>
              </div>
            </div>
            <!-- Checkbox -->
            <div class="checkbox-group flex items-center mb-3 gap-3">
              <input
                type="checkbox"
                id="remember"
                bind:checked={rememberMe}
                class="w-3 h-3 text-[#2448B1] bg-white border-2 border-[#B2DBFF] rounded focus:ring-[#2448B1] focus:ring-2 focus:ring-offset-0 cursor-pointer accent-[#2448B1]"
              />
              <label for="remember" class="text-[#475569] text-[14px] cursor-pointer select-none">Remember Me</label>
            </div>
            <!-- Submit Button -->
            <div class="form-group mb-4">
              <button
                type="submit"
                class="bg-[#2448B1] text-white font-semibold h-9 py-5 px-8 rounded-md w-full
                       shadow-md hover:bg-[#1e3a8a] hover:shadow-lg
                       transition-all duration-200 flex items-center justify-center
                       disabled:opacity-60 disabled:cursor-not-allowed text-[15px]"
                disabled={isLoading}
              >
                {#if isLoading}
                  <div class="loading-spinner w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin mr-2"></div>
                  Memproses...
                {:else}
                  Login
                {/if}
              </button>
            </div>
          </form>
        </div>
        <!-- Company Info -->
        <div class="form-container text-[#94A3B8] text-[11px] font-medium text-center mt-4 mt-auto ">
          PT Solusi Tiga Bersama
        </div>
      </div>
    </div>
    <div class="login-illustration flex-1 bg-transparent flex items-center justify-center relative p-8 rounded-r-2xl min-h-96">
      <div class="illustration-content relative w-full max-w-[350px] text-center">
        <img src={loginImage} alt="Login Illustration" class="main-illustration w-full max-w-[350px] h-auto rounded-xl transition-transform duration-300 object-cover hover:scale-[1.02]" />
      </div>
    </div>
  </div>
</main>

<style>
@reference "tailwindcss";
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
    overflow-x: hidden;
    overflow-y: auto;
  }
  .login-form {
    @apply flex flex-col justify-center;
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  .form-content {
    @apply flex flex-col max-w-[350px] mx-auto w-full;
  }
  .form-container {
    @apply mt-6;
  }
  .form-group {
    @apply mb-2;
  }
  .checkbox-group {
    @apply mb-3;
  }
  /* Custom checkbox styling to match design */
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  input[type="checkbox"]:checked {
    background-color: #2448B1;
    border-color: #2448B1;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
  @media (max-width: 1024px) {
    .login-container {
      @apply max-w-[750px];
    }
    .login-form {
      @apply py-10 px-6;
    }
  }
  @media (max-width: 768px) {
    .login-page {
      @apply p-4;
    }
    .login-container {
      @apply flex-col max-w-[450px] min-h-0;
    }
    .login-illustration {
      @apply -order-1 min-h-[200px] p-5 rounded-t-2xl flex-none;
    }
    .login-form {
      @apply py-8 px-5 rounded-b-2xl max-w-none flex-none;
    }
    .main-illustration {
      @apply max-w-[250px];
    }
    .form-header {
      @apply mb-4 mt-8;
    }
    .form-container {
      @apply mt-4;
    }
    .form-group {
      @apply mb-2;
    }
    .checkbox-group {
      @apply mb-3;
    }
    .company-info {
      @apply mt-2;
    }
  }
  @media (max-width: 480px) {
    .login-container {
      @apply my-3 rounded-xl;
    }
    .login-form {
      @apply py-6 px-4;
    }
    .login-illustration {
      @apply min-h-[160px] p-3 rounded-t-xl;
    }
    .main-illustration {
      @apply max-w-[200px];
    }
    .form-input input {
      font-size: 16px;
    }
    .bg-ellipse-top-right,
    .bg-ellipse-bottom-left {
      @apply hidden;
    }
    .form-header {
      @apply mt-6 mb-2;
    }
    .form-container {
      @apply mt-4;
    }
    .form-group {
      @apply mb-2;
    }
    .checkbox-group {
      @apply mb-3;
    }
    .company-info {
      @apply mt-2;
    }
  }
  @media (max-width: 360px) {
    .bg-ellipse-top-right,
    .bg-ellipse-bottom-left {
      @apply hidden;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    .main-illustration:hover {
      @apply scale-100;
    }
    button:hover:not(:disabled) {
      @apply translate-y-0;
    }
  }
  @media (prefers-contrast: high) {
    .form-input input {
      @apply border-2;
    }
    button[type="submit"] {
      @apply border-2 border-transparent;
    }
    .error-message {
      @apply border-2;
    }
  }
</style>