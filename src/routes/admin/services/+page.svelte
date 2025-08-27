<!-- src/routes/admin/services/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  
  // Types
  interface Service {
    id: number;
    image: string;
    type: string;
    description: string;
    imagePreview?: string | null;
  }
  
  // State variables
  let sectionTitle: string = 'Our Services';
  let sectionDescription: string = '';
  let showAddServiceModal: boolean = false;
  let showDeleteModal: boolean = false;
  let editingService: Service | null = null;
  let deletingServiceId: number | null = null;
  let showSaveNotification: boolean = false;
  let showSuccessModal: boolean = false;
  
  // New service form data
  let newServiceName: string = '';
  let newServiceDescription: string = '';
  let newServiceImage: HTMLInputElement | null = null;
  let imagePreviewUrl: string = '';
  
  // Services data
  let services: Service[] = [
    {
      id: 1,
      image: '/api/placeholder/80/80',
      type: 'Managed services',
      description: 'Custom Web development',
      imagePreview: null
    },
    {
      id: 2,
      image: '/api/placeholder/80/80',
      type: 'Perusahaan hardware IT',
      description: 'IOS and Android apps',
      imagePreview: null
    }
  ];
  
  function handleAddService(): void {
    showAddServiceModal = true;
    newServiceName = '';
    newServiceDescription = '';
    newServiceImage = null;
    imagePreviewUrl = '';
  }
  
  function handleEditService(service: Service): void {
    editingService = { ...service };
    newServiceName = service.type;
    newServiceDescription = service.description;
    imagePreviewUrl = service.image;
    showAddServiceModal = true;
  }
  
  function handleDeleteService(serviceId: number): void {
    deletingServiceId = serviceId;
    showDeleteModal = true;
  }
  
  function confirmDelete(): void {
    if (deletingServiceId !== null) {
      services = services.filter(s => s.id !== deletingServiceId);
      showDeleteModal = false;
      deletingServiceId = null;
      showSuccessModal = true;
    }
  }
  
  function closeDeleteModal(): void {
    showDeleteModal = false;
    deletingServiceId = null;
  }
  
  function closeModal(): void {
    showAddServiceModal = false;
    editingService = null;
    newServiceName = '';
    newServiceDescription = '';
    newServiceImage = null;
    imagePreviewUrl = '';
  }
  
  function closeSuccessModal(): void {
    showSuccessModal = false;
  }
  
  // Navigation function for settings button
  function handleSettingsClick(): void {
    goto('/admin/dashboard-setting');
  }
  
  function handleImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          imagePreviewUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
      newServiceImage = target;
    }
  }
  
  function saveService(): void {
    if (!newServiceName.trim() || !newServiceDescription.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    if (editingService) {
      // Update existing service
      const index = services.findIndex(s => s.id === editingService!.id);
      if (index !== -1) {
        services[index] = {
          ...services[index],
          type: newServiceName,
          description: newServiceDescription,
          image: imagePreviewUrl || services[index].image
        };
      }
    } else {
      // Add new service
      const newService: Service = {
        id: Date.now(),
        type: newServiceName,
        description: newServiceDescription,
        image: imagePreviewUrl || '/api/placeholder/80/80'
      };
      services = [...services, newService];
    }
    
    closeModal();
    showSuccessModal = true;
  }
  
  function saveChanges(): void {
    console.log('Saving section settings:', { sectionTitle, sectionDescription, services });
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
  
  function handleImageAreaClick(): void {
    newServiceImage?.click();
  }

  function handleModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<div class="services-page">
  <div class="services-content">
    <!-- Header Card -->
    <div class="header-card">
      <div class="header-content">
        <div>
          <h1 class="header-title">Services</h1>
          <p class="header-subtitle">Manage services page content</p>
        </div>
        <div class="header-actions">
          <!-- Save Changes Button -->
          <button on:click={saveChanges} class="save-changes-btn" type="button">
            <span class="material-symbols-outlined">save</span>
            Save Changes
          </button>
          
          <!-- Settings Button -->
          <button class="settings-btn" type="button" on:click={handleSettingsClick}>
            <span class="material-symbols-outlined settings-icon">settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section Settings -->
    <div class="section-settings">
      <h3 class="section-title">Section Settings</h3>
      
      <div class="form-group">
        <label for="section_title">Section Title</label>
        <input 
          type="text" 
          id="section_title" 
          bind:value={sectionTitle}
          placeholder="Enter section title"
        />
      </div>
      
      <div class="form-group">
        <label for="section_description">Section Description</label>
        <textarea 
          id="section_description" 
          bind:value={sectionDescription}
          placeholder="Enter section description"
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- Manage Services -->
    <div class="manage-services">
      <div class="services-header">
        <h3 class="section-title">Manage Services</h3>
        <button on:click={handleAddService} class="add-service-btn" type="button">
          <span class="material-symbols-outlined">add</span>
          Add Services
        </button>
      </div>

      <!-- Services Table -->
      <div class="services-table">
        <div class="table-header">
          <div class="col-image">Image</div>
          <div class="col-type">Type</div>
          <div class="col-description">Description</div>
          <div class="col-actions">Actions</div>
        </div>
        
        {#each services as service (service.id)}
          <div class="table-row">
            <div class="col-image">
              <div class="service-image">
                <img src={service.image} alt="Service {service.type}" />
              </div>
            </div>
            <div class="col-type">{service.type}</div>
            <div class="col-description">{service.description}</div>
            <div class="col-actions">
              <button on:click={() => handleEditService(service)} class="action-btn edit-btn" type="button">
                Edit
              </button>
              <button on:click={() => handleDeleteService(service.id)} class="action-btn delete-btn" type="button">
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Add/Edit Service Modal -->
  {#if showAddServiceModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-overlay" on:click={handleModalClick}>
      <div class="modal" on:click={handleModalContentClick}>
        <div class="modal-header">
          <h3>{editingService ? 'Edit Service' : 'Add Service'}</h3>
          <button on:click={closeModal} class="modal-close" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="service_name">Service Name</label>
            <input 
              type="text" 
              id="service_name"
              bind:value={newServiceName}
              placeholder={editingService ? "Managed services" : "add service name"}
            />
          </div>
          
          <div class="form-group">
            <label for="service_description">Description</label>
            <textarea 
              id="service_description"
              bind:value={newServiceDescription}
              placeholder={editingService ? "Custom website development" : "add description"}
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="service_image">Services Image</label>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="image-upload-area" on:click={handleImageAreaClick}>
              {#if imagePreviewUrl}
                <div class="image-preview">
                  <img src={imagePreviewUrl} alt="Service preview" />
                  <div class="image-overlay">
                    <span>New image</span>
                    <span class="image-hint">click to change image</span>
                  </div>
                </div>
              {:else}
                <div class="upload-placeholder">
                  <span>Click to upload image</span>
                </div>
              {/if}
              <input 
                type="file" 
                id="service_image"
                accept="image/*" 
                on:change={handleImageUpload}
                style="display: none;"
                bind:this={newServiceImage}
              />
            </div>
          </div>
          
          <div class="modal-actions">
            <button on:click={closeModal} class="btn-cancel" type="button">Cancel</button>
            <button on:click={saveService} class="btn-save" type="button">Save</button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Delete Confirmation Modal - New Design -->
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
        <h2 class="delete-modal-title">Delete this service?</h2>
        
        <!-- Subtitle -->
        <p class="delete-modal-subtitle">This action cannot be undone.</p>
        
        <!-- Delete button -->
        <button class="delete-confirm-btn" on:click={confirmDelete}>
          Delete
        </button>
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
          <p class="success-message">Your changes have been saved.</p>
          <button on:click={closeSuccessModal} class="success-close" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Services Page Container */
  .services-page {
    width: 100%;
    min-height: 100vh;
    background-color: #ECF6F9;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    line-height: 1.4;
  }

  .services-content {
    padding: 0 0 16px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Header Card */
  .header-card {
    background: #2448B1;
    border-radius: 8px;
    margin: 16px 16px 0 16px;
    padding: 16px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-title {
    color: white;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 2px 0;
    line-height: 1.2;
  }

  .header-subtitle {
    color: white;
    font-size: 13px;
    font-weight: 400;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .settings-btn {
    background: none;
    border: none;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .save-changes-btn {
    background: #16A34A;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .save-changes-btn:hover {
    background: #15803d;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }

  .settings-icon {
    font-size: 16px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .settings-icon:hover {
    color: rgba(255, 255, 255, 0.8);
    transform: rotate(90deg);
  }

  /* Content Cards */
  .section-settings, .manage-services {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
    margin: 0 16px;
  }

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group:last-child {
    margin-bottom: 0;
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
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 12px;
    color: #374151;
    background: white;
    transition: all 0.2s ease;
    font-family: inherit;
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
    resize: vertical;
    min-height: 60px;
  }

  /* Services Management */
  .services-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .add-service-btn {
    background: #16A34A;
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.2s;
  }

  .add-service-btn:hover {
    background: #15803d;
  }

  /* Services Table */
  .services-table {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }

  .table-header {
    background: #4f6cc9;
    color: white;
    display: grid;
    grid-template-columns: 70px 1fr 1fr 100px;
    padding: 10px;
    font-weight: 600;
    font-size: 12px;
  }

  .table-header .col-type,
  .table-header .col-description {
    color: white;
  }

  .table-row {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 100px;
    padding: 10px;
    border-bottom: 1px solid #e5e7eb;
    align-items: center;
    background: white;
  }

  .table-row:hover {
    background: #f9fafb;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .service-image {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
    background: #f3f4f6;
  }

  .service-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .col-type, .col-description {
    font-size: 12px;
    color: #374151;
  }

  .col-actions {
    display: flex;
    gap: 4px;
  }

  .action-btn {
    padding: 4px 8px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 10px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .edit-btn {
    background: #1E3A8A;
    color: white;
  }

  .edit-btn:hover {
    background: #1e40af;
  }

  .delete-btn {
    background: #FF0000;
    color: white;
  }

  .delete-btn:hover {
    background: #dc2626;
  }

  /* Delete Modal Styles - Compact */
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
  }

  .delete-modal-overlay.show {
    opacity: 1;
    visibility: visible;
  }

  .delete-modal-content {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 320px;
    padding: 24px 24px 20px;
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
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .delete-modal-close:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  .delete-modal-close .material-symbols-outlined {
    font-size: 16px;
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
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
  }

  .delete-modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 6px 0;
    letter-spacing: -0.3px;
  }

  .delete-modal-subtitle {
    font-size: 13px;
    color: #9ca3af;
    margin: 0 0 20px 0;
    font-weight: 400;
  }

  .delete-confirm-btn {
    background: #ff3333;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(255, 51, 51, 0.3);
    text-transform: none;
    letter-spacing: 0.3px;
    min-width: 80px;
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

  /* Modal */
  .modal-overlay {
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
  }

  .modal {
    background: white;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    color: #6b7280;
  }

  .modal-close:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .modal-body {
    padding: 16px 20px;
  }

  .image-upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 6px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .image-upload-area:hover {
    border-color: #2448B1;
    background: #f8fafc;
  }

  .upload-placeholder {
    color: #6b7280;
    font-size: 12px;
  }

  .image-preview {
    position: relative;
    display: inline-block;
  }

  .image-preview img {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(59, 130, 246, 0.9);
    color: white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 10px;
  }

  .image-hint {
    font-size: 9px;
    opacity: 0.8;
    margin-top: 2px;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }

  .btn-cancel, .btn-save {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-cancel {
    background: #5A5A5A;
    color: white;
  }

  .btn-cancel:hover {
    background: #4b5563;
  }

  .btn-save {
    background: #1E3A8A;
    color: white;
  }

  .btn-save:hover {
    background: #1e40af;
  }

  /* Success Modal */
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
  }

  .success-modal {
    background: white;
    border-radius: 8px;
    width: 280px;
    max-width: 90%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    position: relative;
  }

  .success-modal-body {
    padding: 24px 20px;
    text-align: center;
    position: relative;
  }

  .success-icon {
    width: 50px;
    height: 50px;
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
    margin: 0 0 4px 0;
  }

  .success-message {
    font-size: 12px;
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
    padding: 4px;
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

  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-size: 16px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .services-content {
      padding: 0 0 12px 0;
    }
    
    .header-card {
      margin: 12px 12px 0 12px;
      padding: 12px;
    }
    
    .header-content {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }
    
    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
    
    .header-title {
      font-size: 18px;
    }
    
    .section-settings, .manage-services {
      margin: 0 12px;
    }
    
    .table-header, .table-row {
      grid-template-columns: 60px 1fr 1fr 80px;
      padding: 8px;
    }
    
    .modal {
      width: 95%;
    }

    .success-modal {
      width: 95%;
    }

    .delete-modal-content {
      width: 95%;
      margin: 12px;
      padding: 20px 20px 16px;
    }

    .delete-icon-circle {
      width: 50px;
      height: 50px;
      margin-bottom: 12px;
    }

    .delete-x-icon {
      font-size: 24px;
    }

    .delete-modal-title {
      font-size: 16px;
    }

    .delete-modal-subtitle {
      font-size: 12px;
      margin-bottom: 16px;
    }

    .delete-confirm-btn {
      padding: 8px 20px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .header-card {
      margin: 8px 8px 0 8px;
      padding: 10px;
    }
    
    .section-settings, .manage-services {
      margin: 0 8px;
      padding: 12px;
    }
    
    .table-header, .table-row {
      grid-template-columns: 50px 1fr 1fr 70px;
      padding: 6px;
      font-size: 10px;
    }
    
    .action-btn {
      padding: 3px 6px;
      font-size: 9px;
    }
    
    .service-image {
      width: 32px;
      height: 32px;
    }

    .delete-modal-content {
      padding: 16px 16px 12px;
    }

    .delete-icon-circle {
      width: 40px;
      height: 40px;
      margin-bottom: 10px;
    }

    .delete-x-icon {
      font-size: 20px;
    }

    .delete-modal-title {
      font-size: 14px;
    }

    .delete-confirm-btn {
      padding: 7px 16px;
      font-size: 11px;
    }
  }

  /* Enhanced Focus States */
  .save-changes-btn:focus,
  .add-service-btn:focus,
  .edit-btn:focus,
  .delete-btn:focus,
  .btn-cancel:focus,
  .btn-save:focus,
  .delete-confirm-btn:focus {
    outline: 3px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  }

  /* Smooth Transitions */
  * {
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
</style>