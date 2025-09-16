<script lang="ts">
  import { page } from '$app/stores';
  import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { onMount, tick } from 'svelte';
  import { userName, userEmail, logoutUser } from '../../lib/store'; 
  
  export const sidebarOpen = writable<boolean>(true);
  
  
  $: sidebarIsOpen = $sidebarOpen;
  $: currentPath = $page.url.pathname;
  let forceUpdate = 0; 
  let displayName = '';
  let displayEmail = '';
  
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarOpen');
      const initialState = savedState !== null ? savedState === 'true' : true;
      sidebarOpen.set(initialState);
      console.log('Initial sidebar state:', initialState);

      
      const savedUser = localStorage.getItem('userName');
      const savedEmail = localStorage.getItem('userEmail');
      displayName = savedUser || $userName || 'Admin';
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      displayEmail = savedEmail || $userEmail || 'admin@example.com';
      console.log('User display:', { displayName, displayEmail });
    }
  });

  beforeNavigate(() => {
    console.log('Before navigate - current path:', $page.url.pathname);
  });

 
  afterNavigate(async () => {
    console.log('After navigate - new path:', $page.url.pathname);
    await tick();
    forceUpdate++;
  });

  
  $: {
    if ($page?.url?.pathname) {
      console.log('Page store updated:', $page.url.pathname);
     
      forceUpdate++;
    }
  }

  
  sidebarOpen.subscribe(value => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', value.toString());
      console.log('Sidebar state saved:', value);
    }
  });

  
  let showLogoutModal = false;
  let showSuccessModal = false;

  function toggleSidebar(): void {
    console.log('Toggling sidebar, current state:', $sidebarOpen);
    sidebarOpen.update(open => !open);
  }

  function handleLogout(): void {
    showLogoutModal = true;
  }

  function confirmLogout(): void {
    console.log('Logging out...');
    logoutUser(); 
    showLogoutModal = false;
    showSuccessModal = true;
  }

  function cancelLogout(): void {
    showLogoutModal = false;
  }

  function handleLoginAgain(): void {
    showSuccessModal = false;
    goto('/login').catch(err => console.error('Navigation error:', err));
  }

  
  function isActive(path: string): boolean {
    const current = currentPath || $page?.url?.pathname || '';
    console.log(`Checking active state - Path: ${path}, Current: ${current}, Force update: ${forceUpdate}`);
    
    if (path === '/admin') {
      return current === '/admin';
    }
    return current.startsWith(path) && current !== '/admin';
  }
  
  
  function handleModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      if (showLogoutModal) {
        cancelLogout();
      }
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
</svelte:head>


{#key forceUpdate}
<div class="flex min-h-screen bg-[#2448B1] font-['Inter'] relative overflow-hidden">
  <aside class="bg-gradient-to-b from-[#4f6cc9] to-[#2448B1] text-white fixed top-0 left-0 h-screen overflow-y-auto flex flex-col z-[1000] transition-all duration-300 {sidebarIsOpen ? 'w-[200px]' : 'w-[50px]'} {sidebarIsOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}">
    <div class="p-4 border-b border-white/10 flex items-center justify-between min-h-[60px]">
      <div class="text-lg font-bold text-white transition-opacity duration-300 {sidebarIsOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}">CMS Panel</div>
      <button class="bg-white/10 border-none text-white p-1.5 rounded-md cursor-pointer hover:bg-white/20 transition-colors flex-shrink-0" on:click={toggleSidebar} type="button" aria-label="Toggle sidebar">
        <span class="icon-wrapper">
          <span class="material-symbols-outlined nav-icon">{sidebarIsOpen ? 'menu_open' : 'menu'}</span>
        </span>
      </button>
    </div>

    <nav class="py-4 flex-1">
      <a href="/admin" class="flex items-center py-2.5 px-3 text-white no-underline border-l-[3px] border-transparent text-sm font-medium transition-all duration-200 {sidebarIsOpen ? '' : 'justify-center'} hover:bg-white/10 {isActive('/admin') ? 'bg-white/15 border-l-blue-400' : ''}">
        <span class="icon-wrapper {sidebarIsOpen ? 'mr-2.5' : 'mr-0'}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M 12 12 L 12 2 A 10 10 0 0 1 22 12 Z" fill="currentColor"/>
          </svg>
        </span>
        <span class="nav-text-item {sidebarIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}">Dashboard</span>
      </a>
      
      <a href="/admin/homesettings" class="flex items-center py-2.5 px-3 text-white no-underline border-l-[3px] border-transparent text-sm font-medium transition-all duration-200 {sidebarIsOpen ? '' : 'justify-center'} hover:bg-white/10 {isActive('/admin/homesettings') ? 'bg-white/15 border-l-blue-400' : ''}">
        <span class="icon-wrapper {sidebarIsOpen ? 'mr-2.5' : 'mr-0'}">
          <span class="material-symbols-outlined nav-icon">home</span>
        </span>
        <span class="nav-text-item {sidebarIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}">Home</span>
      </a>
      
      <a href="/admin/services" class="flex items-center py-2.5 px-3 text-white no-underline border-l-[3px] border-transparent text-sm font-medium transition-all duration-200 {sidebarIsOpen ? '' : 'justify-center'} hover:bg-white/10 {isActive('/admin/services') ? 'bg-white/15 border-l-blue-400' : ''}">
        <span class="icon-wrapper {sidebarIsOpen ? 'mr-2.5' : 'mr-0'}">
          <span class="material-symbols-outlined nav-icon">settings</span>
        </span>
        <span class="nav-text-item {sidebarIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}">Services</span>
      </a>
      
      <a href="/admin/aboutus" class="flex items-center py-2.5 px-3 text-white no-underline border-l-[3px] border-transparent text-sm font-medium transition-all duration-200 {sidebarIsOpen ? '' : 'justify-center'} hover:bg-white/10 {isActive('/admin/aboutus') ? 'bg-white/15 border-l-blue-400' : ''}">
        <span class="icon-wrapper {sidebarIsOpen ? 'mr-2.5' : 'mr-0'}">
          <span class="material-symbols-outlined nav-icon">info</span>
        </span>
        <span class="nav-text-item {sidebarIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}">About Us</span>
      </a>
      
      <a href="/admin/product" class="flex items-center py-2.5 px-3 text-white no-underline border-l-[3px] border-transparent text-sm font-medium transition-all duration-200 {sidebarIsOpen ? '' : 'justify-center'} hover:bg-white/10 {isActive('/admin/product') ? 'bg-white/15 border-l-blue-400' : ''}">
        <span class="icon-wrapper {sidebarIsOpen ? 'mr-2.5' : 'mr-0'}">
          <span class="material-symbols-outlined nav-icon">inventory_2</span>
        </span>
        <span class="nav-text-item {sidebarIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}">Products</span>
      </a>
      
      <a href="/admin/contact" class="flex items-center py-2.5 px-3 text-white no-underline border-l-[3px] border-transparent text-sm font-medium transition-all duration-200 {sidebarIsOpen ? '' : 'justify-center'} hover:bg-white/10 {isActive('/admin/contact') ? 'bg-white/15 border-l-blue-400' : ''}">
        <span class="icon-wrapper {sidebarIsOpen ? 'mr-2.5' : 'mr-0'}">
          <span class="material-symbols-outlined nav-icon">call</span>
        </span>
        <span class="nav-text-item {sidebarIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}">Contact</span>
      </a>
    </nav>

    <div class="p-4 border-t border-white/10">
      <button class="w-full flex items-center py-2.5 px-3 bg-white/10 border border-white/20 text-white rounded-md cursor-pointer font-medium text-sm hover:bg-white/20 transition-colors {sidebarIsOpen ? 'gap-2.5' : 'justify-center gap-0'}" on:click={handleLogout} type="button">
        <span class="icon-wrapper">
          <span class="material-symbols-outlined nav-icon">logout</span>
        </span>
        <span class="nav-text-item {sidebarIsOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}">Log Out</span>
      </button>
    </div>
  </aside>


  <main class="flex-1 min-h-screen bg-[#ECF6F9] transition-all duration-300 {sidebarIsOpen ? 'ml-[200px] w-[calc(100%-200px)]' : 'ml-[50px] w-[calc(100%-50px)]'} max-lg:ml-0 max-lg:w-full">
    <button class="lg:hidden fixed top-4 left-4 z-[1001] bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors" on:click={toggleSidebar}>
      <span class="icon-wrapper">
        <span class="material-symbols-outlined nav-icon">{sidebarIsOpen ? 'close' : 'menu'}</span>
      </span>
    </button>
    <slot />
  </main>
</div>
{/key}


{#if showLogoutModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] backdrop-blur-sm" on:click={handleModalBackdropClick} role="dialog" aria-modal="true">
    <div class="bg-white rounded-xl p-8 max-w-[400px] w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] text-center border-2 border-blue-600 max-md:mx-5 max-md:p-6">
      <div class="flex flex-col items-center mb-4">
        <span class="material-symbols-outlined text-[48px] text-blue-600 mb-2">logout</span>
        <h2 class="text-[28px] font-semibold text-blue-600 m-0 mb-2">Logout</h2>
      </div>

      <p class="text-base text-gray-700 m-0 mb-6 font-medium">Are you sure you want to logout?</p>

      <div class="bg-gray-100 rounded-lg p-4 flex items-center gap-3 mb-4 text-left">
        <div class="w-12 h-12 rounded-full overflow-hidden shrink-0">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b612b098?w=40&h=40&fit=crop&crop=face" alt="User Avatar" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1">
          <div class="text-base font-semibold text-gray-900 mb-0.5">{displayName}</div>
          <div class="text-sm text-gray-500">{displayEmail}</div>
        </div>
      </div>

      <div class="text-[13px] text-gray-500 leading-[1.4] mb-6 text-center">
        You are about to logout from the Content Management System. You will need to login again to access your account.
      </div>

      <div class="flex gap-3 justify-center max-md:flex-col">
        <button class="bg-red-600 text-white border-none py-2.5 px-6 rounded-md text-sm font-semibold cursor-pointer hover:bg-red-700 transition-colors max-md:w-full" on:click={confirmLogout}>Yes, Logout</button>
        <button class="bg-gray-500 text-white border-none py-2.5 px-6 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-600 transition-colors max-md:w-full" on:click={cancelLogout}>Cancel</button>
      </div>
    </div>
  </div>
{/if}


{#if showSuccessModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="bg-white rounded-xl p-8 max-w-[400px] w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] text-center border-2 border-emerald-600 max-md:mx-5 max-md:p-5">
      <div class="mb-6">
        <h2 class="text-[28px] font-semibold text-emerald-600 m-0 mb-4">Logout Successful!</h2>
      </div>

      <p class="text-base text-gray-700 m-0 mb-6">You have been successfully logged out from the cms panel.</p>

      <div>
        <button class="bg-emerald-600 text-white border-none py-2.5 px-6 rounded-md text-sm font-semibold cursor-pointer hover:bg-emerald-700 transition-colors" on:click={handleLoginAgain}>Login Again</button>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }

  
  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }

  
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  
  .nav-icon {
    width: 20px !important;
    height: 20px !important;
    font-size: 20px !important;
    color: currentColor;
  }

 
  .nav-text-item {
    transition: all 0.3s ease;
    white-space: nowrap;
  }


  .nav-icon-svg {
    width: 20px;
    height: 20px;
    color: currentColor;
  }


  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: white;
    text-decoration: none;
    border-left: 3px solid transparent;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    gap: 12px;
  }

  .nav-item.collapsed {
    justify-content: center;
    gap: 0;
  }

  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-item.active {
    background-color: rgba(255, 255, 255, 0.15);
    border-left-color: #60a5fa;
  }

  
  .nav-text {
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .nav-text.visible {
    opacity: 1;
    width: auto;
  }

  .nav-text.hidden {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

 
  .logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: background-color 0.2s ease;
    gap: 12px;
  }

  .logout-btn.collapsed {
    justify-content: center;
    gap: 0;
  }

  .logout-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  
  aside {
    transition: width 0.3s ease, transform 0.3s ease;
  }

  main {
    transition: margin-left 0.3s ease, width 0.3s ease;
  }

  
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden;
  }
</style>