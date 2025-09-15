<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Definisi tipe untuk customer
  interface Customer {
    id: string;
    name: string;
    image: File | null;
    imagePreview: string | null;
  }

  // Variable state 
  let title = $state('');
  let description = $state('');
  let customers = $state<Customer[]>([]);
  let showAddCustomerModal = $state(false);
  let showSuccessModal = $state(false);
  let showDeleteModal = $state(false);
  let customerToDelete = $state('');
  let newCustomer = $state<Customer>({ id: '', name: '', image: null, imagePreview: null });

  // Fungsi untuk navigasi ke dashboard setting
  function goToDashboardSetting() {
    goto('/admin/dashboard-setting');
  }

  // Generate id unik untuk customer
  function generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Simpan perubahan konten utama
  function saveChanges() {
    showSuccessModal = true; // Notifikasi sukses langsung muncul
    console.log('Saved data:', { title, description, customers });
    setTimeout(() => (showSuccessModal = false), 3000); // Auto-close after 3 seconds
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
      alert('Please upload a customer image.');
      return;
    }
    
    customers = [...customers, { ...newCustomer }];
    closeAddCustomerModal();
  }

  // Handle customer image upload for new customer
  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB. Please select a smaller file.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file format. Please select a JPG, PNG, or SVG file.');
      return;
    }

    console.log('Customer image selected:', file.name);
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
    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB. Please select a smaller file.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file format. Please select a JPG, PNG, or SVG file.');
      return;
    }

    console.log('Customer image updated:', file.name);
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target?.result) {
        customers = customers.map((customer) =>
          customer.id === customerId
            ? { ...customer, image: file, imagePreview: e.target?.result as string }
            : customer
        );
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

  function handleDragOver(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.style.borderColor = '#2448B1';
    target.style.background = '#eff6ff';
  }

  function handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.style.borderColor = '#d1d5db';
    target.style.background = '#f9fafb';
  }

  function handleDrop(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.style.borderColor = '#d1d5db';
    target.style.background = '#f9fafb';

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 5MB. Please select a smaller file.');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file format. Please select a JPG, PNG, or SVG file.');
        return;
      }

      console.log('File dropped:', file.name);
      const reader = new FileReader();
      reader.onload = function(e: ProgressEvent<FileReader>) {
        const result = e.target?.result as string;
        newCustomer = { ...newCustomer, image: file, imagePreview: result };
      };
      reader.readAsDataURL(file);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showAddCustomerModal) {
      closeAddCustomerModal();
    }
    if (event.key === 'Escape' && showDeleteModal) {
      closeDeleteModal();
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

<div class="w-full min-h-screen bg-slate-100 font-inter text-slate-800 leading-relaxed">
  <div class="p-0 pb-4 flex flex-col gap-3">
    <!-- Page Header Card -->
    <div class="bg-[#2448B1] rounded-lg mx-4 mt-4 p-4 shadow-md border border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-white text-xl font-bold mb-0.5 leading-tight">About Us Management</h1>
          <p class="text-white text-sm font-normal m-0">Manage about us page content</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            on:click={saveChanges} 
            class="bg-green-600 hover:bg-green-700 text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-md"
            type="button"
          >
            <span class="material-symbols-outlined text-base">save</span>
            Save Changes
          </button>
          
          <button 
            class="bg-transparent border-none p-1.5 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-center" 
            type="button" 
            on:click={goToDashboardSetting}
          >
            <span class="material-symbols-outlined text-base text-white cursor-pointer">settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Editor Card -->
    <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200 mx-4">
      <h3 class="text-base font-semibold text-gray-800 mb-3">Content Editor</h3>
      
      <div class="mb-3 last:mb-0">
        <label for="title-input" class="block mb-1 font-semibold text-gray-700 text-xs">Title</label>
        <input 
          type="text" 
          id="title-input" 
          bind:value={title}
          placeholder="Enter title"
          class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
        />
      </div>
      
      <div class="mb-0">
        <label for="description-input" class="block mb-1 font-semibold text-gray-700 text-xs">Description</label>
        <textarea 
          id="description-input" 
          bind:value={description}
          placeholder="Enter description"
          rows="3"
          class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 resize-y min-h-[60px] focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
        ></textarea>
      </div>
    </div>

    <!-- Customer Editor Card -->
    <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200 mx-4">
      <h3 class="text-base font-semibold text-gray-800 mb-3">Customer Editor</h3>
      
      <button 
        on:click={openAddCustomerModal} 
        class="bg-green-600 hover:bg-green-700 text-white border-none py-1.5 px-2.5 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1 transition-colors mb-4"
        type="button"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Add Customer
      </button>
      
      <div class="customer-content">
        {#if customers.length === 0}
          <!-- Empty state removed - show nothing when no customers -->
        {:else}
          <div class="customer-grid grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {#each customers as customer (customer.id)}
              <div class="customer-item border border-[#e2e8f0] rounded-lg p-2 bg-[#f8fafc]">
                <div class="form-group mb-4">
                  <div class="image-upload-area border-2 border-dashed border-[#d1d5db] rounded-lg overflow-hidden hover:border-[#2448B1]">
                    {#if customer.imagePreview}
                      <div class="image-preview relative w-full h-[130px] flex items-center justify-center bg-[#f8fafc] group">
                        <img src={customer.imagePreview} alt="Customer preview" class="max-w-[90%] max-h-[90%] object-contain rounded" />
                        <div class="image-overlay absolute inset-0 bg-black/60 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            class="btn-change-image flex items-center gap-1 px-2.5 py-1.5 bg-[#374151] text-white border-none rounded text-[10px] cursor-pointer hover:bg-[#4b5563]"
                            on:click={() => handleFileInputClick(customer.id)}
                          >
                            <span class="material-symbols-outlined text-[14px]">edit</span>
                            Change Image
                          </button>
                          <button 
                            class="btn-remove-overlay flex items-center p-1.5 bg-[#ef4444] text-white border-none rounded cursor-pointer text-[12px] hover:bg-[#dc2626]" 
                            on:click={() => removeCustomer(customer.id)}
                            title="Remove customer"
                          >
                            <span class="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </div>
                    {:else}
                      <div
                        class="upload-placeholder flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-[#f8fafc]"
                        on:click={() => handleFileInputClick(customer.id)}
                        on:keydown={(e) => e.key === 'Enter' && handleFileInputClick(customer.id)}
                        role="button"
                        tabindex="0"
                        aria-label="Upload customer image"
                      >
                        <span class="material-symbols-outlined upload-icon text-[28px] text-[#6b7280] mb-1.5">cloud_upload</span>
                        <p class="text-[12px] text-[#374151] m-0">Click to upload image</p>
                      </div>
                    {/if}

                    <input
                      type="file"
                      id="file-{customer.id}"
                      accept="image/jpeg,image/png,image/svg+xml"
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
    <div class="modal-overlay fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4" on:click={handleModalClick} role="button" tabindex="0" on:keydown={() => {}}>
      <div class="modal-content bg-white rounded-[10px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] max-w-[450px] w-full max-h-[90vh] overflow-y-auto">
        <div class="modal-header flex justify-between items-center p-4 px-5 border-b border-gray-200">
          <h2 class="text-base font-semibold text-gray-800 m-0">Add Customer</h2>
          <button class="btn-close bg-transparent border-none cursor-pointer p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700" on:click={closeAddCustomerModal}>
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        
        <div class="modal-body p-4 px-5">
          <div class="mb-3 last:mb-0">
            <label class="form-label block mb-1 font-semibold text-gray-700 text-xs" for="new-customer-image">Customer Image</label>
            <div 
              class="image-upload-area border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-all duration-200 relative hover:border-[#2448B1] hover:bg-slate-50" 
              on:click={() => handleFileInputClick('new-customer')}
              on:dragover={handleDragOver}
              on:dragleave={handleDragLeave}
              on:drop={handleDrop}
            >
              {#if newCustomer.imagePreview}
                <div class="flex flex-col items-center">
                  <img src={newCustomer.imagePreview} alt="New customer preview" class="w-32 h-24 object-contain rounded-md shadow-sm mb-2" />
                  <p class="text-[#2448B1] text-xs font-medium">Click to change image</p>
                </div>
              {:else}
                <div class="text-gray-500 text-xs">
                  <span>Click to upload image</span>
                </div>
              {/if}
              <input
                type="file"
                id="file-new-customer"
                accept="image/jpeg,image/png,image/svg+xml"
                style="display: none;"
                on:change={handleImageUpload}
              />
            </div>
            <p class="text-gray-500 text-xs mt-2 text-center">File must be JPG, PNG, or SVG. Maximum size: 5MB.</p>
          </div>
        </div>

        <div class="flex justify-end gap-2 p-4 px-5 border-t border-gray-200">
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white"
            on:click={closeAddCustomerModal}>
            Cancel
          </button>
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white"
            on:click={saveNewCustomer}>
            Save
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Success Notification Modal -->
  {#if showSuccessModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-5 box-border" on:click={handleSuccessModalClick}>
      <div class="bg-white rounded-2xl w-80 max-w-[90%] shadow-2xl relative">
        <div class="p-8 text-center relative">
          <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-5 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-3xl font-semibold">check</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Changes Saved</h3>
          <p class="text-sm text-gray-600">Your changes have been saved.</p>
          <button 
            on:click={closeSuccessModal} 
            class="absolute top-3 right-3 p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
            type="button"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Delete Confirmation Modal -->
  {#if showDeleteModal}
    <div class="fixed inset-0 w-full h-full bg-black/60 flex items-center justify-center z-[1001]" on:click={handleDeleteModalClick} role="button" tabindex="0" on:keydown={() => {}}>
      <div class="bg-white rounded-[10px] w-[350px] max-w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] relative p-6 text-center">
        <button class="absolute top-3 right-3 text-gray-400 bg-none border-none cursor-pointer p-1.5 rounded hover:bg-gray-100 hover:text-gray-600" on:click={closeDeleteModal}>
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
        <div class="w-[60px] h-[60px] bg-[#ff0000] rounded-full mx-auto mb-4 flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-[28px] font-bold">close</span>
        </div>
        <h3 class="text-[18px] font-bold text-[#1e293b] m-0 mb-2">Delete this service?</h3>
        <p class="text-[13px] text-[#6b7280] m-0">This action cannot be undone.</p>
        <button class="bg-[#ff0000] text-white px-6 py-2 rounded-md text-[12px] font-bold mt-4 cursor-pointer hover:bg-[#dc2626]" on:click={confirmDeleteCustomer}>Delete</button>
      </div>
    </div>
  {/if}
</div>

<style>
  @reference "tailwindcss";
  
  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 16px;
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

  .btn-cancel, .btn-save-modal {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  /* Desktop/Laptop optimizations */
  @media (min-width: 1024px) {
    .service-content {
      @apply p-6;
    }
  }

  /* Smaller laptop screens */
  @media (max-width: 1366px) {
    .page-info h1 {
      @apply text-[18px];
    }
    
    .customer-grid {
      @apply grid-cols-[repeat(auto-fill,minmax(160px,1fr))];
    }
  }

  /* Tablet adjustments */
  @media (max-width: 768px) {
    .service-content {
      @apply p-4;
    }

    .page-header-content {
      @apply flex-col gap-3 items-stretch;
    }

    .header-actions {
      @apply justify-end;
    }

    .btn-save {
      @apply w-full justify-center;
    }

    .customer-header {
      @apply flex-col gap-3 items-stretch;
    }

    .customer-grid {
      @apply grid-cols-1 gap-3;
    }

    .modal-content {
      @apply m-4 max-w-none w-auto;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    .service-content {
      @apply p-3;
    }

    .page-info h1 {
      @apply text-[16px];
    }

    .customer-item {
      @apply p-2;
    }
    
    .upload-placeholder {
      @apply p-4;
    }
    
    .image-preview {
      @apply h-[100px];
    }
    
    .form-input {
      @apply px-2.5 py-2 text-[12px];
    }
    
    .btn-save, .btn-add {
      @apply text-[11px] px-3 py-1.5;
    }
  }
</style>