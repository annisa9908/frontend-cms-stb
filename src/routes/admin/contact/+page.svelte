<script>
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();

  // Reactive variables for form data using Svelte stores
  let phone = '';
  let headOffice = '';
  let developmentOffice = '';
  let websiteUrl = '';
  let mapEmbed = '';
  let showSaveNotification = false;
  let showValidationError = false;

  // Logout modal states
  let showLogoutConfirm = false;
  let showLogoutSuccess = false;

  // User data for logout modal
  const userData = {
    name: 'Putri Mutiara',
    email: 'putrimutiara3010@gmail.com'
  };

  // Reactive statement to check if all fields are filled
  $: allFieldsFilled = phone.trim() !== '' && 
                      headOffice.trim() !== '' && 
                      developmentOffice.trim() !== '' && 
                      websiteUrl.trim() !== '' && 
                      mapEmbed.trim() !== '';

  // Save changes function with validation
  function saveChanges() {
    if (!allFieldsFilled) {
      showValidationError = true;
      setTimeout(() => {
        showValidationError = false;
      }, 4000);
      return;
    }
    
    // Simulate saving process
    showSaveNotification = true;
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      showSaveNotification = false;
    }, 3000);
    
    console.log('Saving contact data:', {
      phone,
      headOffice,
      developmentOffice,
      websiteUrl,
      mapEmbed
    });
  }

  // Navigation function for settings icon
  function navigateToSettings() {
    goto('/admin/dashboard-setting');
  }

  // Logout handler - shows confirmation modal
  function handleLogout() {
    showLogoutConfirm = true;
  }

  // Confirm logout - proceed with logout
  function confirmLogout() {
    showLogoutConfirm = false;
    showLogoutSuccess = true;
    console.log('Logging out...');
  }

  // Cancel logout
  function cancelLogout() {
    showLogoutConfirm = false;
  }

  // Login again - close success modal
  function loginAgain() {
    showLogoutSuccess = false;
    // Here you would typically redirect to login page
    console.log('Redirecting to login...');
  }

  // Close notification manually
  function closeNotification() {
    showSaveNotification = false;
  }

  // Close validation error manually
  function closeValidationError() {
    showValidationError = false;
  }

  // Handle modal background click for success notification
  /**
   * @param {Event} event
   */
  function handleSuccessModalClick(event) {
    if (event.target === event.currentTarget) {
      closeNotification();
    }
  }

  // Handle modal background click for validation error
  /**
   * @param {Event} event
   */
  function handleValidationModalClick(event) {
    if (event.target === event.currentTarget) {
      closeValidationError();
    }
  }

  // Toggle class to disable interaction on main content
  $: isModalOpen = showSaveNotification || showValidationError || showLogoutConfirm || showLogoutSuccess;

  // Close modal with Escape key
  /**
   * @param {KeyboardEvent} event
   */
  function handleKeyDown(event) {
    if (event.key === 'Escape' && (showSaveNotification || showValidationError)) {
      closeNotification();
      closeValidationError();
    }
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<!-- Success Notification Modal -->
{#if showSaveNotification}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[1001] p-5 box-border" on:click={handleSuccessModalClick} on:keydown={handleKeyDown}>
    <div class="bg-white rounded-2xl w-80 max-w-[90%] shadow-2xl relative">
      <div class="p-8 text-center relative">
        <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-5 flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-3xl font-semibold">check</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Changes Saved</h3>
        <p class="text-sm text-gray-600">Your changes have been saved successfully.</p>
        <button 
          on:click={closeNotification} 
          class="absolute top-3 right-3 p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
          type="button"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Validation Error Modal -->
{#if showValidationError}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-[1001] p-5 box-border" 
    on:click={handleValidationModalClick} 
    on:keydown={handleKeyDown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="validation-error-title"
  >
    <div class="bg-white rounded-xl p-8 text-center shadow-2xl relative max-w-sm w-[90%] border-2 border-red-500">
      <div class="mb-4 flex items-center justify-center">
        <div class="w-18 h-18 bg-red-50 rounded-full flex items-center justify-center">
          <span class="material-symbols-outlined text-5xl text-red-500 flex items-center justify-center">error</span>
        </div>
      </div>
      <h2 id="validation-error-title" class="text-xl font-semibold text-red-500 mb-2">Incomplete Form</h2>
      <p class="text-sm text-gray-600 mb-0">Please fill in all required fields before saving.</p>
      <button 
        on:click={closeValidationError} 
        class="absolute top-3 right-3 p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
      >
        <span class="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  </div>
{/if}

<!-- Logout Confirmation Modal -->
{#if showLogoutConfirm}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <div class="bg-white rounded-xl p-6 text-center shadow-2xl max-w-sm w-[90%] border-2" style="border-color: #2448B1;">
      <div class="mb-3">
        <span class="material-symbols-outlined text-4xl" style="color: #2448B1;">logout</span>
      </div>
      <h2 class="text-xl font-bold mb-1.5" style="color: #2448B1;">Logout</h2>
      <p class="text-sm text-gray-700 mb-4">Are you sure you want to logout?</p>
      
      <div class="flex items-center justify-center gap-2.5 bg-slate-50 p-3 rounded-lg mb-3">
        <div class="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
          <span class="material-symbols-outlined text-slate-600">person</span>
        </div>
        <div class="text-left">
          <div class="font-semibold text-slate-800 text-sm">{userData.name}</div>
          <div class="text-slate-600 text-xs">{userData.email}</div>
        </div>
      </div>
      
      <p class="text-xs text-slate-600 leading-relaxed mb-5">
        You are about to logout from the Content Management System. 
        You will need to login again to access your account.
      </p>
      
      <div class="flex gap-2.5 justify-center">
        <button 
          on:click={confirmLogout} 
          class="bg-red-600 text-white px-5 py-2.5 rounded-md cursor-pointer text-xs transition-all duration-200 hover:bg-red-700 font-bold"
        >
          Yes, Logout
        </button>
        <button 
          on:click={cancelLogout} 
          class="bg-gray-600 text-white px-5 py-2.5 rounded-md cursor-pointer text-xs transition-all duration-200 hover:bg-gray-700 font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Logout Success Modal -->
{#if showLogoutSuccess}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <div class="bg-white rounded-xl p-8 text-center shadow-2xl max-w-sm w-[90%] border-2" style="border-color: #2448B1;">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Logout Successful!</h2>
      <p class="text-sm text-gray-600 mb-6">
        You have been successfully logged out from the cms panel.
      </p>
      <button 
        on:click={loginAgain} 
        class="text-white px-6 py-3 rounded-lg cursor-pointer text-sm transition-all duration-200 font-bold"
        style="background-color: #16A34A;"
      >
        Login Again
      </button>
    </div>
  </div>
{/if}

<div class="w-full min-h-screen bg-[#ECF6F9] font-inter text-slate-800 leading-relaxed">
  <div class="p-0 pb-4 flex flex-col gap-3">
    <!-- Header Card -->
    <div class="bg-[#2448B1] rounded-lg mx-4 mt-4 p-4 shadow-md border border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-white text-xl font-bold mb-0.5 leading-tight">Contact Management</h1>
          <p class="text-white text-sm font-normal m-0">Manage contact page content</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Save Changes Button -->
          <button 
            on:click={saveChanges} 
            class="bg-green-600 hover:bg-green-700 text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-md"
            type="button"
          >
            <span class="material-symbols-outlined text-base">save</span>
            Save Changes
          </button>
          
          <!-- Settings Button -->
          <button 
            class="bg-transparent border-none p-1.5 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-center" 
            type="button" 
            on:click={navigateToSettings}
          >
            <span class="material-symbols-outlined text-base text-white cursor-pointer">settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200 mx-4">
      <!-- Phone Field -->
      <div class="mb-3 last:mb-0">
        <label for="phone" class="block mb-1 font-semibold text-gray-700 text-sm">Phone <span class="text-red-500 ml-0.5">*</span></label>
        <input 
          type="text" 
          id="phone" 
          bind:value={phone}
          placeholder="Add number phone"
          class="w-full py-2.5 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
          class:border-red-500={showValidationError && phone.trim() === ''}
          class:ring-2={showValidationError && phone.trim() === ''}
          class:ring-red-100={showValidationError && phone.trim() === ''}
        />
      </div>
      
      <!-- Head Office Field -->
      <div class="mb-3 last:mb-0">
        <label for="head_office" class="block mb-1 font-semibold text-gray-700 text-sm">Head Office <span class="text-red-500 ml-0.5">*</span></label>
        <input 
          type="text" 
          id="head_office" 
          bind:value={headOffice}
          placeholder="Add head office"
          class="w-full py-2.5 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
          class:border-red-500={showValidationError && headOffice.trim() === ''}
          class:ring-2={showValidationError && headOffice.trim() === ''}
          class:ring-red-100={showValidationError && headOffice.trim() === ''}
        />
      </div>
      
      <!-- Development Office Field -->
      <div class="mb-3 last:mb-0">
        <label for="development_office" class="block mb-1 font-semibold text-gray-700 text-sm">Development Office <span class="text-red-500 ml-0.5">*</span></label>
        <input 
          type="text" 
          id="development_office" 
          bind:value={developmentOffice}
          placeholder="Add development office"
          class="w-full py-2.5 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
          class:border-red-500={showValidationError && developmentOffice.trim() === ''}
          class:ring-2={showValidationError && developmentOffice.trim() === ''}
          class:ring-red-100={showValidationError && developmentOffice.trim() === ''}
        />
      </div>
      
      <!-- Website URL Field -->
      <div class="mb-3 last:mb-0">
        <label for="website_url" class="block mb-1 font-semibold text-gray-700 text-sm">Website URL <span class="text-red-500 ml-0.5">*</span></label>
        <input 
          type="url" 
          id="website_url" 
          bind:value={websiteUrl}
          placeholder="Add website URL"
          class="w-full py-2.5 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
          class:border-red-500={showValidationError && websiteUrl.trim() === ''}
          class:ring-2={showValidationError && websiteUrl.trim() === ''}
          class:ring-red-100={showValidationError && websiteUrl.trim() === ''}
        />
      </div>
      
      <!-- Map Embed Code Field -->
      <div class="mb-0">
        <label for="map_embed" class="block mb-1 font-semibold text-gray-700 text-sm">Map Embed Code <span class="text-red-500 ml-0.5">*</span></label>
        <textarea 
          id="map_embed" 
          bind:value={mapEmbed}
          placeholder="Paste Google Maps embed code here...."
          rows="4"
          class="w-full py-2.5 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 resize-y min-h-[80px] focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
          class:border-red-500={showValidationError && mapEmbed.trim() === ''}
          class:ring-2={showValidationError && mapEmbed.trim() === ''}
          class:ring-red-100={showValidationError && mapEmbed.trim() === ''}
        ></textarea>
      </div>
    </div>
  </div>
</div>

<style>
  @reference "tailwindcss";
  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-size: 16px;
  }

  .modal-open {
    pointer-events: none;
  }

  .modal-open > .flex-1 {
    pointer-events: none;
  }

  :global(.modal-open ~ .sidebar) {
    pointer-events: none;
  }
</style>