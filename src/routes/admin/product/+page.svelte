<script lang="ts">
  import { goto } from '$app/navigation';

  // Types
  interface Product {
    id: number;
    name: string;
    image: string | null;
  }

  // Reactive states using runes
  let products = $state<Product[]>([
    { id: 1, name: 'TACTICAL CHAT', image: null },
    { id: 2, name: 'E - OFFICE', image: null }
  ]);

  let sectionTitle = $state<string>('');
  let sectionDescription = $state<string>('');

  // Modal states
  let showAddModal = $state<boolean>(false);
  let showEditModal = $state<boolean>(false);
  let showDeleteModal = $state<boolean>(false);
  let showSuccessModal = $state<boolean>(false);
  let showErrorModal = $state<boolean>(false);

  // Form data
  let productName = $state<string>('');
  let editProductName = $state<string>('');
  let currentEditId = $state<number | null>(null);
  let currentDeleteId = $state<number | null>(null);
  let currentImage = $state<string | null>(null);
  let editCurrentImage = $state<string | null>(null);

  // Navigation to profile settings
  function goToProfileSettings(): void {
    goto('/admin/dashboard-setting');
  }

  // Image handling functions
  function handleImageUpload(event: Event, isEdit: boolean = false): void {
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

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      if (isEdit) {
        editCurrentImage = result;
      } else {
        currentImage = result;
      }
    };
    reader.readAsDataURL(file);
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

  function handleDrop(event: DragEvent, isEdit: boolean = false): void {
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
        if (isEdit) {
          editCurrentImage = result;
        } else {
          currentImage = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage(isEdit: boolean = false): void {
    if (isEdit) {
      editCurrentImage = null;
    } else {
      currentImage = null;
    }
  }

  // Functions
  function saveChanges(): void {
    console.log('Saving changes...');
    showSuccessModal = true;
  }

  function closeSuccessModal(): void {
    showSuccessModal = false;
  }

  function closeErrorModal(): void {
    showErrorModal = false;
  }

  function addProduct(): void {
    showAddModal = true;
  }

  function closeAddModal(): void {
    showAddModal = false;
    productName = '';
    currentImage = null;
  }

  function saveProduct(): void {
    if (!productName.trim()) {
      alert('Please enter product name!');
      return;
    }

    products = [...products, {
      id: Date.now(),
      name: productName.trim(),
      image: currentImage
    }];

    closeAddModal();
    showSuccessModal = true;
  }

  function editProduct(id: number): void {
    const product = products.find((p: Product) => p.id === id);
    if (product) {
      currentEditId = id;
      editProductName = product.name;
      editCurrentImage = product.image;
      showEditModal = true;
    }
  }

  function closeEditModal(): void {
    showEditModal = false;
    editProductName = '';
    currentEditId = null;
    editCurrentImage = null;
  }

  function updateProduct(): void {
    if (!editProductName.trim()) {
      alert('Please enter product name!');
      return;
    }

    products = products.map((p: Product) =>
      p.id === currentEditId
        ? { ...p, name: editProductName.trim(), image: editCurrentImage }
        : p
    );

    closeEditModal();
    showSuccessModal = true;
  }

  function deleteProduct(id: number): void {
    currentDeleteId = id;
    showDeleteModal = true;
  }

  function closeDeleteModal(): void {
    showDeleteModal = false;
    currentDeleteId = null;
  }

  function confirmDelete(): void {
    products = products.filter((p: Product) => p.id !== currentDeleteId);
    closeDeleteModal();
    showSuccessModal = true;
  }

  // Event handlers for modal
  function handleModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<!-- Success Modal -->
{#if showSuccessModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-5 box-border" role="dialog" aria-modal="true">
    <div class="bg-white rounded-2xl w-80 max-w-[90%] shadow-2xl relative" on:click|stopPropagation>
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
          aria-label="Close success modal"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Error Modal -->
{#if showErrorModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-5 box-border" role="dialog" aria-modal="true">
    <div class="bg-white rounded-xl p-5 text-center shadow-2xl w-80 max-w-[90%]" on:click|stopPropagation>
      <div class="w-12 h-12 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span class="material-symbols-outlined text-white text-2xl font-bold">close</span>
      </div>
      <h2 class="text-base font-semibold text-gray-800 mb-2">Title is required!</h2>
      <p class="text-sm text-gray-600 mb-4">Please enter a title before saving.</p>
      <button 
        class="bg-red-500 text-white px-4 py-2 rounded-md font-semibold text-sm min-w-[70px]" 
        on:click={closeErrorModal}
        type="button"
        aria-label="Close error modal"
      >
        OK
      </button>
    </div>
  </div>
{/if}

<div class="w-full min-h-screen bg-slate-100 font-inter text-slate-800 leading-relaxed">
  <div class="p-0 pb-4 flex flex-col gap-3">
    <!-- Header -->
    <div class="bg-[#2448B1] rounded-lg mx-4 mt-4 p-4 shadow-md border border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-white text-xl font-bold mb-0.5 leading-tight">Products</h1>
          <p class="text-white text-sm font-normal m-0">Manage products page content</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            class="bg-green-600 hover:bg-green-700 text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-md" 
            on:click={saveChanges}
            type="button"
            aria-label="Save changes"
          >
            <span class="material-symbols-outlined text-base">save</span>
            Save Changes
          </button>
          <button 
            class="bg-transparent border-none p-1.5 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-center" 
            type="button" 
            on:click={goToProfileSettings}
            aria-label="Go to settings"
          >
            <span class="material-symbols-outlined text-base text-white cursor-pointer">settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section Settings -->
    <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200 mx-4">
      <h3 class="text-base font-semibold text-gray-800 mb-3">Section Settings</h3>
      
      <div class="mb-3 last:mb-0">
        <label for="section_title" class="block mb-1 font-semibold text-gray-700 text-xs">Section Title</label>
        <input 
          type="text" 
          id="section_title"
          bind:value={sectionTitle}
          placeholder="Enter section title"
          class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
        />
      </div>
      
      <div class="mb-0">
        <label for="section_description" class="block mb-1 font-semibold text-gray-700 text-xs">Section Description</label>
        <textarea 
          id="section_description"
          bind:value={sectionDescription}
          placeholder="Enter section description"
          rows="3"
          class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 resize-y min-h-[60px] focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
        ></textarea>
      </div>
    </div>

    <!-- Manage Products -->
    <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200 mx-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-base font-semibold text-gray-800">Manage Products</h3>
        <button 
          class="bg-green-600 hover:bg-green-700 text-white border-none py-1.5 px-2.5 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1 transition-colors"
          on:click={addProduct}
          type="button"
          aria-label="Add product"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          Add Product
        </button>
      </div>

      <!-- Products Grid -->
      <div class="border border-gray-200 rounded-md overflow-hidden">
        <div class="bg-[#2448B1] text-white grid grid-cols-[70px_1fr_100px] p-2.5 font-semibold text-xs">
          <div>Image</div>
          <div class="text-white">Product Name</div>
          <div>Actions</div>
        </div>
        
        {#each products as product (product.id)}
          <div class="grid grid-cols-[70px_1fr_100px] p-2.5 border-b border-gray-200 last:border-b-0 items-center bg-white hover:bg-gray-50">
            <div>
              {#if product.image}
                <div class="w-10 h-10 rounded overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} class="w-full h-full object-cover" />
                </div>
              {:else}
                <div class="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center text-gray-400 text-[9px] font-medium border border-dashed border-gray-300 text-center leading-tight">
                  No Image
                </div>
              {/if}
            </div>
            <div class="text-xs text-gray-700">{product.name}</div>
            <div class="flex gap-1">
              <button 
                class="py-1 px-2 border-none rounded bg-[#1E3A8A] text-white cursor-pointer text-[10px] font-semibold transition-all duration-200"
                on:click={() => editProduct(product.id)}
                type="button"
                aria-label={`Edit ${product.name}`}
              >
                Edit
              </button>
              <button 
                class="py-1 px-2 border-none rounded bg-[#FF0000] text-white cursor-pointer text-[10px] font-semibold transition-all duration-200"
                on:click={() => deleteProduct(product.id)}
                type="button"
                aria-label={`Delete ${product.name}`}
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- Add Modal -->
{#if showAddModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-5 box-border" role="dialog" aria-modal="true" on:click|stopPropagation={closeAddModal}>
    <div class="bg-white rounded-lg w-96 max-w-[90%] max-h-[90%] overflow-y-auto shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" on:click|stopPropagation>
      <div class="p-4 px-5 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-base font-semibold text-gray-800 m-0">Add Product</h3>
        <button 
          class="bg-transparent border-none cursor-pointer p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          on:click={closeAddModal}
          type="button"
          aria-label="Close add modal"
        >
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>
      <div class="p-4 px-5">
        <div class="mb-3 last:mb-0">
          <label for="product_name" class="block mb-1 font-semibold text-gray-700 text-xs">Product Name</label>
          <input 
            type="text" 
            id="product_name"
            bind:value={productName}
            placeholder="Add product name"
            class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
          />
        </div>
        <div class="mb-0">
          <label for="product_image" class="block mb-1 font-semibold text-gray-700 text-xs">Product Image</label>
          <div 
            class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-all duration-200 relative hover:border-[#2448B1] hover:bg-slate-50" 
            on:click={() => document.getElementById('product_image')?.click()}
            on:dragover={handleDragOver}
            on:dragleave={handleDragLeave}
            on:drop={(e) => handleDrop(e, false)}
          >
            {#if currentImage}
              <div class="flex flex-col items-center">
                <img src={currentImage} alt="Product preview" class="w-32 h-24 object-contain rounded-md shadow-sm mb-2" />
                <p class="text-[#2448B1] text-xs font-medium">Click to change image</p>
              </div>
            {:else}
              <div class="text-gray-500 text-xs">
                <span>Click to upload image</span>
              </div>
            {/if}
            <input 
              type="file" 
              id="product_image"
              accept="image/jpeg,image/png,image/svg+xml" 
              on:change={(e) => handleImageUpload(e, false)}
              class="hidden"
            />
          </div>
          <p class="text-gray-500 text-xs mt-2 text-center">File must be JPG, PNG, or SVG. Maximum size: 5MB.</p>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white"
            on:click={closeAddModal}
            type="button"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white"
            on:click={saveProduct}
            type="button"
            aria-label="Save product"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Modal -->
{#if showEditModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-5 box-border" role="dialog" aria-modal="true" on:click|stopPropagation={closeEditModal}>
    <div class="bg-white rounded-lg w-96 max-w-[90%] max-h-[90%] overflow-y-auto shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" on:click|stopPropagation>
      <div class="p-4 px-5 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-base font-semibold text-gray-800 m-0">Edit Product</h3>
        <button 
          class="bg-transparent border-none cursor-pointer p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          on:click={closeEditModal}
          type="button"
          aria-label="Close edit modal"
        >
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>
      <div class="p-4 px-5">
        <div class="mb-3 last:mb-0">
          <label for="edit_product_name" class="block mb-1 font-semibold text-gray-700 text-xs">Product Name</label>
          <input 
            type="text" 
            id="edit_product_name"
            bind:value={editProductName}
            placeholder="Edit product name"
            class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
          />
        </div>
        <div class="mb-0">
          <label for="edit_product_image" class="block mb-1 font-semibold text-gray-700 text-xs">Product Image</label>
          <div 
            class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-all duration-200 relative hover:border-[#2448B1] hover:bg-slate-50" 
            on:click={() => document.getElementById('edit_product_image')?.click()}
            on:dragover={handleDragOver}
            on:dragleave={handleDragLeave}
            on:drop={(e) => handleDrop(e, true)}
          >
            {#if editCurrentImage}
              <div class="flex flex-col items-center">
                <img src={editCurrentImage} alt="Product preview" class="w-32 h-24 object-contain rounded-md shadow-sm mb-2" />
                <p class="text-[#2448B1] text-xs font-medium">Click to change image</p>
              </div>
            {:else}
              <div class="text-gray-500 text-xs">
                <span>Click to upload image</span>
              </div>
            {/if}
            <input 
              type="file" 
              id="edit_product_image"
              accept="image/jpeg,image/png,image/svg+xml" 
              on:change={(e) => handleImageUpload(e, true)}
              class="hidden"
            />
          </div>
          <p class="text-gray-500 text-xs mt-2 text-center">File must be JPG, PNG, or SVG. Maximum size: 5MB.</p>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white"
            on:click={closeEditModal}
            type="button"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white"
            on:click={updateProduct}
            type="button"
            aria-label="Save product"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[1001] p-4" role="dialog" aria-modal="true" on:click|stopPropagation={closeDeleteModal}>
    <div class="bg-white rounded-[10px] w-[350px] max-w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] relative p-6 text-center" on:click|stopPropagation>
      <button 
        class="absolute top-3 right-3 text-gray-400 bg-none border-none cursor-pointer p-1.5 rounded hover:bg-gray-100 hover:text-gray-600" 
        on:click={closeDeleteModal}
        type="button"
        aria-label="Close delete modal"
      >
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
      <div class="w-[60px] h-[60px] bg-[#ff0000] rounded-full mx-auto mb-4 flex items-center justify-center">
        <span class="material-symbols-outlined text-white text-[28px] font-bold">close</span>
      </div>
      <h3 class="text-[18px] font-bold text-[#1e293b] m-0 mb-2">Delete this product?</h3>
      <p class="text-[13px] text-[#6b7280] m-0">This action cannot be undone.</p>
      <button 
        class="bg-[#ff0000] text-white px-6 py-2 rounded-md text-[12px] font-bold mt-4 cursor-pointer hover:bg-[#dc2626]" 
        on:click={confirmDelete}
        type="button"
        aria-label="Confirm delete"
      >
        Delete
      </button>
    </div>
  </div>
{/if}

<style>
  @reference "tailwindcss";

  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-size: 16px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }

  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    padding: 12px;
  }

  /* Custom scrollbar untuk modal */
  :global(.overflow-y-auto::-webkit-scrollbar) {
    width: 4px;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-track) {
    background: #f1f5f9;
    border-radius: 2px;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background: #cbd5e1;
    border-radius: 2px;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background: #94a3b8;
  }

  /* Cursor styles for buttons */
  :global(button) {
    cursor: pointer;
  }

  /* Focus styles untuk accessibility */
  :global(button:focus-visible) {
    outline: 2px solid #2448B1;
    outline-offset: 2px;
  }

  :global(input:focus-visible),
  :global(textarea:focus-visible) {
    outline: 2px solid #2448B1;
    outline-offset: 2px;
  }

  /* Responsive fine-tuning */
  @media (max-width: 640px) {
    .btn-text-mobile-hidden {
      display: none;
    }
  }

  /* Touch optimization */
  @media (pointer: coarse) {
    :global(button) {
      min-height: 40px;
      min-width: 40px;
    }
    
    :global(input),
    :global(textarea) {
      min-height: 40px;
    }
  }

  /* High contrast support */
  @media (prefers-contrast: high) {
    :global(input),
    :global(textarea) {
      border-width: 2px;
    }

    :global(.border) {
      border-width: 2px;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    :global(body) {
      background: #0f172a;
      color: #e2e8f0;
    }
  }

  /* Print styles */
  @media print {
    :global(.fixed),
    :global(button) {
      display: none !important;
    } 
  }
</style>