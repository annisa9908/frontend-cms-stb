<script>
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  
  const dispatch = createEventDispatcher();
  
  // Reactive variables for form data
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
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<!-- Success Notification Modal -->
{#if showSaveNotification}
  <div class="success-modal-overlay">
    <div class="success-modal">
      <div class="success-modal-body">
        <div class="success-icon">
          <span class="material-symbols-outlined">check</span>
        </div>
        <h3 class="success-title">Changes Saved</h3>
        <p class="success-message">Your changes have been saved successfully.</p>
        <button on:click={closeNotification} class="success-close" type="button">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Validation Error Modal -->
{#if showValidationError}
  <div class="notification-overlay">
    <div class="notification-modal error-modal">
      <div class="notification-icon">
        <span class="material-symbols-outlined error-icon">error</span>
      </div>
      <h2 class="notification-title error-title">Incomplete Form</h2>
      <p class="notification-message">Please fill in all required fields before saving.</p>
      <button on:click={closeValidationError} class="notification-close">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  </div>
{/if}

<!-- Logout Confirmation Modal -->
{#if showLogoutConfirm}
  <div class="notification-overlay">
    <div class="logout-modal">
      <div class="logout-icon">
        <span class="material-symbols-outlined">logout</span>
      </div>
      <h2 class="logout-title">Logout</h2>
      <p class="logout-question">Are you sure you want to logout?</p>
      
      <div class="user-info">
        <div class="user-avatar">
          <span class="material-symbols-outlined">person</span>
        </div>
        <div class="user-details">
          <div class="user-name">{userData.name}</div>
          <div class="user-email">{userData.email}</div>
        </div>
      </div>
      
      <p class="logout-warning">
        You are about to logout from the Content Management System. 
        You will need to login again to access your account.
      </p>
      
      <div class="logout-buttons">
        <button on:click={confirmLogout} class="logout-confirm-btn">
          Yes, Logout
        </button>
        <button on:click={cancelLogout} class="logout-cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Logout Success Modal -->
{#if showLogoutSuccess}
  <div class="notification-overlay">
    <div class="logout-success-modal">
      <h2 class="success-title">Logout Successful!</h2>
      <p class="success-message">
        You have been successfully logged out from the cms panel.
      </p>
      <button on:click={loginAgain} class="login-again-btn">
        Login Again
      </button>
    </div>
  </div>
{/if}

<div class="app">
  <!-- Main Content -->
  <div class="main-content">
    <!-- Header Bar with Container -->
    <div class="header-container">
      <div class="header-card">
        <div class="header-left">
          <div class="page-title">Contact Management</div>
          <div class="page-subtitle">Manage contact page content</div>
        </div>
        <div class="header-right">
          <!-- Save Changes Button -->
          <button 
            on:click={saveChanges} 
            class="save-changes-btn" 
            class:disabled={!allFieldsFilled}
            title={!allFieldsFilled ? 'Please fill in all fields' : 'Save changes'}
          >
            <span class="material-symbols-outlined">save</span>
            Save Changes
          </button>
          
          <!-- Settings Button with Navigation -->
          <button 
            on:click={navigateToSettings}
            class="settings-button"
            title="Go to Dashboard Settings"
          >
            <span class="material-symbols-outlined settings-icon">settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <div class="form-container">
        
        <!-- Phone Field -->
        <div class="form-group">
          <label for="phone">Phone <span class="required">*</span></label>
          <input 
            type="text" 
            id="phone" 
            bind:value={phone}
            placeholder="Add number phone"
            class:error={showValidationError && phone.trim() === ''}
          />
        </div>
        
        <!-- Head Office Field -->
        <div class="form-group">
          <label for="head_office">Head Office <span class="required">*</span></label>
          <input 
            type="text" 
            id="head_office" 
            bind:value={headOffice}
            placeholder="Add head office"
            class:error={showValidationError && headOffice.trim() === ''}
          />
        </div>
        
        <!-- Development Office Field -->
        <div class="form-group">
          <label for="development_office">Development Office <span class="required">*</span></label>
          <input 
            type="text" 
            id="development_office" 
            bind:value={developmentOffice}
            placeholder="Add development office"
            class:error={showValidationError && developmentOffice.trim() === ''}
          />
        </div>
        
        <!-- Website URL Field -->
        <div class="form-group">
          <label for="website_url">Website URL <span class="required">*</span></label>
          <input 
            type="url" 
            id="website_url" 
            bind:value={websiteUrl}
            placeholder="Add website URL"
            class:error={showValidationError && websiteUrl.trim() === ''}
          />
        </div>
        
        <!-- Map Embed Code Field -->
        <div class="form-group">
          <label for="map_embed">Map Embed Code <span class="required">*</span></label>
          <textarea 
            id="map_embed" 
            bind:value={mapEmbed}
            placeholder="paste Google Maps embed code here...."
            class:error={showValidationError && mapEmbed.trim() === ''}
          ></textarea>
        </div>
        
      </div>
    </div>
  </div>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #ECF6F9;
    color: #1f2937;
  }

  .app {
    display: flex;
    min-height: 100vh;
    background-color: #ECF6F9;
  }

  /* Success Modal Styles - Optimized for laptop screens */
  .success-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    backdrop-filter: blur(4px);
  }

  .success-modal {
    background: white;
    border-radius: 16px;
    width: 320px;
    max-width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    position: relative;
    transform: translateY(-50px) scale(0.95);
    animation: modalSlideIn 0.3s ease-out forwards;
  }

  @keyframes modalSlideIn {
    to {
      transform: translateY(0) scale(1);
    }
  }

  .success-modal-body {
    padding: 32px 24px;
    text-align: center;
    position: relative;
  }

  .success-icon {
    width: 64px;
    height: 64px;
    background: #10b981;
    border-radius: 50%;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success-icon .material-symbols-outlined {
    color: white;
    font-size: 32px;
    font-weight: 600;
  }

  .success-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  .success-message {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  .success-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    color: #9ca3af;
    transition: all 0.2s;
  }

  .success-close:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  .success-close .material-symbols-outlined {
    font-size: 18px;
  }

  /* Notification Modal - Optimized */
  .notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .notification-modal {
    background: white;
    border-radius: 12px;
    padding: 32px 24px;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    position: relative;
    max-width: 350px;
    width: 90%;
    animation: modalSlideIn 0.3s ease-out;
  }

  .error-modal {
    border: 2px solid #ef4444;
  }

  .notification-icon {
    margin-bottom: 16px;
  }

  .error-icon {
    font-size: 48px !important;
    color: #ef4444;
    background: #fef2f2;
    border-radius: 50%;
    padding: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
  }

  .notification-title {
    font-size: 20px;
    font-weight: 600;
    color: #10b981;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .error-title {
    color: #ef4444;
  }

  .notification-message {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 0;
    line-height: 1.5;
  }

  .notification-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .notification-close:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  /* Logout Confirmation Modal - Optimized */
  .logout-modal {
    background: white;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 380px;
    width: 90%;
    animation: modalSlideIn 0.3s ease-out;
    border: 2px solid #2563eb;
  }

  .logout-icon {
    margin-bottom: 12px;
  }

  .logout-icon .material-symbols-outlined {
    font-size: 40px !important;
    color: #2563eb;
  }

  .logout-title {
    font-size: 20px;
    font-weight: 700;
    color: #2563eb;
    margin-bottom: 6px;
  }

  .logout-question {
    font-size: 14px;
    color: #374151;
    margin-bottom: 16px;
  }

  .user-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #f8fafc;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    background: #e2e8f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-avatar .material-symbols-outlined {
    font-size: 24px !important;
    color: #64748b;
  }

  .user-details {
    text-align: left;
  }

  .user-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;
  }

  .user-email {
    color: #64748b;
    font-size: 12px;
  }

  .logout-warning {
    font-size: 12px;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .logout-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .logout-confirm-btn {
    background: #dc2626;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    transition: all 0.2s ease;
  }

  .logout-confirm-btn:hover {
    background: #b91c1c;
  }

  .logout-cancel-btn {
    background: #6b7280;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    transition: all 0.2s ease;
  }

  .logout-cancel-btn:hover {
    background: #4b5563;
  }

  /* Logout Success Modal - Optimized */
  .logout-success-modal {
    background: white;
    border-radius: 12px;
    padding: 32px 24px;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 350px;
    width: 90%;
    animation: modalSlideIn 0.3s ease-out;
    border: 2px solid #2563eb;
  }

  .login-again-btn {
    background: #16a34a;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .login-again-btn:hover {
    background: #15803d;
  }

  /* Required asterisk */
  .required {
    color: #ef4444;
    margin-left: 2px;
  }

  /* Error state for inputs */
  .form-group input.error,
  .form-group textarea.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  /* Main Content - Optimized for laptop screens */
  .main-content {
    flex: 1;
    background-color: #ECF6F9;
    min-height: 100vh;
  }

  /* Header Container - Reduced padding for better laptop fit */
  .header-container {
    padding: 16px 24px 20px 24px;
  }

  .header-card {
    background: #2448B1;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .header-left {
    flex: 1;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .page-title {
    color: white;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 2px;
    line-height: 1.2;
  }

  .page-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 400;
  }

  .save-changes-btn {
    background: #16a34a;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .save-changes-btn:hover:not(.disabled) {
    background: #15803d;
  }

  .save-changes-btn.disabled {
    background: #16a34a;
    cursor: not-allowed;
  }

  .save-changes-btn .material-symbols-outlined {
    font-size: 16px;
  }

  /* Settings Button - Optimized */
  .settings-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .settings-icon {
    font-size: 20px;
    color: white;
    transition: all 0.2s ease;
  }

  .settings-button:hover .settings-icon {
    color: #d1d5db;
    transform: rotate(90deg);
  }

  /* Content Area - Optimized spacing */
  .content-area {
    padding: 0 24px 24px 24px;
    min-height: calc(100vh - 120px);
  }

  .form-container {
    background: white;
    border-radius: 10px;
    padding: 28px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    width: 100%;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
    line-height: 1.4;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    color: #374151;
    background: white;
    transition: all 0.2s ease;
    font-family: inherit;
    line-height: 1.5;
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: #9ca3af;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #2448B1;
    box-shadow: 0 0 0 3px rgba(36, 72, 177, 0.1);
  }

  .form-group textarea {
    height: 100px;
    resize: vertical;
    min-height: 100px;
  }

  /* Desktop/Laptop optimizations */
  @media (min-width: 1024px) {
    .form-container {
      padding: 32px;
    }
    
    .header-container {
      padding: 20px 32px 24px 32px;
    }
    
    .content-area {
      padding: 0 32px 28px 32px;
    }
  }

  /* Responsive for smaller laptops */
  @media (max-width: 1366px) {
    .page-title {
      font-size: 22px;
    }
  }

  /* Tablet adjustments */
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
    }
    
    .header-container {
      padding: 12px 16px 16px 16px;
    }
    
    .header-card {
      padding: 16px 20px;
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .header-left {
      flex: none;
    }
    
    .header-right {
      justify-content: center;
    }
    
    .content-area {
      padding: 0 16px 20px 16px;
    }
    
    .form-container {
      padding: 24px 20px;
    }
    
    .page-title {
      font-size: 20px;
    }

    .success-modal {
      width: 95%;
      margin: 16px;
    }

    .success-modal-body {
      padding: 24px 20px;
    }
    
    .logout-buttons {
      flex-direction: column;
    }
    
    .logout-confirm-btn, .logout-cancel-btn {
      width: 100%;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    .success-modal-body {
      padding: 20px 16px;
    }
    
    .form-container {
      padding: 20px 16px;
    }
    
    .header-card {
      padding: 14px 16px;
    }
    
    .page-title {
      font-size: 18px;
    }
    
    .save-changes-btn {
      padding: 8px 12px;
      font-size: 11px;
    }
    
    .form-group input,
    .form-group textarea {
      padding: 10px 12px;
      font-size: 13px;
    }
  }
</style>