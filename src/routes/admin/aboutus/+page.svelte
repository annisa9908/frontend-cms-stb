<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import api from '$lib/axios-instance';

  // Define customer type
  interface Customer {
    id: string;
    image: File | null;
    imagePreview: string | null;
  }
   
  // State variables
  let id = $state(''); 
  let title = $state(''); 
  let description = $state(''); 
  let customers = $state<Customer[]>([]); 
  let showAddCustomerModal = $state(false); 
  let showSuccessModal = $state(false); 
  let showDeleteModal = $state(false); 
  let customerToDelete = $state(''); 
  let newCustomer = $state<Customer>({ id: '', image: null, imagePreview: null }); 
  let isLoading = $state(false); 

  // Load data on mount
  onMount(async () => {
    await loadAboutUs();
    await loadCustomer();
  });

  // Load About Us data
  async function loadAboutUs() {
    try {
      const response = await api.get('/api/about-us');
      
      if (response.data?.data) {
        id = response.data.data.documentId || generateUniqueId();
        title = response.data.data.title || '';
        description = response.data.data.description?.[0]?.children?.[0]?.text || '';
      } else {
        console.warn('No data returned from about-us API');
        id = generateUniqueId();
        title = '';
        description = '';
      }
    } catch (error: any) {
      console.error('Error loading about us:', error);
      alert('Error loading about us data. Please try again.');
      id = generateUniqueId();
      title = '';
      description = '';
    }
  }

  // Load customers data
  async function loadCustomer() {
    try {
      const response = await api.get('/api/customers?populate=*');
      
      customers = response.data.data.map((e: any) => ({
        id: e.documentId,
        image: null,
        imagePreview: e.logo_customer?.length > 0 ? `${env.PUBLIC_BASE_URL}${e.logo_customer[0].url}` : null
      }));
    } catch (error: any) {
      console.error('Error loading customers:', error);
      alert('Error loading customers. Please try again.');
    }
  }

  // Navigate to dashboard
  function goToDashboardSetting() {
    goto('/admin/dashboard-setting');
  }

  // Generate unique ID
  function generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Save changes
  async function saveChanges() {
    if (isLoading) return;
    
    isLoading = true;
    
    try {
      if (!id) {
        id = generateUniqueId();
      }

      // Update About Us
      await api.put('/api/about-us', {
        data: {
          title: title,
          description: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: description }]
            }
          ]
        }
      });

      // Save customers with images
      for (const customer of customers) {
        if (customer.image) {
          const formData = new FormData();
          formData.append('files', customer.image);
        
          const uploadResponse = await api.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          if (uploadResponse.data.length > 0) {
            const imageId = uploadResponse.data[0].id;
            
            await api.put(`/api/customers/${customer.id}`, {
              data: {
                logo_customer: imageId
              }
            });
          }
        }
      }

      showSuccessModal = true;
      setTimeout(() => {
        showSuccessModal = false;
        loadAboutUs();
        loadCustomer();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error saving changes:', error);
      alert('Error saving changes: ' + (error?.response?.data?.message || error?.message || 'Unknown error'));
    } finally {
      isLoading = false;
    }
  }

  function openAddCustomerModal() {
    newCustomer = { id: generateUniqueId(), image: null, imagePreview: null };
    showAddCustomerModal = true;
  }

  function closeAddCustomerModal() {
    showAddCustomerModal = false;
    newCustomer = { id: '', image: null, imagePreview: null };
  }

  function closeSuccessModal() {
    showSuccessModal = false;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    customerToDelete = '';
  }

  // Save new customer
  async function saveNewCustomer() {
    if (!newCustomer.image) {
      alert('Please upload a customer image.');
      return;
    }
    
    if (isLoading) return;
    
    isLoading = true;
    
    try {
      const formData = new FormData();
      formData.append('files', newCustomer.image);
      
      const uploadResponse = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (uploadResponse.data && uploadResponse.data.length > 0) {
        const imageId = uploadResponse.data[0].id;
        
        const customerResponse = await api.post('/api/customers', {
          data: {
            logo_customer: imageId
          }
        });
        
        if (customerResponse.data.data) {
          const newCustomerData: Customer = {
            id: customerResponse.data.data.documentId,
            image: null,
            imagePreview: `${env.PUBLIC_BASE_URL}${uploadResponse.data[0].url}`
          };
          
          customers = [...customers, newCustomerData];
          
          closeAddCustomerModal();
          showSuccessModal = true;
          setTimeout(() => {
            showSuccessModal = false;
            loadCustomer();
          }, 2000);
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        throw new Error('Image upload failed - no file returned');
      }
    } catch (error: any) {
      console.error('Error saving customer:', error);
      alert('Error saving customer: ' + (error?.response?.data?.message || error?.message || 'Unknown error'));
    } finally {
      isLoading = false;
    }
  }

  // Handle image upload
  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB. Please select a smaller file.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file format. Please select a JPG, PNG, SVG, or WEBP file.');
      return;
    }

    console.log('Customer image selected:', file.name, 'Type:', file.type, 'Size:', file.size);
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target?.result) {
        newCustomer = { ...newCustomer, image: file, imagePreview: e.target.result as string };
      }
    };
    reader.readAsDataURL(file);
  }

  function handleFileInputClick(customerId: string = 'new-customer') {
    if (typeof document !== 'undefined') {
      const fileInput = document.getElementById(`file-${customerId}`) as HTMLInputElement | null;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  function removeCustomer(id: string) {
    customerToDelete = id;
    showDeleteModal = true;
  }

  // Delete customer
  async function confirmDeleteCustomer() {
    if (isLoading) return;
    
    isLoading = true;
    
    try {
      await api.delete(`/api/customers/${customerToDelete}`);
      
      customers = customers.filter((customer) => customer.id !== customerToDelete);
      closeDeleteModal();
      showSuccessModal = true;
      setTimeout(() => (showSuccessModal = false), 2000);
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer: ' + (error?.response?.data?.message || error?.message || 'Unknown error'));
    } finally {
      isLoading = false;
    }
  }

  // Update customer image
  async function handleImageUploadForCustomer(event: Event, customerId: string) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB. Please select a smaller file.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file format. Please select a JPG, PNG, SVG, or WEBP file.');
      return;
    }

    console.log('Customer image updated:', file.name);
    
    if (isLoading) return;
    
    isLoading = true;
    
    try {
      const formData = new FormData();
      formData.append('files', file);
    
      const uploadResponse = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (uploadResponse.data.length > 0) {
        const imageId = uploadResponse.data[0].id;
        
        await api.put(`/api/customers/${customerId}`, {
          data: {
            logo_customer: imageId
          }
        });
        
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
        
        showSuccessModal = true;
        setTimeout(() => (showSuccessModal = false), 2000);
      }
    } catch (error: any) {
      console.error('Error updating customer image:', error);
      alert('Error updating image: ' + (error?.response?.data?.message || error?.message || 'Unknown error'));
    } finally {
      isLoading = false;
    }
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
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 5MB. Please select a smaller file.');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file format. Please select a JPG, PNG, SVG, or WEBP file.');
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
    <div class="bg-[#2448B1] rounded-lg mx-4 mt-4 p-4 shadow-md border border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-white text-xl font-bold mb-0.5 leading-tight">About Us Management</h1>
          <p class="text-white text-sm font-normal m-0">Manage about us page content</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            on:click={saveChanges} 
            disabled={isLoading}
            class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-md"
            type="button"
          >
            <span class="material-symbols-outlined text-base">{isLoading ? 'hourglass_empty' : 'save'}</span>
            {isLoading ? 'Saving...' : 'Save Changes'}
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

    <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200 mx-4">
      <h3 class="text-base font-semibold text-gray-800 mb-3">Customer Editor</h3>
      
      <button 
        on:click={openAddCustomerModal} 
        disabled={isLoading}
        class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white border-none py-1.5 px-2.5 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1 transition-colors mb-4"
        type="button"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Add Customer
      </button>
      
      <div class="customer-content">
        {#if customers.length === 0}
          <div class="text-center py-8 text-gray-500">
            <span class="material-symbols-outlined text-4xl mb-2 block">business</span>
            <p class="text-sm">No customers added yet. Click "Add Customer" to get started.</p>
          </div>
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
                            disabled={isLoading}
                            class="btn-change-image flex items-center gap-1 px-2.5 py-1.5 bg-[#374151] text-white border-none rounded text-[10px] cursor-pointer hover:bg-[#4b5563] disabled:bg-gray-400 disabled:cursor-not-allowed"
                            on:click={() => handleFileInputClick(customer.id)}
                          >
                            <span class="material-symbols-outlined text-[14px]">edit</span>
                            Change Image
                          </button>
                          <button 
                            class="btn-remove-overlay flex items-center p-1.5 bg-[#ef4444] text-white border-none rounded cursor-pointer text-[12px] hover:bg-[#dc2626] disabled:bg-gray-400 disabled:cursor-not-allowed" 
                            disabled={isLoading}
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
                      accept="image/jpeg,image/png,image/svg+xml,image/webp"
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
            <label class="form-label block mb-1 font-semibold text-gray-700 text-xs" for="new-customer-image">Customer Image *</label>
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
                <div class="text-gray-500 text-xs py-8">
                  <span class="material-symbols-outlined text-3xl mb-2 block">cloud_upload</span>
                  <span>Click to upload or drag and drop</span>
                  <div class="text-gray-400 mt-1">JPG, PNG, SVG, WEBP (Max 5MB)</div>
                </div>
              {/if}
              <input
                type="file"
                id="file-new-customer"
                accept="image/jpeg,image/png,image/svg+xml,image/webp"
                style="display: none;"
                on:change={handleImageUpload}
              />
            </div>
            <p class="text-gray-500 text-xs mt-2 text-center">File must be JPG, PNG, SVG, or WEBP. Maximum size: 5MB.</p>
          </div>
        </div>

        <div class="flex justify-end gap-2 p-4 px-5 border-t border-gray-200">
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white hover:bg-[#4A4A4A]"
            disabled={isLoading}
            on:click={closeAddCustomerModal}>
            Cancel
          </button>
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white hover:bg-[#1E40AF] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
            disabled={isLoading}
            on:click={saveNewCustomer}>
            {#if isLoading}
              <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            {/if}
            {isLoading ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if showSuccessModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-5 box-border" on:click={handleSuccessModalClick}>
      <div class="bg-white rounded-2xl w-80 max-w-[90%] shadow-2xl relative">
        <div class="p-8 text-center relative">
          <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-5 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-3xl font-semibold">check</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
          <p class="text-sm text-gray-600">Your changes have been saved successfully.</p>
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

  {#if showDeleteModal}
    <div class="fixed inset-0 w-full h-full bg-black/60 flex items-center justify-center z-[1001]" on:click={handleDeleteModalClick} role="button" tabindex="0" on:keydown={() => {}}>
      <div class="bg-white rounded-[10px] w-[350px] max-w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] relative p-6 text-center">
        <button class="absolute top-3 right-3 text-gray-400 bg-none border-none cursor-pointer p-1.5 rounded hover:bg-gray-100 hover:text-gray-600" on:click={closeDeleteModal}>
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
        <div class="w-[60px] h-[60px] bg-[#ff0000] rounded-full mx-auto mb-4 flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-[28px] font-bold">delete</span>
        </div>
        <h3 class="text-[18px] font-bold text-[#1e293b] m-0 mb-2">Delete this customer?</h3>
        <p class="text-[13px] text-[#6b7280] m-0 mb-4">This action cannot be undone.</p>
        <div class="flex gap-2 justify-center">
          <button 
            class="bg-gray-500 text-white px-4 py-2 rounded-md text-[12px] font-bold cursor-pointer hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed" 
            disabled={isLoading}
            on:click={closeDeleteModal}>
            Cancel
          </button>
          <button 
            class="bg-[#ff0000] text-white px-4 py-2 rounded-md text-[12px] font-bold cursor-pointer hover:bg-[#dc2626] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1" 
            disabled={isLoading}
            on:click={confirmDeleteCustomer}>
            {#if isLoading}
              <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            {/if}
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";
  @import "tailwindcss/preflight";
  @import "tailwindcss/utilities";
  
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

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @media (min-width: 1024px) {
    .service-content {
      @apply p-6;
    }
  }

  @media (max-width: 1366px) {
    .page-info h1 {
      @apply text-[18px];
    }
    
    .customer-grid {
      @apply grid-cols-[repeat(auto-fill,minmax(160px,1fr))];
    }
  }

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