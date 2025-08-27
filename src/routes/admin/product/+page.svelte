<script lang="ts">
  // Types
  interface Product {
    id: number;
    name: string;
    image: string | null;
  }

  import { goto } from '$app/navigation';
  
  // Function untuk navigasi ke profile settings
  function goToProfileSettings(): void {
    goto('/admin/dashboard-setting');
  }

  // Data
  let products: Product[] = [
    { id: 1, name: 'TACTICAL CHAT', image: null },
    { id: 2, name: 'E - OFFICE', image: null }
  ];
  
  let sectionTitle: string = '';
  let sectionDescription: string = '';
  
  // Modal states
  let showAddModal: boolean = false;
  let showEditModal: boolean = false;
  let showDeleteModal: boolean = false;
  let showSuccessModal: boolean = false;
  let showErrorModal: boolean = false;
  
  // Form data
  let productName: string = '';
  let editProductName: string = '';
  let currentEditId: number | null = null;
  let currentDeleteId: number | null = null;
  let currentImage: string | null = null;
  let editCurrentImage: string | null = null;
  
  // Image handling functions
  function handleImageUpload(event: Event, isEdit: boolean = false): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, GIF)');
      return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
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
  
  function removeImage(isEdit: boolean = false): void {
    if (isEdit) {
      editCurrentImage = null;
    } else {
      currentImage = null;
    }
  }
  
  // Functions
  function saveChanges(): void {
    if (!sectionTitle.trim() || !sectionDescription.trim()) {
      showErrorModal = true;
      return;
    }
    
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

  // Event handlers
  function handleModalBackdropClick(closeFunction: () => void) {
    return (event: MouseEvent) => {
      closeFunction();
    };
  }

  function handleModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
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
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

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

<!-- Error Modal -->
{#if showErrorModal}
<div class="error-modal show">
  <div class="error-modal-content">
    <div class="error-icon">
      <span class="material-symbols-outlined">close</span>
    </div>
    <h2 class="error-title">Title is required!</h2>
    <p class="error-message">Please enter a title before saving.</p>
    <button class="error-close-btn" on:click={closeErrorModal}>OK</button>
  </div>
</div>
{/if}

<div class="app">
  <div class="main-content">
    
    <div class="header-container">
      <div class="header-card">
        <div class="header-left">
          <div class="page-title">Products</div>
          <div class="page-subtitle">Manage products page content</div>
        </div>
        <div class="header-right">
          <button on:click={saveChanges} class="save-btn">
            <span class="material-symbols-outlined">save</span>
            <span class="btn-text">Save Changes</span>
          </button>
          <button class="settings-btn" on:click={goToProfileSettings} title="Go to Settings">
            <span class="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      
      <div class="section-card">
        <h3><span class="material-symbols-outlined">settings</span> Section Settings</h3>
        
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Section Title</label>
            <input type="text" bind:value={sectionTitle} placeholder="Enter section title" />
          </div>
          
          <div class="form-group full-width">
            <label>Section Description</label>
            <textarea bind:value={sectionDescription} placeholder="Enter section description"></textarea>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="section-card products-section">
        <div class="section-header">
          <h3>Manage Products</h3>
          <button class="add-btn" on:click={addProduct}>
            <span class="material-symbols-outlined">add</span>
            <span class="btn-text">Add Product</span>
          </button>
        </div>

        <!-- Desktop Table View -->
        <div class="table-container desktop-table">
          <table class="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each products as product (product.id)}
              <tr>
                <td class="image-cell">
                  {#if product.image}
                    <img src={product.image} alt={product.name} class="product-image-preview" />
                  {:else}
                    <div class="product-image-placeholder">No Image</div>
                  {/if}
                </td>
                <td class="product-name">{product.name}</td>
                <td class="actions-cell">
                  <div class="actions-container">
                    <button class="edit-btn" on:click={() => editProduct(product.id)}>
                      Edit
                    </button>
                    <button class="delete-btn" on:click={() => deleteProduct(product.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="mobile-cards">
          {#each products as product (product.id)}
          <div class="product-card">
            <div class="card-image">
              {#if product.image}
                <img src={product.image} alt={product.name} class="product-image-mobile" />
              {:else}
                <div class="product-image-placeholder-mobile">
                  <span class="material-symbols-outlined">image</span>
                  <span>No Image</span>
                </div>
              {/if}
            </div>
            <div class="card-content">
              <h4 class="product-name-mobile">{product.name}</h4>
              <div class="card-actions">
                <button class="edit-btn-mobile" on:click={() => editProduct(product.id)}>
                  Edit
                </button>
                <button class="delete-btn-mobile" on:click={() => deleteProduct(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

{#if showAddModal}
<div class="modal-overlay show" on:click={handleModalBackdropClick(closeAddModal)} role="dialog" aria-modal="true">
  <div class="modal" on:click={handleModalContentClick}>
    <div class="modal-header">
      <h3>Add Product</h3>
      <button class="modal-close-btn" on:click={closeAddModal}>
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Product Name</label>
        <input type="text" bind:value={productName} placeholder="Add product name" />
      </div>
      <div class="form-group">
        <label>Product Image</label>
        <div class="upload-container">
          {#if currentImage}
            <div class="image-preview">
              <img src={currentImage} alt="Preview" />
              <button class="remove-image-btn" on:click={() => removeImage(false)}>
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          {:else}
            <label class="upload-area">
              <input type="file" accept="image/*" on:change={(e) => handleImageUpload(e, false)} style="display: none;" />
              <span class="material-symbols-outlined upload-icon">cloud_upload</span>
              <p>Click to upload image</p>
              <small>Accepted formats: JPG, PNG, GIF (Max 5MB)</small>
            </label>
          {/if}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="cancel-btn" on:click={closeAddModal}>Cancel</button>
      <button class="save-modal-btn" on:click={saveProduct}>Save</button>
    </div>
  </div>
</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal}
<div class="modal-overlay show" on:click={handleModalBackdropClick(closeEditModal)} role="dialog" aria-modal="true">
  <div class="modal" on:click={handleModalContentClick}>
    <div class="modal-header">
      <h3>Edit Product</h3>
      <button class="modal-close-btn" on:click={closeEditModal}>
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Product Name</label>
        <input type="text" bind:value={editProductName} placeholder="Edit product name" />
      </div>
      <div class="form-group">
        <label>Product Image</label>
        <div class="upload-container">
          {#if editCurrentImage}
            <div class="image-preview">
              <img src={editCurrentImage} alt="Preview" />
              <button class="remove-image-btn" on:click={() => removeImage(true)}>
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          {:else}
            <label class="upload-area">
              <input type="file" accept="image/*" on:change={(e) => handleImageUpload(e, true)} style="display: none;" />
              <span class="material-symbols-outlined upload-icon">cloud_upload</span>
              <p>Click to upload image</p>
              <small>Accepted formats: JPG, PNG, GIF (Max 5MB)</small>
            </label>
          {/if}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="cancel-btn" on:click={closeEditModal}>Cancel</button>
      <button class="save-modal-btn" on:click={updateProduct}>Save</button>
    </div>
  </div>
</div>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="delete-modal-overlay show" on:click={handleDeleteModalClick}>
  <div class="delete-modal-content" on:click={handleModalContentClick}>
    <button class="delete-modal-close" on:click={closeDeleteModal}>
      <span class="material-symbols-outlined">close</span>
    </button>
    
    <div class="delete-icon-circle">
      <span class="material-symbols-outlined delete-x-icon">close</span>
    </div>
    
    <h2 class="delete-modal-title">Delete this product?</h2>
    <p class="delete-modal-subtitle">This action cannot be undone.</p>
    
    <div class="delete-modal-actions">
      <button class="delete-cancel-btn" on:click={closeDeleteModal}>Cancel</button>
      <button class="delete-confirm-btn" on:click={confirmDelete}>Delete</button>
    </div>
  </div>
</div>
{/if}

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #ECF6F9;
    color: #1f2937;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    width: 100%;
  }

  /* Success Modal Styles */
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
    border-radius: 12px;
    width: min(300px, 90vw);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .success-modal-body {
    padding: 20px 16px;
    text-align: center;
    position: relative;
  }

  .success-icon {
    width: 48px;
    height: 48px;
    background: #10b981;
    border-radius: 50%;
    margin: 0 auto 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success-icon .material-symbols-outlined {
    color: white;
    font-size: 24px;
    font-weight: 600;
  }

  .success-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  .success-message {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }

  .success-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    color: #9ca3af;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success-close:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  .success-close .material-symbols-outlined {
    font-size: 14px;
  }

  /* Error Modal Styles */
  .error-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .error-modal.show {
    opacity: 1;
    visibility: visible;
  }

  .error-modal-content {
    background: white;
    border-radius: 12px;
    padding: 20px 16px;
    text-align: center;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    max-width: min(300px, 90vw);
    width: 90%;
  }

  .error-icon {
    width: 48px;
    height: 48px;
    background: #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
  }

  .error-icon .material-symbols-outlined {
    color: white;
    font-size: 24px;
    font-weight: bold;
  }

  .error-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .error-message {
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .error-close-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    min-width: 70px;
  }

  .error-close-btn:hover {
    background: #dc2626;
  }

  /* Delete Modal Styles */
  .delete-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    backdrop-filter: blur(4px);
  }

  .delete-modal-overlay.show {
    opacity: 1;
    visibility: visible;
  }

  .delete-modal-content {
    background: white;
    border-radius: 12px;
    width: min(300px, 90vw);
    padding: 24px 20px;
    text-align: center;
    position: relative;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .delete-modal-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-modal-close:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  .delete-modal-close .material-symbols-outlined {
    font-size: 14px;
  }

  .delete-icon-circle {
    width: 60px;
    height: 60px;
    background: #ff3333;
    border-radius: 50%;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(255, 51, 51, 0.2);
  }

  .delete-x-icon {
    color: white;
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }

  .delete-modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  .delete-modal-subtitle {
    font-size: 13px;
    color: #9ca3af;
    margin: 0 0 16px 0;
    font-weight: 400;
  }

  .delete-modal-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .delete-cancel-btn, .delete-confirm-btn {
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    min-width: 80px;
  }

  .delete-cancel-btn {
    background: #6b7280;
    color: white;
  }

  .delete-cancel-btn:hover {
    background: #4b5563;
  }

  .delete-confirm-btn {
    background: #ff3333;
    color: white;
    box-shadow: 0 2px 8px rgba(255, 51, 51, 0.2);
  }

  .delete-confirm-btn:hover {
    background: #e60000;
  }

  /* Main Content */
  .main-content {
    flex: 1;
    background: #ECF6F9;
    min-height: 100vh;
    width: 100%;
  }

  .header-container {
    padding: 16px;
  }

  .header-card {
    background: linear-gradient(135deg, #2448B1 0%, #1e40af 100%);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(36, 72, 177, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .header-left {
    flex: 1;
    min-width: 120px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .page-title {
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .page-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
  }

  .save-btn {
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 1px 6px rgba(22, 163, 74, 0.2);
    height: 32px;
  }

  .save-btn:hover {
    background: linear-gradient(135deg, #15803d, #14532d);
  }

  .btn-text {
    display: inline-block;
  }

  .settings-btn {
    background: none;
    border: none;
    color: white;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }

  .settings-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .settings-btn .material-symbols-outlined {
    font-size: 16px;
  }

  /* Content */
  .content {
    padding: 0 16px 16px;
  }

  .section-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .products-section {
    padding: 16px;
  }

  .section-card h3 {
    font-size: 14px;
    color: #374151;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .section-header h3 {
    margin: 0;
    flex: 1;
    min-width: 120px;
  }

  .add-btn {
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    box-shadow: 0 1px 6px rgba(22, 163, 74, 0.2);
    height: 32px;
    flex-shrink: 0;
  }

  .add-btn:hover {
    background: linear-gradient(135deg, #15803d, #14532d);
  }

  /* Form Styles */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-group label {
    display: block;
    margin-bottom: 4px;
    font-weight: 600;
    color: #374151;
    font-size: 12px;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 13px;
    color: #374151;
    background: white;
    font-family: inherit;
    min-height: 36px;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #2448B1;
    box-shadow: 0 0 0 2px rgba(36, 72, 177, 0.1);
  }

  .form-group textarea {
    height: 60px;
    resize: vertical;
    min-height: 48px;
  }

  /* Table Styles - Desktop */
  .table-container {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    background: white;
  }

  .desktop-table {
    display: block;
  }

  .products-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
    min-width: 500px;
  }

  .products-table th {
    background: linear-gradient(135deg, #4f6cc9 0%, #2448B1 100%);
    color: white;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 1px solid #1e40af;
  }

  .products-table th:first-child {
    width: 80px;
    text-align: center;
  }

  .products-table th:nth-child(2) {
    width: auto;
    min-width: 180px;
  }

  .products-table th:last-child {
    width: 160px;
    text-align: center;
  }

  .products-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    background: white;
  }

  .products-table tbody tr {
    transition: background-color 0.2s ease;
  }

  .products-table tbody tr:hover {
    background: #f8fafc;
  }

  .products-table tbody tr:last-child td {
    border-bottom: none;
  }

  .image-cell {
    width: 80px;
    text-align: center;
    padding: 10px 16px;
  }

  .product-image-preview {
    width: 45px;
    height: 45px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .product-image-placeholder {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 9px;
    font-weight: 500;
    border: 1px dashed #d1d5db;
    text-align: center;
    line-height: 1.2;
    margin: 0 auto;
  }

  .product-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 13px;
    padding: 12px 16px;
  }

  .actions-cell {
    width: 160px;
    text-align: center;
    padding: 10px 16px;
  }

  .actions-container {
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
  }

  .edit-btn, .delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    border: none;
    min-height: 28px;
    min-width: 60px;
    transition: background-color 0.2s ease;
  }

  .edit-btn {
    background: linear-gradient(135deg, #1E3A8A, #2659c9);
    color: white;
    box-shadow: 0 1px 3px rgba(59, 130, 246, 0.2);
  }

  .edit-btn:hover {
    background: linear-gradient(135deg, #1E3A8A, #1E3A8A);
  }

  .delete-btn {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    box-shadow: 0 1px 3px rgba(239, 68, 68, 0.2);
  }

  .delete-btn:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }

  /* Mobile Card View */
  .mobile-cards {
    display: none;
    gap: 10px;
  }

  .product-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }

  .product-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .card-image {
    margin-bottom: 10px;
    text-align: center;
  }

  .product-image-mobile {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .product-image-placeholder-mobile {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    border-radius: 8px;
    border: 1px dashed #d1d5db;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    margin: 0 auto;
    gap: 4px;
  }

  .product-image-placeholder-mobile .material-symbols-outlined {
    font-size: 20px;
  }

  .product-image-placeholder-mobile span:last-child {
    font-size: 9px;
    font-weight: 500;
  }

  .card-content {
    text-align: center;
  }

  .product-name-mobile {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 10px;
  }

  .card-actions {
    display: flex;
    gap: 6px;
    justify-content: center;
  }

  .edit-btn-mobile, .delete-btn-mobile {
    flex: 1;
    max-width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    border: none;
    min-height: 30px;
  }

  .edit-btn-mobile {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 1px 4px rgba(59, 130, 246, 0.2);
  }

  .edit-btn-mobile:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }

  .delete-btn-mobile {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    box-shadow: 0 1px 4px rgba(239, 68, 68, 0.2);
  }

  .delete-btn-mobile:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    padding: 12px;
  }

  .modal-overlay.show {
    opacity: 1;
    visibility: visible;
  }

  .modal {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid #f3f4f6;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }

  .modal-close-btn {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close-btn:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  .modal-close-btn .material-symbols-outlined {
    font-size: 14px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 12px 20px 20px;
    border-top: 1px solid #f3f4f6;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  }

  /* Upload Area */
  .upload-container {
    position: relative;
  }

  .upload-area {
    border: 1px dashed #d1d5db;
    border-radius: 8px;
    padding: 24px 12px;
    text-align: center;
    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
    cursor: pointer;
    display: block;
  }

  .upload-area:hover {
    border-color: #2448B1;
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  }

  .upload-icon {
    font-size: 28px;
    color: #9ca3af;
    display: block;
    margin-bottom: 8px;
  }

  .upload-area p {
    color: #6b7280;
    font-size: 13px;
    margin: 0 0 4px 0;
    font-weight: 600;
  }

  .upload-area small {
    color: #9ca3af;
    font-size: 11px;
  }

  /* Image Preview */
  .image-preview {
    position: relative;
    display: inline-block;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .image-preview img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }

  .remove-image-btn {
    position: absolute;
    top: -4px;
    right: -4px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    box-shadow: 0 1px 6px rgba(239, 68, 68, 0.3);
  }

  .remove-image-btn:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }

  /* Modal Buttons */
  .cancel-btn, .save-modal-btn {
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    border: none;
    min-height: 32px;
    min-width: 70px;
  }

  .cancel-btn {
    background: linear-gradient(135deg, #6b7280, #4b5563);
    color: white;
    box-shadow: 0 1px 4px rgba(107, 114, 128, 0.2);
  }

  .cancel-btn:hover {
    background: linear-gradient(135deg, #4b5563, #374151);
  }

  .save-modal-btn {
    background: linear-gradient(135deg, #2448B1, #1e40af);
    color: white;
    box-shadow: 0 1px 4px rgba(36, 72, 177, 0.2);
  }

  .save-modal-btn:hover {
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
  }

  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-size: 14px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .header-card {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }

    .header-left {
      flex: none;
    }

    .header-right {
      justify-content: center;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .desktop-table {
      display: none;
    }

    .mobile-cards {
      display: flex;
      flex-direction: column;
    }

    .header-container {
      padding: 12px;
    }

    .content {
      padding: 0 12px 12px;
    }

    .section-header {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
      gap: 8px;
    }

    .section-header h3 {
      min-width: auto;
    }

    .add-btn {
      align-self: center;
      max-width: 140px;
    }

    .btn-text {
      display: none;
    }

    .save-btn .material-symbols-outlined,
    .add-btn .material-symbols-outlined {
      margin: 0;
    }

    .modal-footer {
      justify-content: center;
      gap: 8px;
    }

    .cancel-btn, .save-modal-btn {
      flex: 1;
      max-width: 100px;
    }

    .section-card {
      padding: 12px;
    }

    .products-section {
      padding: 12px;
    }
  }

  @media (max-width: 480px) {
    .header-card {
      padding: 10px 12px;
      margin-bottom: 12px;
    }

    .page-title {
      font-size: 16px;
    }

    .section-card {
      padding: 10px;
    }

    .products-section {
      padding: 10px;
    }

    .modal {
      margin: 6px;
      max-height: calc(100vh - 12px);
    }

    .modal-header {
      padding: 12px 16px 10px;
    }

    .modal-body {
      padding: 16px;
    }

    .modal-footer {
      padding: 10px 16px 16px;
      flex-direction: row;
      gap: 6px;
    }

    .cancel-btn, .save-modal-btn {
      max-width: none;
      flex: 1;
    }

    .upload-area {
      padding: 20px 10px;
    }

    .product-card {
      padding: 10px;
    }

    .card-actions {
      flex-direction: row;
      gap: 6px;
    }

    .edit-btn-mobile, .delete-btn-mobile {
      max-width: none;
      flex: 1;
    }
  }

  @media (max-width: 360px) {
    .header-container {
      padding: 8px;
    }

    .content {
      padding: 0 8px 8px;
    }

    .section-card {
      padding: 8px;
    }

    .products-section {
      padding: 8px;
    }

    .modal {
      margin: 4px;
      border-radius: 8px;
    }

    .upload-area {
      padding: 16px 8px;
    }
  }

  /* Focus styles for accessibility */
  .save-btn:focus-visible,
  .settings-btn:focus-visible,
  .add-btn:focus-visible,
  .edit-btn:focus-visible,
  .delete-btn:focus-visible,
  .edit-btn-mobile:focus-visible,
  .delete-btn-mobile:focus-visible,
  .cancel-btn:focus-visible,
  .save-modal-btn:focus-visible,
  .delete-confirm-btn:focus-visible,
  .delete-cancel-btn:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .form-group input:focus-visible,
  .form-group textarea:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Touch optimization */
  @media (pointer: coarse) {
    .save-btn,
    .settings-btn,
    .add-btn,
    .edit-btn,
    .delete-btn,
    .edit-btn-mobile,
    .delete-btn-mobile,
    .cancel-btn,
    .save-modal-btn,
    .delete-confirm-btn,
    .delete-cancel-btn {
      min-height: 40px;
      min-width: 40px;
    }

    .form-group input,
    .form-group textarea {
      min-height: 40px;
    }

    .modal-close-btn,
    .success-close,
    .delete-modal-close,
    .remove-image-btn {
      min-height: 40px;
      min-width: 40px;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .form-group input,
    .form-group textarea {
      border-width: 2px;
    }

    .products-table th {
      border-bottom: 2px solid white;
    }

    .product-card {
      border-width: 2px;
    }

    .upload-area {
      border-width: 2px;
    }
  }

  /* Custom scrollbar for modal */
  .modal::-webkit-scrollbar {
    width: 4px;
  }

  .modal::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
  }

  .modal::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }

  .modal::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Print styles */
  @media print {
    .header-right,
    .modal-overlay,
    .success-modal-overlay,
    .error-modal,
    .delete-modal-overlay {
      display: none !important;
    }

    .section-card {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #000;
    }

    .products-table {
      break-inside: avoid;
    }

    .mobile-cards {
      display: none;
    }

    .desktop-table {
      display: block !important;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    :global(body) {
      background: #0f172a;
      color: #e2e8f0;
    }

    .section-card {
      background: #1e293b;
      border-color: #334155;
    }

    .form-group input,
    .form-group textarea {
      background: #334155;
      border-color: #475569;
      color: #e2e8f0;
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
      color: #94a3b8;
    }

    .product-card {
      background: #1e293b;
      border-color: #334155;
    }

    .modal {
      background: #1e293b;
    }

    .modal-header,
    .modal-footer {
      background: linear-gradient(135deg, #334155, #1e293b);
      border-color: #475569;
    }

    .upload-area {
      background: linear-gradient(135deg, #334155, #1e293b);
      border-color: #475569;
    }

    .products-table tbody tr {
      background: #1e293b;
    }

    .products-table tbody tr:hover {
      background: #334155;
    }

    .success-modal,
    .error-modal-content,
    .delete-modal-content {
      background: #1e293b;
      color: #e2e8f0;
    }
  }

  /* Ultra-wide screens */
  @media (min-width: 1920px) {
    .main-content {
      max-width: 1000px;
      margin: 0 auto;
    }

    .header-container,
    .content {
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  /* Landscape tablet specific */
  @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
    .header-card {
      flex-direction: row;
      text-align: left;
    }

    .header-left {
      flex: 1;
    }

    .section-header {
      flex-direction: row;
      align-items: center;
    }

    .btn-text {
      display: inline-block;
    }

    .desktop-table {
      display: block;
    }

    .mobile-cards {
      display: none;
    }
  }

  /* Landscape mobile */
  @media (max-width: 768px) and (orientation: landscape) and (max-height: 500px) {
    .header-container {
      padding: 6px 12px;
    }

    .modal {
      max-height: 95vh;
    }

    .modal-body {
      padding: 12px;
    }

    .upload-area {
      padding: 16px 10px;
    }

    .upload-icon {
      font-size: 20px;
    }

    .image-preview img {
      height: 100px;
    }
  }

  /* High DPI displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .product-image-preview,
    .product-image-mobile {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  }

  /* Ensure proper stacking context */
  .modal-overlay {
    z-index: 1000;
  }

  .success-modal-overlay {
    z-index: 1001;
  }

  .error-modal {
    z-index: 2000;
  }

  .delete-modal-overlay {
    z-index: 2000;
  }

  /* Smooth scrolling */
  :global(html) {
    scroll-behavior: smooth;
  }
  </style>