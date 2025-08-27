<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  // Definisi tipe untuk customer
  interface Customer {
    id: string;
    name: string;
    image: File | null;
    imagePreview: string | null;
  }

  // variable state 
  let title = '';
  let description = '';
  let customers: Customer[] = [];
  let isLoading = false;
  let showAddCustomerModal = false;
  let showSuccessModal = false;
  let showDeleteModal = false;
  let customerToDelete: string = '';
  let newCustomer: Customer = { id: '', name: '', image: null, imagePreview: null };

  // Fungsi untuk navigasi ke dashboard setting
  function goToDashboardSetting() {
    goto('/admin/dashboard-setting');
  }

  // Generate id unik untuk customer
  function generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // simpan perubahan konten utama
  function saveChanges() {
    if (!title.trim()) {
      showSuccessModal = true;
      return;
    }

    if (!description.trim()) {
      showSuccessModal = true;
      return;
    }

    isLoading = true;
    setTimeout(() => {
      showSuccessModal = true;
      console.log('Saved data:', { title, description, customers });
      isLoading = false;
    }, 2000);
  }

  // Show Add Customer Modal
  function openAddCustomerModal() {
    newCustomer = { id: generateUniqueId(), name: `Customer ${customers.length + 1}`, image: null, imagePreview: null };
    showAddCustomerModal = true;
  }

  // Close Add Customer Modal
  function closeAddCustomerModal() {
    showAddCustomerModal = false;
    newCustomer = { id: '', name: '', image: null, imagePreview: null };
  }

  // Close Success Modal
  function closeSuccessModal() {
    showSuccessModal = false;
  }

  // Close Delete Modal
  function closeDeleteModal() {
    showDeleteModal = false;
    customerToDelete = '';
  }

  // Save new customer
  function saveNewCustomer() {
    if (!newCustomer.image) {
      showSuccessModal = true;
      return;
    }
    
    customers = [...customers, { ...newCustomer }];
    showSuccessModal = true;
    closeAddCustomerModal();
  }

  // Handle customer image upload for new customer
  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showSuccessModal = true;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showSuccessModal = true;
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target?.result) {
        newCustomer = { ...newCustomer, image: file, imagePreview: e.target.result as string };
      }
    };
    reader.readAsDataURL(file);
  }

  // Handle file input click
  function handleFileInputClick(customerId: string = 'new-customer') {
    if (typeof document !== 'undefined') {
      const fileInput = document.getElementById(`file-${customerId}`) as HTMLInputElement | null;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  // Remove customer with confirmation modal
  function removeCustomer(id: string) {
    customerToDelete = id;
    showDeleteModal = true;
  }

  // Confirm delete customer
  function confirmDeleteCustomer() {
    customers = customers.filter((customer) => customer.id !== customerToDelete);
    closeDeleteModal();
    showSuccessModal = true;
  }

  // Update customer name
  function updateCustomerName(id: string, name: string) {
    customers = customers.map((customer) =>
      customer.id === id ? { ...customer, name } : customer
    );
  }

  // Handle customer image upload for existing customers
  function handleImageUploadForCustomer(event: Event, customerId: string) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showSuccessModal = true;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showSuccessModal = true;
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target?.result) {
        customers = customers.map((customer) =>
          customer.id === customerId
            ? { ...customer, image: file, imagePreview: e.target?.result as string }
            : customer
        );
        showSuccessModal = true;
      }
    };
    reader.readAsDataURL(file);
  }

  function handleModalClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeAddCustomerModal();
    }
  }

  function handleSuccessModalClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeSuccessModal();
    }
  }

  function handleDeleteModalClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeDeleteModal();
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showAddCustomerModal) {
      closeAddCustomerModal();
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown);
      
      return () => {
        window.removeEventListener('keydown', handleKeydown);
      };
    }
  });
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<div class="service-page">
  <div class="service-content">
    <!-- Page Header Card -->
    <div class="page-header-card">
      <div class="page-header-content">
        <div class="header-left">
          <div class="page-info">
            <h1>About Us Management</h1>
            <p>Manage about us page content</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-save" class:btn-loading={isLoading} disabled={isLoading} on:click={saveChanges}>
            <span class="material-symbols-outlined">save</span>
            Save Changes
          </button>
          <button class="btn-settings" on:click={goToDashboardSetting}>
            <span class="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- content editor card -->
    <div class="editor-card">
      <div class="card-header">
        <span class="material-symbols-outlined header-icon">settings</span>
        <h2>Content Editor</h2>
      </div>

      <div class="card-content">
        <div class="form-group">
          <label class="form-label" for="title-input">Title</label>
          <input 
            id="title-input"
            type="text" 
            bind:value={title} 
            class="form-input" 
            placeholder="Add title" 
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="description-input">Description</label>
          <textarea
            id="description-input"
            bind:value={description}
            class="form-input form-textarea"
            placeholder="Add description"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Customer Editor Card -->
    <div class="customer-card">
      <!-- Customer Header with Add Button -->
      <div class="customer-header">
        <div class="customer-header-left">
          <h2>Customer Editor</h2>
          <button class="btn-add" on:click={openAddCustomerModal}>
            <span class="material-symbols-outlined">add</span>
            Add Customer
          </button>
        </div>
      </div>
      
      <div class="customer-content">
        {#if customers.length === 0}
          <!-- Empty state removed - show nothing when no customers -->
        {:else}
          <div class="customer-grid">
            {#each customers as customer (customer.id)}
              <div class="customer-item">
                <div class="form-group">
                  <div class="image-upload-area">
                    {#if customer.imagePreview}
                      <div class="image-preview">
                        <img src={customer.imagePreview} alt="Customer preview" />
                        <div class="image-overlay">
                          <button
                            type="button"
                            class="btn-change-image"
                            on:click={() => handleFileInputClick(customer.id)}
                          >
                            <span class="material-symbols-outlined">edit</span>
                            Change Image
                          </button>
                          <button 
                            class="btn-remove-overlay" 
                            on:click={() => removeCustomer(customer.id)}
                            title="Remove customer"
                          >
                            <span class="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    {:else}
                      <div
                        class="upload-placeholder"
                        on:click={() => handleFileInputClick(customer.id)}
                        on:keydown={(e) => e.key === 'Enter' && handleFileInputClick(customer.id)}
                        role="button"
                        tabindex="0"
                        aria-label="Upload customer image"
                      >
                        <span class="material-symbols-outlined upload-icon">cloud_upload</span>
                        <p>Click to upload image</p>
                      </div>
                    {/if}

                    <input
                      type="file"
                      id="file-{customer.id}"
                      accept=".jpg,.jpeg,.png,.gif"
                      style="display: none;"
                      on:change={(e) => handleImageUploadForCustomer(e, customer.id)}
                    />
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Add Customer Modal -->
  {#if showAddCustomerModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-overlay" on:click={handleModalClick}>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Customer</h2>
          <button class="btn-close" on:click={closeAddCustomerModal}>
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label" for="new-customer-image">Customer Image</label>
            <div class="image-upload-area">
              {#if newCustomer.imagePreview}
                <div class="image-preview">
                  <img src={newCustomer.imagePreview} alt="New customer preview" />
                  <div class="image-overlay">
                    <button
                      type="button"
                      class="btn-change-image"
                      on:click={() => handleFileInputClick('new-customer')}
                    >
                      <span class="material-symbols-outlined">edit</span>
                      Change Image
                    </button>
                  </div>
                </div>
              {:else}
                <div
                  class="upload-placeholder"
                  on:click={() => handleFileInputClick('new-customer')}
                  on:keydown={(e) => e.key === 'Enter' && handleFileInputClick('new-customer')}
                  role="button"
                  tabindex="0"
                  aria-label="Upload customer image"
                >
                  <span class="material-symbols-outlined upload-icon">cloud_upload</span>
                  <p>Click to upload image</p>
                </div>
              {/if}
              <input
                type="file"
                id="file-new-customer"
                accept=".jpg,.jpeg,.png,.gif"
                style="display: none;"
                on:change={handleImageUpload}
              />
            </div>
            <small>Accepted formats: .JPG, .PNG, .GIF (Max 5MB)</small>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" on:click={closeAddCustomerModal}>
            Cancel
          </button>
          <button class="btn-save-modal" on:click={saveNewCustomer}>
            Save
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Success Modal -->
  {#if showSuccessModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="success-modal-overlay" on:click={handleSuccessModalClick}>
      <div class="success-modal">
        <div class="success-modal-body">
          <div class="success-icon">
            <span class="material-symbols-outlined">check</span>
          </div>
          <h3 class="success-title">Changes Saved</h3>
          <p class="success-message">Your changes have been saved successfully.</p>
          <button on:click={closeSuccessModal} class="success-close" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Delete Confirmation Modal -->
  {#if showDeleteModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-overlay" on:click={handleDeleteModalClick}>
      <div class="modal-content">
        <div class="modal-header">
          <button class="btn-close" on:click={closeDeleteModal} style="margin-left: auto;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="status-icon error">✗</div>
          <div class="status-title">Delete this customer?</div>
          <div class="status-message">This action cannot be undone</div>
          <div class="btn-group">
            <button class="btn btn-delete" on:click={confirmDeleteCustomer}>Delete</button>
            <button class="btn btn-cancel-delete" on:click={closeDeleteModal}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .service-page {
    width: 100%;
    min-height: 100vh;
    background-color: #ECF6F9;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    line-height: 1.5;
  }

  .service-content {
    padding: 20px;
    background: #ECF6F9;
    min-height: 100vh;
  }

  /* Page Header Styles - Optimized */
  .page-header-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .page-header-content {
    background: #2448B1;
    color: white;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .page-info h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 2px 0;
  }

  .page-info p {
    font-size: 12px;
    opacity: 0.9;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Button Styles - Optimized for laptop */
  .btn-save {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    background: #16A34A;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-save:hover:not(:disabled) {
    background: #059669;
  }

  .btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-save .material-symbols-outlined {
    font-size: 16px;
  }

  .btn-settings {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    padding: 7px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-settings:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .btn-settings .material-symbols-outlined {
    font-size: 18px;
  }

  .btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #16A34A;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-add:hover {
    background: #059669;
  }

  .btn-add .material-symbols-outlined {
    font-size: 16px;
  }

  .btn-remove {
    display: flex;
    align-items: center;
    padding: 4px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 10px;
  }

  .btn-remove:hover {
    background: #dc2626;
  }

  .btn-change-image {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 6px 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-change-image:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  .btn-change-image .material-symbols-outlined {
    font-size: 14px;
  }

  .btn-cancel {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cancel:hover {
    background: #4b5563;
  }

  .btn-save-modal {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #1E3A8A;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-save-modal:hover {
    background: #1e40af;
  }

  .btn-close {
    display: flex;
    align-items: center;
    padding: 4px;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .btn-close:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .btn-close .material-symbols-outlined {
    font-size: 18px;
  }

  /* Card Styles - Optimized */
  .editor-card, .customer-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 10px 10px 0 0;
  }

  .header-icon {
    color: #2448B1;
    font-size: 20px;
  }

  .card-header h2 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .card-content {
    padding: 20px;
  }

  /* Customer Card Specific - Optimized */
  .customer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 10px 10px 0 0;
  }

  .customer-header-left h2 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .customer-content {
    padding: 20px;
  }

  /* Form Styles - Optimized */
  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 5px;
  }

  .form-input {
    width: 100%;
    padding: 9px 11px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    transition: all 0.2s ease;
    background: white;
    color: #1e293b;
  }

  .form-input:focus {
    outline: none;
    border-color: #2448B1;
    box-shadow: 0 0 0 3px rgba(36, 72, 177, 0.1);
  }

  .form-textarea {
    min-height: 90px;
    resize: vertical;
  }

  /* Customer Grid - Optimized */
  .customer-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .customer-item {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px;
    background: #f8fafc;
  }

  .customer-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .customer-item-header h3 {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  /* Image Upload Styles - Optimized */
  .image-upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s ease;
  }

  .image-upload-area:hover {
    border-color: #2448B1;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .upload-placeholder:hover {
    background: #f8fafc;
  }

  .upload-icon {
    font-size: 28px;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .upload-placeholder p {
    font-size: 12px;
    color: #374151;
    margin: 0;
  }

  .upload-placeholder small {
    font-size: 10px;
    color: #6b7280;
  }

  .image-preview {
    position: relative;
    width: 100%;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
  }

  .image-preview img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 4px;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .image-preview:hover .image-overlay {
    opacity: 1;
  }

  .btn-remove-overlay {
    display: flex;
    align-items: center;
    padding: 6px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 12px;
  }

  .btn-remove-overlay:hover {
    background: #dc2626;
  }

  .btn-remove-overlay .material-symbols-outlined {
    font-size: 14px;
  }

  /* Modal Styles - Optimized */
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
    z-index: 2000;
    padding: 16px;
  }

  .modal-content {
    background: white;
    border-radius: 10px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 450px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
  }

  .modal-header h2 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  /* Success Modal Styles - Optimized */
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
    border-radius: 10px;
    width: 350px;
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
    padding: 28px 20px;
    text-align: center;
    position: relative;
  }

  .success-icon {
    width: 60px;
    height: 60px;
    background: #10b981;
    border-radius: 50%;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success-icon .material-symbols-outlined {
    color: white;
    font-size: 28px;
    font-weight: 600;
  }

  .success-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 6px 0;
  }

  .success-message {
    font-size: 13px;
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
    border-radius: 4px;
    color: #9ca3af;
    transition: all 0.2s;
  }

  .success-close:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  .success-close .material-symbols-outlined {
    font-size: 16px;
  }

  /* Delete Modal Styles - Optimized */
  .status-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: white;
  }

  .status-icon.error {
    background: #ef4444;
  }

  .status-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1f2937;
    text-align: center;
  }

  .status-message {
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 24px;
    text-align: center;
  }

  .btn-group {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .btn {
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s;
    min-width: 70px;
  }

  .btn-delete {
    background: #FF0000;
    color: white;
  }

  .btn-delete:hover {
    background: #dc2626;
  }

  .btn-cancel-delete {
    background: #5A5A5A;
    color: white;
  }

  .btn-cancel-delete:hover {
    background: #4b5563;
  }

  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 20px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
    background: transparent !important;
  }

  /* Desktop/Laptop optimizations */
  @media (min-width: 1024px) {
    .service-content {
      padding: 24px;
    }
    
    .page-header-content {
      padding: 20px 24px;
    }
    
    .card-header {
      padding: 18px 24px;
    }
    
    .card-content, .customer-content {
      padding: 24px;
    }
  }

  /* Smaller laptop screens */
  @media (max-width: 1366px) {
    .page-info h1 {
      font-size: 18px;
    }
    
    .customer-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
  }

  /* Tablet adjustments */
  @media (max-width: 768px) {
    .service-content {
      padding: 16px;
    }

    .page-header-content {
      padding: 14px 16px;
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }

    .header-actions {
      justify-content: flex-end;
    }

    .btn-save {
      width: 100%;
      justify-content: center;
    }

    .card-header {
      padding: 14px 16px;
    }

    .card-content {
      padding: 16px;
    }

    .customer-content {
      padding: 16px;
    }

    .customer-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
      padding: 14px 16px;
    }

    .customer-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .modal-content {
      margin: 16px;
      max-width: none;
      width: auto;
    }

    .success-modal {
      width: 95%;
      margin: 16px;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    .service-content {
      padding: 12px;
    }

    .page-info h1 {
      font-size: 16px;
    }

    .customer-item {
      padding: 8px;
    }

    .success-modal-body {
      padding: 20px 16px;
    }
    
    .upload-placeholder {
      padding: 16px;
    }
    
    .image-preview {
      height: 100px;
    }
    
    .form-input {
      padding: 8px 10px;
      font-size: 12px;
    }
    
    .btn-save, .btn-add {
      font-size: 11px;
      padding: 6px 12px;
    }
  }
</style>