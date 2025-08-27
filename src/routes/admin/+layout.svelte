<!-- src/routes/admin/+layout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  
  // Store untuk sidebar state
  export const sidebarOpen = writable(true);
  
  // State untuk logout modal
  let showLogoutModal = false;
  let showSuccessModal = false;
  
  function handleLogout(): void {
    showLogoutModal = true;
  }
  
  function confirmLogout(): void {
    console.log('Logging out...');
    showLogoutModal = false;
    showSuccessModal = true;
  }
  
  function cancelLogout(): void {
    showLogoutModal = false;
  }
  
  function handleLoginAgain(): void {
    showSuccessModal = false;
    goto('/login');
  }
  
  function isActive(path: string): boolean {
    return $page.url.pathname === path;
  }
  
  function toggleSidebar(): void {
    sidebarOpen.update(open => !open);
  }
  
  // Close modal when clicking outside
  function handleModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      if (showLogoutModal) {
        cancelLogout();
      }
      // Success modal tidak bisa ditutup dengan backdrop click
    }
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
</svelte:head>

<div class="admin-app">
  <!-- Sidebar -->
  <aside class="sidebar" class:sidebar-open={$sidebarOpen}>
    <div class="sidebar-header">
      <div class="sidebar-title">CMS Panel</div>
      <button class="sidebar-toggle" on:click={toggleSidebar} type="button">
        <span class="material-symbols-outlined">
          {$sidebarOpen ? 'menu_open' : 'menu'}
        </span>
      </button>
    </div>
    
    <nav class="nav-menu">
      <a href="/admin" class="nav-item" class:active={isActive('/admin/dashboard-setting')}>
  <span class="nav-icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M 12 12 L 12 2 A 10 10 0 0 1 22 12 Z" fill="currentColor"/>
    </svg>
  </span>
  <span class="nav-text">Dashboard</span>
</a>
      <a href="/admin/homesettings" class="nav-item" class:active={isActive('/admin/homesettings')}>
        <span class="material-symbols-outlined nav-icon">home</span>
        <span class="nav-text">Home</span>
      </a>
      <a href="/admin/services" class="nav-item" class:active={isActive('/admin/services')}>
        <span class="material-symbols-outlined nav-icon">settings</span>
        <span class="nav-text">Services</span>
      </a>
      <a href="/admin/aboutus" class="nav-item" class:active={isActive('/admin/aboutus')}>
        <span class="material-symbols-outlined nav-icon">info</span>
        <span class="nav-text">About Us</span>
      </a>
      <a href="/admin/product" class="nav-item" class:active={isActive('/admin/product')}>
        <span class="material-symbols-outlined nav-icon">inventory_2</span>
        <span class="nav-text">Products</span>
      </a>
      <a href="/admin/contact" class="nav-item" class:active={isActive('/admin/contact')}>
        <span class="material-symbols-outlined nav-icon">call</span>
        <span class="nav-text">Contact</span>
      </a>
    </nav>
    
    <div class="sidebar-footer">
      <button class="logout-btn" on:click={handleLogout} type="button">
        <span class="material-symbols-outlined">logout</span>
        <span class="nav-text">Log Out</span>
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="admin-main" class:main-expanded={!$sidebarOpen}>
    <slot />
  </main>
</div>

<!-- Logout Confirmation Modal -->
{#if showLogoutModal}
  <div class="modal-overlay" on:click={handleModalBackdropClick}>
    <div class="modal-content">
      <div class="modal-header">
        <span class="material-symbols-outlined logout-icon">logout</span>
        <h2 class="modal-title">Logout</h2>
      </div>
      
      <p class="modal-text">Are you sure you want to logout?</p>
      
      <div class="user-info">
        <div class="user-avatar">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b612b098?w=40&h=40&fit=crop&crop=face" alt="User Avatar" />
        </div>
        <div class="user-details">
          <div class="user-name">Putri Mutiara</div>
          <div class="user-email">putrimutiara3010@gmail.com</div>
        </div>
      </div>
      
      <div class="logout-warning">
        You are about to logout from the Content Management System. You will need to login again to access your account.
      </div>
      
      <div class="modal-actions">
        <button class="btn-logout" on:click={confirmLogout}>Yes, Logout</button>
        <button class="btn-cancel" on:click={cancelLogout}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<!-- Success Modal (shown after logout) -->
{#if showSuccessModal}
  <div class="modal-overlay">
    <div class="modal-content success-modal">
      <div class="success-header">
        <h2 class="success-title">Logout Successful!</h2>
      </div>
      
      <p class="success-text">You have been successfully logged out from the cms panel.</p>
      
      <div class="success-actions">
        <button class="btn-login-again" on:click={handleLoginAgain}>Login Again</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Reset hanya untuk admin area */
  .admin-app * {
    box-sizing: border-box;
  }

  .admin-app {
    display: flex;
    min-height: 100vh;
    background-color: #ECF6F9;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
  }

  /* Sidebar Styles */
  .sidebar {
    width: 200px;
    background: linear-gradient(180deg, #4f6cc9 0%, #2448B1 100%);
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, width 0.3s ease;
    z-index: 1000;
  }

  .sidebar:not(.sidebar-open) {
    width: 50px;
  }

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 60px;
  }

  .sidebar-title {
    font-size: 18px;
    font-weight: 700;
    color: white;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .sidebar:not(.sidebar-open) .sidebar-title {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .sidebar-toggle {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .sidebar-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .nav-menu {
    padding: 16px 0;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
    font-size: 14px;
    font-weight: 500;
    position: relative;
  }


  .nav-icon svg {
  width: 18px;
  height: 18px;
  color: inherit;
}

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-left-color: #60a5fa;
  }

  .nav-item.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-left-color: #60a5fa;
    font-weight: 600;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
  }

  .nav-text {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .sidebar:not(.sidebar-open) .nav-text {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .sidebar:not(.sidebar-open) .nav-item {
    justify-content: center;
    padding: 10px;
  }

  .sidebar:not(.sidebar-open) .nav-icon {
    margin-right: 0;
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
  }

  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .sidebar:not(.sidebar-open) .logout-btn {
    justify-content: center;
    gap: 0;
  }

  /* Main Content */
  .admin-main {
    margin-left: 200px;
    flex: 1;
    min-height: 100vh;
    background-color: #ECF6F9;
    transition: margin-left 0.3s ease;
    width: calc(100% - 200px);
  }

  .admin-main.main-expanded {
    margin-left: 50px;
    width: calc(100% - 50px);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    text-align: center;
    border: 2px solid #2563eb;
  }

  .modal-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
  }

  .logout-icon {
    font-size: 48px;
    color: #2563eb;
    margin-bottom: 8px;
  }

  .modal-title {
    font-size: 28px;
    font-weight: 600;
    color: #2563eb;
    margin: 0;
    margin-bottom: 8px;
  }

  .modal-text {
    font-size: 16px;
    color: #374151;
    margin: 0 0 24px 0;
    font-weight: 500;
  }

  .user-info {
    background: #f3f4f6;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    text-align: left;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-details {
    flex: 1;
  }

  .user-name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 2px;
  }

  .user-email {
    font-size: 14px;
    color: #6b7280;
  }

  .logout-warning {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
    margin-bottom: 24px;
    text-align: center;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .btn-logout {
    background: #dc2626;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-logout:hover {
    background: #b91c1c;
  }

  .btn-cancel {
    background: #6b7280;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-cancel:hover {
    background: #4b5563;
  }

  /* Success Modal Styles */
  .success-modal {
    border-color: #059669;
  }

  .success-title {
    font-size: 28px;
    font-weight: 600;
    color: #059669;
    margin: 0 0 16px 0;
  }

  .success-text {
    font-size: 16px;
    color: #374151;
    margin: 0 0 24px 0;
  }

  .btn-login-again {
    background: #059669;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-login-again:hover {
    background: #047857;
  }

  /* Material Icons */
  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 18px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 18;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .sidebar {
      transform: translateX(-100%);
    }
    
    .sidebar.sidebar-open {
      transform: translateX(0);
    }
    
    .admin-main {
      margin-left: 0;
      width: 100%;
    }
    
    .admin-main.main-expanded {
      margin-left: 0;
      width: 100%;
    }

    .modal-content {
      margin: 20px;
      padding: 24px;
    }
  }

  @media (max-width: 768px) {
    .sidebar-header {
      padding: 16px;
    }
    
    .sidebar-title {
      font-size: 18px;
    }
    
    .nav-item {
      padding: 10px 16px; 
    }

    .modal-content {
      padding: 20px;
    }

    .modal-actions {
      flex-direction: column;
    }

    .btn-logout,
    .btn-cancel {
      width: 100%;
    }
  }
</style>