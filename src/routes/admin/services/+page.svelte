<script lang="ts">
  import { goto } from '$app/navigation';
  
  
  interface Service {
    id: number;
    image: string;
    type: string;
    description: string;
    imagePreview?: string | null;
  }
  
  
  let sectionTitle = $state('Our Services');
  let sectionDescription = $state('');
  let showAddServiceModal = $state(false);
  let showDeleteModal = $state(false);
  let editingService = $state<Service | null>(null);
  let deletingServiceId = $state<number | null>(null);
  let showSuccessModal = $state(false);
  
  
  let newServiceName = $state('');
  let newServiceDescription = $state('');
  let newServiceImage = $state<HTMLInputElement | null>(null);
  let imagePreviewUrl = $state('');
  
  
  let services = $state<Service[]>([
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
  ]);
  
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
  
  
  function handleSettingsClick(): void {
    goto('/admin/dashboard-setting');
  }
  
  function handleImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 5MB. Please select a smaller file.');
        return;
      }

      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file format. Please select a JPG, PNG, or SVG file.');
        return;
      }

      console.log('Service image selected:', file.name);
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

      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file format. Please select a JPG, PNG, or SVG file.');
        return;
      }

      console.log('File dropped:', file.name);
      const reader = new FileReader();
      reader.onload = function(e: ProgressEvent<FileReader>) {
        const result = e.target?.result as string;
        imagePreviewUrl = result;
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<div class="w-full min-h-screen bg-slate-100 font-inter text-slate-800 leading-relaxed">
  <div class="p-0 pb-4 flex flex-col gap-3">
   
    <div class="bg-[#2448B1] rounded-lg mx-4 mt-4 p-4 shadow-md border border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-white text-xl font-bold mb-0.5 leading-tight">Services</h1>
          <p class="text-white text-sm font-normal m-0">Manage services page content</p>
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
            on:click={handleSettingsClick}
          >
            <span class="material-symbols-outlined text-base text-white cursor-pointer">settings</span>
          </button>
        </div>
      </div>
    </div>

   
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

    
    <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200 mx-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-base font-semibold text-gray-800">Manage Services</h3>
        <button 
          on:click={handleAddService} 
          class="bg-green-600 hover:bg-green-700 text-white border-none py-1.5 px-2.5 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1 transition-colors"
          type="button"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          Add Services
        </button>
      </div>

     
      <div class="border border-gray-200 rounded-md overflow-hidden">
        <div class="bg-[#2448B1] text-white grid grid-cols-[70px_1fr_1fr_100px] p-2.5 font-semibold text-xs">
          <div>Image</div>
          <div class="text-white">Type</div>
          <div class="text-white">Description</div>
          <div>Actions</div>
        </div>
        
        {#each services as service (service.id)}
          <div class="grid grid-cols-[70px_1fr_1fr_100px] p-2.5 border-b border-gray-200 last:border-b-0 items-center bg-white hover:bg-gray-50">
            <div>
              <div class="w-10 h-10 rounded overflow-hidden bg-gray-100">
                <img src={service.image} alt="Service {service.type}" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="text-xs text-gray-700">{service.type}</div>
            <div class="text-xs text-gray-700">{service.description}</div>
            <div class="flex gap-1">
              <button 
                on:click={() => handleEditService(service)} 
                class="py-1 px-2 border-none rounded bg-[#1E3A8A] text-white cursor-pointer text-[10px] font-semibold transition-all duration-200"
                type="button"
              >
                Edit
              </button>
              <button 
                on:click={() => handleDeleteService(service.id)} 
                class="py-1 px-2 border-none rounded bg-[#FF0000] text-white cursor-pointer text-[10px] font-semibold transition-all duration-200"
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

 
  {#if showAddServiceModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5 box-border" on:click={handleModalClick}>
      <div class="bg-white rounded-lg w-96 max-w-[90%] max-h-[90%] overflow-y-auto shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" on:click={handleModalContentClick}>
        <div class="p-4 px-5 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-base font-semibold text-gray-800 m-0">{editingService ? 'Edit Service' : 'Add Service'}</h3>
          <button 
            on:click={closeModal} 
            class="bg-transparent border-none cursor-pointer p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            type="button"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        
        <div class="p-4 px-5">
          <div class="mb-3 last:mb-0">
            <label for="service_name" class="block mb-1 font-semibold text-gray-700 text-xs">Service Name</label>
            <input 
              type="text" 
              id="service_name"
              bind:value={newServiceName}
              placeholder={editingService ? "Managed services" : "add service name"}
              class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
            />
          </div>
          
          <div class="mb-3 last:mb-0">
            <label for="service_description" class="block mb-1 font-semibold text-gray-700 text-xs">Description</label>
            <textarea 
              id="service_description"
              bind:value={newServiceDescription}
              placeholder={editingService ? "Custom website development" : "add description"}
              rows="3"
              class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 resize-y min-h-[60px] focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
            ></textarea>
          </div>
          
          <div class="mb-0">
            <label for="service_image" class="block mb-1 font-semibold text-gray-700 text-xs">Services Image</label>
            <div 
              class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-all duration-200 relative hover:border-[#2448B1] hover:bg-slate-50" 
              on:click={handleImageAreaClick}
              on:dragover={handleDragOver}
              on:dragleave={handleDragLeave}
              on:drop={handleDrop}
            >
              {#if imagePreviewUrl}
                <div class="flex flex-col items-center">
                  <img src={imagePreviewUrl} alt="Service preview" class="w-32 h-24 object-contain rounded-md shadow-sm mb-2" />
                  <p class="text-[#2448B1] text-xs font-medium">Click to change image</p>
                </div>
              {:else}
                <div class="text-gray-500 text-xs">
                  <span>Click to upload image</span>
                </div>
              {/if}
              <input 
                type="file" 
                id="service_image"
                accept="image/jpeg,image/png,image/svg+xml" 
                on:change={handleImageUpload}
                style="display: none;"
                bind:this={newServiceImage}
              />
            </div>
            <p class="text-gray-500 text-xs mt-2 text-center">File must be JPG, PNG, or SVG. Maximum size: 5MB.</p>
          </div>
          
          <div class="flex justify-end gap-2 mt-4">
            <button 
              on:click={closeModal} 
              class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white"
              type="button"
            >
              Cancel
            </button>
            <button 
              on:click={saveService} 
              class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white"
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  
  {#if showDeleteModal}
   
    <div class="fixed inset-0 w-full h-full bg-black/60 flex items-center justify-center z-[1001] p-4" on:click={handleDeleteModalClick} role="button" tabindex="0" on:keydown={() => {}}>
      <div class="bg-white rounded-[10px] w-[350px] max-w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] relative p-6 text-center">
        <button class="absolute top-3 right-3 text-gray-400 bg-none border-none cursor-pointer p-1.5 rounded hover:bg-gray-100 hover:text-gray-600" on:click={closeDeleteModal}>
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
        <div class="w-[60px] h-[60px] bg-[#ff0000] rounded-full mx-auto mb-4 flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-[28px] font-bold">close</span>
        </div>
        <h3 class="text-[18px] font-bold text-[#1e293b] m-0 mb-2">Delete this service?</h3>
        <p class="text-[13px] text-[#6b7280] m-0">This action cannot be undone.</p>
        <button 
          class="bg-[#ff0000] text-white px-6 py-2 rounded-md text-[12px] font-bold mt-4 cursor-pointer hover:bg-[#dc2626]" 
          on:click={confirmDelete}
        >Delete</button>
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
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    background: transparent !important;
  }
</style>