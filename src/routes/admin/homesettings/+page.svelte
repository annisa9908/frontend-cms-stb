<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  
  const dispatch = createEventDispatcher<{
    save: { title: string; description: string };
    logoUpdate: { url: string };
    imageUpdate: { url: string };
  }>();
  
  // Modal state types
  let deleteType: 'logo' | 'image' | '' = '';
  let showEditCompanyLogoModal: boolean = false;
  let showEditImageModal: boolean = false;
  let showSuccessModal: boolean = false;
  let showDeleteModal: boolean = false;
  let showSaveNotification: boolean = false;
  
  // File input references
  let logoFile: HTMLInputElement;
  let imageFile: HTMLInputElement;
  
  // Current saved URLs (what's displayed in the main interface)
  let currentLogoUrl: string = '';
  let currentImageUrl: string = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E';
  
  // Temporary preview URLs (what's shown in modal before saving)
  let tempLogoPreviewUrl: string = '';
  let tempImagePreviewUrl: string = '';
  
  // Form data
  let title: string = '';
  let description: string = '';
  
  function handleEditCompanyLogo(): void {
    tempLogoPreviewUrl = currentLogoUrl;
    showEditCompanyLogoModal = true;
  }
  
  function handleEditImage(): void {
    tempImagePreviewUrl = currentImageUrl;
    showEditImageModal = true;
  }
  
  function handleDeleteModal(type: 'logo' | 'image'): void {
    deleteType = type;
    showDeleteModal = true;
  }
  
  function closeModal(): void {
    showEditCompanyLogoModal = false;
    showEditImageModal = false;
    showSuccessModal = false;
    showDeleteModal = false;
    // Reset temporary preview URLs when closing modal without saving
    tempLogoPreviewUrl = '';
    tempImagePreviewUrl = '';
  }
  
  function closeSuccessModal(): void {
    showSuccessModal = false;
  }

  function closeDeleteModal(): void {
    showDeleteModal = false;
    deleteType = '';
  }
  
  // Navigation function for settings button
  function handleSettingsClick(): void {
    goto('/admin/dashboard-setting');
  }
  
  function handleFileSelect(event: Event, type: 'logo' | 'image'): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      console.log(`${type} file selected:`, file.name);
      const reader = new FileReader();
      reader.onload = function(e: ProgressEvent<FileReader>) {
        const result = e.target?.result as string;
        if (type === 'logo') {
          tempLogoPreviewUrl = result;
        } else if (type === 'image') {
          tempImagePreviewUrl = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  function saveLogo(): void {
    currentLogoUrl = tempLogoPreviewUrl;
    showEditCompanyLogoModal = false;
    showSuccessModal = true;
    dispatch('logoUpdate', { url: tempLogoPreviewUrl });
  }
  
  function saveImage(): void {
    currentImageUrl = tempImagePreviewUrl;
    showEditImageModal = false;
    showSuccessModal = true;
    dispatch('imageUpdate', { url: tempImagePreviewUrl });
  }
  
  function confirmDelete(): void {
    if (deleteType === 'logo') {
      currentLogoUrl = '';
    } else if (deleteType === 'image') {
      currentImageUrl = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E';
    }
    closeDeleteModal();
    showSuccessModal = true;
  }
  
  function handleModalClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeModal();
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

  function handleModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  function handleSaveChanges(): void {
    dispatch('save', { title, description });
    showSuccessModal = true;
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
  
  function handleDrop(event: DragEvent, type: 'logo' | 'image'): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.style.borderColor = '#d1d5db';
    target.style.background = '#f9fafb';
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      console.log('File dropped:', files[0].name);
      const reader = new FileReader();
      reader.onload = function(e: ProgressEvent<FileReader>) {
        const result = e.target?.result as string;
        if (type === 'logo') {
          tempLogoPreviewUrl = result;
        } else if (type === 'image') {
          tempImagePreviewUrl = result;
        }
      };
      reader.readAsDataURL(files[0]);
    }
  }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<div class="app">
  <!-- Main Content -->
  <div class="main-content">
    <!-- Content Area -->
    <div class="content-area">
      <!-- Header Card -->
      <div class="header-card">
        <div class="header-info">
          <div class="page-title">
            Home Setting
          </div>
          <div class="page-subtitle">Design Home Page Screen</div>
        </div>
        <div class="header-actions">
          <button class="save-changes-btn" on:click={handleSaveChanges}>
            <span class="material-symbols-outlined" style="font-size: 16px;">save</span>
            <span class="btn-text">Save Changes</span>
          </button>
          <button class="settings-icon-btn" type="button" on:click={handleSettingsClick}>
            <span class="material-symbols-outlined settings-icon">settings</span>
          </button>
        </div>
      </div>

      <!-- Form Card -->
      <div class="form-section">
        <div class="form-group">
          <label for="title-input">Title</label>
          <input 
            id="title-input"
            type="text" 
            placeholder="Add Title"
            bind:value={title}
          />
        </div>

        <div class="form-group">
          <label for="description-input">Description</label>
          <textarea 
            id="description-input"
            placeholder="Add Description"
            bind:value={description}
          ></textarea>
        </div>

        <div class="company-section">
          <div class="logo-card">
            <h3 class="card-title">Company Logo</h3>
            <div class="logo-preview">
              {#if currentLogoUrl}
                <img src={currentLogoUrl} alt="Company Logo" class="logo-image">
              {:else}
                <div class="company-logo"></div>
              {/if}
              <div class="status-label">Current</div>
            </div>
            <div class="btn-group">
              <button class="btn btn-edit" on:click={handleEditCompanyLogo}>Edit</button>
              <button class="btn btn-delete" on:click={() => handleDeleteModal('logo')}>Delete</button>
            </div>
          </div>

          <div class="image-card">
            <h3 class="card-title">Image</h3>
            <div class="image-preview">
              <img src={currentImageUrl} alt="Current Image">
              <div class="status-label">Current</div>
            </div>
            <div class="btn-group">
              <button class="btn btn-edit" on:click={handleEditImage}>Edit</button>
              <button class="btn btn-delete" on:click={() => handleDeleteModal('image')}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Edit Company Logo Modal -->
{#if showEditCompanyLogoModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" on:click={handleModalClick}>
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit Company Logo</h3>
        <button class="close-btn" on:click={closeModal}>&times;</button>
      </div>
      <div class="modal-body">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
          class="upload-area" 
          on:click={() => logoFile?.click()}
          on:dragover={handleDragOver}
          on:dragleave={handleDragLeave}
          on:drop={(e) => handleDrop(e, 'logo')}
        >
          {#if tempLogoPreviewUrl}
            <div class="preview-image-container">
              <img src={tempLogoPreviewUrl} alt="Preview" class="modal-preview-image">
              <div class="change-image-text">Klik untuk mengganti gambar</div>
            </div>
          {:else}
            <div class="upload-icon">📁</div>
            <div class="upload-text">Pilih file gambar baru. Atau seret dan letakkan gambar ke sini</div>
            <div class="upload-subtext">Format yang didukung: JPG, PNG, SVG</div>
          {/if}
          <input 
            type="file" 
            bind:this={logoFile}
            accept=".jpg,.jpeg,.png,.svg" 
            style="display: none;" 
            on:change={(e) => handleFileSelect(e, 'logo')}
          />
        </div>
        <div class="btn-group modal-btn-group">
          <button class="btn btn-save" on:click={saveLogo}>Save</button>
          <button class="btn btn-cancel" on:click={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Image Modal -->
{#if showEditImageModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" on:click={handleModalClick}>
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit Image</h3>
        <button class="close-btn" on:click={closeModal}>&times;</button>
      </div>
      <div class="modal-body">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
          class="upload-area" 
          on:click={() => imageFile?.click()}
          on:dragover={handleDragOver}
          on:dragleave={handleDragLeave}
          on:drop={(e) => handleDrop(e, 'image')}
        >
          {#if tempImagePreviewUrl && tempImagePreviewUrl !== 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E'}
            <div class="preview-image-container">
              <img src={tempImagePreviewUrl} alt="Preview" class="modal-preview-image">
              <div class="change-image-text">Klik untuk mengganti gambar</div>
            </div>
          {:else}
            <div class="upload-icon">📁</div>
            <div class="upload-text">Pilih file gambar baru. Atau seret dan letakkan gambar ke sini</div>
            <div class="upload-subtext">Format yang didukung: JPG, PNG, SVG</div>
          {/if}
          <input 
            type="file" 
            bind:this={imageFile}
            accept=".jpg,.jpeg,.png,.svg" 
            style="display: none;" 
            on:change={(e) => handleFileSelect(e, 'image')}
          />
        </div>
        <div class="btn-group modal-btn-group">
          <button class="btn btn-save" on:click={saveImage}>Save</button>
          <button class="btn btn-cancel" on:click={closeModal}>Cancel</button>
        </div>
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

<!-- Delete Modal -->
{#if showDeleteModal}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="delete-modal-overlay show" on:click={handleDeleteModalClick}>
  <div class="delete-modal-content" on:click={handleModalContentClick}>
    <!-- Close button in top right -->
    <button class="delete-modal-close" on:click={closeDeleteModal}>
      <span class="material-symbols-outlined">close</span>
    </button>
    
    <!-- Red circular X icon -->
    <div class="delete-icon-circle">
      <span class="material-symbols-outlined delete-x-icon">close</span>
    </div>
    
    <!-- Title -->
    <h2 class="delete-modal-title">Delete this {deleteType}?</h2>
    
    <!-- Subtitle -->
    <p class="delete-modal-subtitle">This action cannot be undone.</p>
    
    <!-- Delete button -->
    <button class="delete-confirm-btn" on:click={confirmDelete}>
      Delete
    </button>
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
    background-color: #f5f7fa;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* Main Content */
  .main-content {
    flex: 1;
    background-color: #ECF6F9;
    width: 100%;
    overflow-x: hidden;
  }

  /* Content Area */
  .content-area {
    padding: 12px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Header Card */
  .header-card {
    background: #2448B1;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-info {
    flex: 1;
    min-width: 200px;
  }

  .header-info .page-title {
    background: none;
    color: white;
    font-size: clamp(18px, 3.5vw, 24px);
    font-weight: 700;
    margin-bottom: 4px;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    display: block;
    position: static;
  }

  .header-info .page-subtitle {
    color: white;
    font-size: clamp(12px, 1.8vw, 14px);
    font-weight: 400;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .settings-icon-btn {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
  }

  .settings-icon-btn:hover {
    background: rgba(107, 114, 128, 0.1);
  }

  .settings-icon {
    font-size: 20px;
    color: white;
    transition: all 0.2s ease;
  }

  .settings-icon-btn:hover .settings-icon {
    transform: rotate(90deg);
  }

  .save-changes-btn {
    background: #16A34A;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
    white-space: nowrap;
  }

  .save-changes-btn:hover {
    background: #15803d;
  }

  .form-section {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    width: 100%;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-group label {
    display: block;
    margin-bottom: 7px;
    font-weight: 600;
    color: #374151;
    font-size: 13px;
  }

  .form-group input, .form-group textarea {
    width: 100%;
    padding: 11px 13px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 13px;
    color: #6b7280;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: #2448B1;
    box-shadow: 0 0 0 3px rgba(36, 72, 177, 0.1);
  }

  .form-group textarea {
    height: 75px;
    resize: vertical;
    font-family: inherit;
  }

  /* Company Logo Section */
  .company-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    margin-top: 24px;
  }

  .logo-card, .image-card {
    text-align: center;
    width: 100%;
  }

  .card-title {
    margin-bottom: 13px;
    color: #374151;
    font-size: 14px;
    font-weight: 600;
  }

  .logo-preview, .image-preview {
    width: 100%;
    max-width: 165px;
    height: 115px;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    margin: 0 auto 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9fafb;
    position: relative;
    overflow: hidden;
  }

  .logo-preview .company-logo {
    width: 60px;
    height: 45px;
    background: white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #d1d5db;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .company-logo::before {
    content: '';
    width: 12px;
    height: 12px;
    background: #2448B1;
    border-radius: 50%;
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
  }

  .company-logo::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 6px;
    background: #16A34A;
    border-radius: 6px;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
  }

  .logo-image {
    max-width: 130px;
    max-height: 100px;
    object-fit: contain;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .image-preview img {
    width: 100px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .status-label {
    position: absolute;
    top: 6px;
    right: 6px;
    background: #16A34A;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
  }

  .btn-group {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .modal-btn-group {
    justify-content: flex-end;
    gap: 10px;
  }

  .btn {
    padding: 7px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s;
    min-width: 55px;
  }

  .btn-edit {
    background: #1E3A8A;
    color: white;
  }

  .btn-edit:hover {
    background: #1e40af;
  }

  .btn-delete {
    background: #FF0000;
    color: white;
  }

  .btn-delete:hover {
    background: #dc2626;
  }

  .btn-save {
    background: #1E3A8A;
    color: white;
  }

  .btn-save:hover {
    background: #1E3A8A;
  }

  .btn-cancel {
    background: #5A5A5A;
    color: white;
  }

  .btn-cancel:hover {
    background: #5A5A5A;
  }

  /* Modal Styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    box-sizing: border-box;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    margin: 0;
    color: #1f2937;
    font-size: 18px;
    font-weight: 700;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #6b7280;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .modal-body {
    padding: 24px;
  }

  .upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 32px 16px;
    margin-bottom: 24px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    background: #f9fafb;
  }

  .upload-area:hover {
    border-color: #2448B1;
    background: #eff6ff;
  }

  .upload-area .upload-icon {
    width: 48px;
    height: 48px;
    background: #e5e7eb;
    border-radius: 8px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #6b7280;
  }

  .upload-text {
    color: #374151;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .upload-subtext {
    color: #6b7280;
    font-size: 12px;
  }

  /* Modal Preview Styles */
  .preview-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .modal-preview-image {
    max-width: 200px;
    max-height: 150px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 12px;
  }

  .change-image-text {
    color: #2448B1;
    font-size: 12px;
    font-weight: 600;
    opacity: 0.8;
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
    padding: 20px;
    box-sizing: border-box;
  }

  .success-modal {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 360px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    position: relative;
  }

  .success-modal-body {
    padding: 32px 24px;
    text-align: center;
    position: relative;
  }

  .success-icon {
    width: 60px;
    height: 60px;
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
    margin: 0 0 6px 0;
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
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    padding: 20px;
    box-sizing: border-box;
  }

  .delete-modal-overlay.show {
    opacity: 1;
    visibility: visible;
  }

  .delete-modal-content {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 380px;
    padding: 40px 32px 32px;
    text-align: center;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transform: scale(0.9) translateY(-20px);
    transition: all 0.3s ease;
  }

  .delete-modal-overlay.show .delete-modal-content {
    transform: scale(1) translateY(0);
  }

  .delete-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }

  .delete-modal-close:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  .delete-modal-close .material-symbols-outlined {
    font-size: 18px;
  }

  .delete-icon-circle {
    width: 80px;
    height: 80px;
    background: #ff3333;
    border-radius: 50%;
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(255, 51, 51, 0.3);
    animation: deleteIconBounce 0.6s ease-out;
  }

  @keyframes deleteIconBounce {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .delete-x-icon {
    color: white;
    font-size: 40px;
    font-weight: 700;
    line-height: 1;
  }

  .delete-modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 8px 0;
    letter-spacing: -0.3px;
  }

  .delete-modal-subtitle {
    font-size: 14px;
    color: #9ca3af;
    margin: 0 0 24px 0;
    font-weight: 400;
  }

  .delete-confirm-btn {
    background: #ff3333;
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(255, 51, 51, 0.3);
    text-transform: none;
    letter-spacing: 0.3px;
    min-width: 100px;
  }

  .delete-confirm-btn:hover {
    background: #e60000;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255, 51, 51, 0.4);
  }

  .delete-confirm-btn:active {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(255, 51, 51, 0.3);
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
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    background: transparent !important;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-area {
      padding: 16px;
    }

    .header-card {
      padding: 16px;
    }

    .form-section {
      padding: 24px;
    }

    .company-section {
      gap: 20px;
    }
  }

  @media (max-width: 768px) {
    .app {
      overflow-x: hidden;
    }

    .content-area {
      padding: 12px;
    }

    .header-card {
      flex-direction: column;
      gap: 12px;
      text-align: center;
      padding: 16px;
    }

    .header-info {
      width: 100%;
    }

    .header-actions {
      width: 100%;
      justify-content: center;
    }

    .save-changes-btn .btn-text {
      display: none;
    }

    .form-section {
      padding: 20px;
    }

    .company-section {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .logo-preview, .image-preview {
      max-width: 180px;
      height: 120px;
    }

    .card-title {
      font-size: 15px;
    }

    .btn {
      font-size: 11px;
      padding: 6px 12px;
    }

    /* Modal Responsive */
    .modal {
      padding: 16px;
    }

    .modal-content {
      max-width: none;
    }

    .modal-header {
      padding: 16px 20px;
    }

    .modal-body {
      padding: 20px;
    }

    .upload-area {
      padding: 24px 12px;
    }

    .upload-area .upload-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    .upload-text {
      font-size: 13px;
    }

    .upload-subtext {
      font-size: 11px;
    }

    /* Success Modal Mobile */
    .success-modal-body {
      padding: 24px 20px;
    }

    .success-icon {
      width: 50px;
      height: 50px;
    }

    .success-icon .material-symbols-outlined {
      font-size: 28px;
    }

    .success-title {
      font-size: 18px;
    }

    .success-message {
      font-size: 13px;
    }

    /* Delete Modal Mobile */
    .delete-modal-content {
      padding: 32px 24px 24px;
    }

    .delete-icon-circle {
      width: 70px;
      height: 70px;
      margin-bottom: 20px;
    }

    .delete-x-icon {
      font-size: 32px;
    }

    .delete-modal-title {
      font-size: 18px;
    }

    .delete-modal-subtitle {
      font-size: 13px;
    }

    .delete-confirm-btn {
      padding: 10px 24px;
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    .content-area {
      padding: 8px;
    }

    .header-card {
      border-radius: 8px;
      padding: 12px;
    }

    .form-section {
      border-radius: 8px;
      padding: 16px;
    }

    .header-info .page-title {
      font-size: 22px;
    }

    .header-info .page-subtitle {
      font-size: 13px;
    }

    .save-changes-btn {
      padding: 8px 12px;
      font-size: 12px;
    }

    .form-group input, .form-group textarea {
      padding: 10px 12px;
      font-size: 13px;
    }

    .form-group textarea {
      height: 70px;
    }

    .logo-preview, .image-preview {
      max-width: 160px;
      height: 100px;
    }

    .btn-group {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100px;
      font-size: 10px;
      padding: 6px 10px;
    }

    .modal-content {
      border-radius: 8px;
    }

    .modal-header h3 {
      font-size: 16px;
    }

    /* Delete Modal Extra Small */
    .delete-modal-content {
      border-radius: 16px;
      padding: 24px 16px 20px;
    }

    .delete-icon-circle {
      width: 60px;
      height: 60px;
      margin-bottom: 16px;
    }

    .delete-x-icon {
      font-size: 28px;
    }

    .delete-modal-title {
      font-size: 16px;
      margin-bottom: 6px;
    }

    .delete-modal-subtitle {
      font-size: 12px;
      margin-bottom: 20px;
    }

    .delete-confirm-btn {
      padding: 8px 20px;
      font-size: 12px;
    }
  }

  @media (max-width: 360px) {
    .header-actions {
      flex-direction: column;
      gap: 8px;
    }

    .save-changes-btn,
    .settings-icon-btn {
      width: 100%;
      justify-content: center;
    }

    .company-section {
      gap: 16px;
    }

    .logo-preview, .image-preview {
      max-width: 140px;
      height: 90px;
    }

    .status-label {
      font-size: 8px;
      padding: 1px 6px;
    }
  }

  /* Enhanced Focus States */
  .save-changes-btn:focus,
  .btn:focus,
  .delete-confirm-btn:focus,
  .close-btn:focus,
  .success-close:focus,
  .delete-modal-close:focus {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  }

  /* Improved Touch Targets for Mobile */
  @media (max-width: 768px) {
    .btn,
    .save-changes-btn,
    .settings-icon-btn,
    .close-btn,
    .success-close,
    .delete-modal-close {
      min-height: 44px;
      min-width: 44px;
    }

    .delete-confirm-btn {
      min-height: 44px;
      min-width: 120px;
    }
  }

  /* Prevent horizontal scroll */
  * {
    max-width: 100%;
    box-sizing: border-box;
  }

  /* Smooth Transitions */
  * {
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
</style>