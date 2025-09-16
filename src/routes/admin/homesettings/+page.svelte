<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  
  
  const dispatch = createEventDispatcher<{
    save: { title: string; description: string };
    logoUpdate: { url: string };
    imageUpdate: { url: string };
  }>();

 
  let deleteType = $state<'logo' | 'image' | ''>('');
  let showEditCompanyLogoModal = $state(false);
  let showEditImageModal = $state(false);
  let showSuccessModal = $state(false);
  let showDeleteModal = $state(false);
  

  let logoFile = $state<HTMLInputElement | null>(null);
  let imageFile = $state<HTMLInputElement | null>(null);
  
  
  let currentLogoUrl = $state('');
  let currentImageUrl = $state('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E');
  

  let tempLogoPreviewUrl = $state('');
  let tempImagePreviewUrl = $state('');
  

  let title = $state('');
  let description = $state('');
  

  let isLogoSaveDisabled = $state(true);
  let isImageSaveDisabled = $state(true);
  let isLogoDeleteDisabled = $state(true);
  let isImageDeleteDisabled = $state(true);

  
  $effect(() => {
   
    isLogoSaveDisabled = !tempLogoPreviewUrl;
    isImageSaveDisabled = !tempImagePreviewUrl || tempImagePreviewUrl === 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E';
    isLogoDeleteDisabled = !currentLogoUrl;
    isImageDeleteDisabled = currentImageUrl === 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E';
  });

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
  
  function handleSettingsClick(): void {
    goto('/admin/dashboard-setting');
  }
  
  function handleFileSelect(event: Event, type: 'logo' | 'image'): void {
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
    if (!tempLogoPreviewUrl) return;
    currentLogoUrl = tempLogoPreviewUrl;
    showEditCompanyLogoModal = false;
    showSuccessModal = true;
    dispatch('logoUpdate', { url: tempLogoPreviewUrl });
    setTimeout(() => {
      showSuccessModal = false;
    }, 3000);
  }
  
  function saveImage(): void {
    if (!tempImagePreviewUrl || tempImagePreviewUrl === 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E') return;
    currentImageUrl = tempImagePreviewUrl;
    showEditImageModal = false;
    showSuccessModal = true;
    dispatch('imageUpdate', { url: tempImagePreviewUrl });
    setTimeout(() => {
      showSuccessModal = false;
    }, 3000);
  }
  
  function confirmDelete(): void {
    if (deleteType === 'logo') {
      currentLogoUrl = '';
    } else if (deleteType === 'image') {
      currentImageUrl = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E';
    }
    closeDeleteModal();
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
    setTimeout(() => {
      showSuccessModal = false;
    }, 3000);
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
        if (type === 'logo') {
          tempLogoPreviewUrl = result;
        } else if (type === 'image') {
          tempImagePreviewUrl = result;
        }
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
          <h1 class="text-white text-xl font-bold mb-0.5 leading-tight">Home Setting</h1>
          <p class="text-white text-sm font-normal m-0">Design Home Page Screen</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            class="bg-green-600 hover:bg-green-700 text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-md" 
            on:click={handleSaveChanges}
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
      <h3 class="text-base font-semibold text-gray-800 mb-3">Home Settings</h3>
      <div class="mb-3 last:mb-0">
        <label for="title-input" class="block mb-1 font-semibold text-gray-700 text-xs">Title</label>
        <input 
          id="title-input"
          type="text" 
          placeholder="Add Title"
          bind:value={title}
          class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
        />
      </div>

      <div class="mb-3 last:mb-0">
        <label for="description-input" class="block mb-1 font-semibold text-gray-700 text-xs">Description</label>
        <textarea 
          id="description-input"
          placeholder="Add Description"
          bind:value={description}
          rows="3"
          class="w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white transition-all duration-200 font-inter placeholder-gray-400 resize-y min-h-[60px] focus:outline-none focus:border-[#2448B1] focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)]"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="text-center w-full">
          <h3 class="mb-3 text-gray-700 text-sm font-semibold">Company Logo</h3>
          <div class="w-full max-w-40 h-28 border-2 border-dashed border-gray-300 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gray-50 relative overflow-hidden transform-none">
            {#if currentLogoUrl}
              <img src={currentLogoUrl} alt="Company Logo" class="max-w-32 max-h-24 object-contain rounded-md shadow-sm transform-none" style="transform: none;">
            {:else}
              <div class="w-15 h-11 bg-white rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 relative shadow-sm transform-none">
                <div class="absolute w-3 h-3 bg-blue-700 rounded-full top-1 left-1/2 transform-none -translate-x-1/2"></div>
                <div class="absolute w-7 h-1.5 bg-green-600 rounded-md bottom-2 left-1/2 transform-none -translate-x-1/2"></div>
              </div>
            {/if}
            <div class="absolute top-1.5 right-1.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold">Current</div>
          </div>
          <div class="flex gap-2 justify-center flex-wrap">
            <button class="text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold transition-all min-w-14" style="background-color: #1E3A8A;" on:click={handleEditCompanyLogo}>Edit</button>
            <button 
              class="text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold transition-all min-w-14" 
              style="background-color: #FF0000;" 
              on:click={() => handleDeleteModal('logo')}
              disabled={isLogoDeleteDisabled}
            >Delete</button>
          </div>
        </div>

        <div class="text-center w-full">
          <h3 class="mb-3 text-gray-700 text-sm font-semibold">Image</h3>
          <div class="w-full max-w-40 h-28 border-2 border-dashed border-gray-300 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <img src={currentImageUrl} alt="Current Image" class="w-24 h-20 object-cover rounded-md shadow-sm">
            <div class="absolute top-1.5 right-1.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold">Current</div>
          </div>
          <div class="flex gap-2 justify-center flex-wrap">
            <button class="text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold transition-all min-w-14" style="background-color: #1E3A8A;" on:click={handleEditImage}>Edit</button>
            <button 
              class="text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold transition-all min-w-14" 
              style="background-color: #FF0000;" 
              on:click={() => handleDeleteModal('image')}
              disabled={isImageDeleteDisabled}
            >Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


{#if showEditCompanyLogoModal}
  <div class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-5 box-border" on:click={handleModalClick}>
    <div class="bg-white rounded-lg w-96 max-w-[90%] max-h-[90%] overflow-y-auto shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" on:click={handleModalContentClick}>
      <div class="p-4 px-5 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-base font-semibold text-gray-800 m-0">Edit Company Logo</h3>
        <button class="bg-transparent border-none cursor-pointer p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700" on:click={closeModal}>
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>
      <div class="p-4 px-5">
        <div 
          class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-all duration-200 relative hover:border-[#2448B1] hover:bg-slate-50" 
          on:click={() => logoFile?.click()}
          on:dragover={handleDragOver}
          on:dragleave={handleDragLeave}
          on:drop={(e) => handleDrop(e, 'logo')}
        >
          {#if tempLogoPreviewUrl}
            <div class="flex flex-col items-center">
              <img src={tempLogoPreviewUrl} alt="Preview" class="w-32 h-24 object-contain rounded-md shadow-sm mb-2" />
              <p class="text-[#2448B1] text-xs font-medium">Click to change image</p>
            </div>
          {:else}
            <div class="text-gray-500 text-xs">
              <span>Click to upload image</span>
            </div>
          {/if}
          <input 
            type="file" 
            bind:this={logoFile}
            accept="image/jpeg,image/png,image/svg+xml" 
            style="display: none;" 
            on:change={(e) => handleFileSelect(e, 'logo')}
          />
        </div>
        <p class="text-gray-500 text-xs mt-2 text-center">File must be JPG, PNG, or SVG. Maximum size: 5MB.</p>
        <div class="flex justify-end gap-2 mt-4">
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white" 
            on:click={closeModal}
          >Cancel</button>
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white" 
            on:click={saveLogo} 
            disabled={isLogoSaveDisabled}
          >Save</button>
        </div>
      </div>
    </div>
  </div>
{/if}


{#if showEditImageModal}
  
  <div class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-5 box-border" on:click={handleModalClick}>
    <div class="bg-white rounded-lg w-96 max-w-[90%] max-h-[90%] overflow-y-auto shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" on:click={handleModalContentClick}>
      <div class="p-4 px-5 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-base font-semibold text-gray-800 m-0">Edit Image</h3>
        <button class="bg-transparent border-none cursor-pointer p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700" on:click={closeModal}>
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>
      <div class="p-4 px-5">
        <div 
          class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-all duration-200 relative hover:border-[#2448B1] hover:bg-slate-50" 
          on:click={() => imageFile?.click()}
          on:dragover={handleDragOver}
          on:dragleave={handleDragLeave}
          on:drop={(e) => handleDrop(e, 'image')}
        >
          {#if tempImagePreviewUrl && tempImagePreviewUrl !== 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'105\' viewBox=\'0 0 140 105\'%3E%3Crect width=\'140\' height=\'105\' fill=\'%23E3F2FD\' rx=\'8\'/%3E%3Cpath d=\'M20 85 L35 65 L50 75 L70 55 L85 70 L120 35 L120 90 L20 90 Z\' fill=\'%2310b981\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'8\' fill=\'%23FFC107\'/%3E%3Cpath d=\'M100 20 L115 30 L100 40 L85 30 Z\' fill=\'%23ef4444\'/%3E%3C/svg%3E'}
            <div class="flex flex-col items-center">
              <img src={tempImagePreviewUrl} alt="Preview" class="w-32 h-24 object-contain rounded-md shadow-sm mb-2" />
              <p class="text-[#2448B1] text-xs font-medium">Click to change image</p>
            </div>
          {:else}
            <div class="text-gray-500 text-xs">
              <span>Click to upload image</span>
            </div>
          {/if}
          <input 
            type="file" 
            bind:this={imageFile}
            accept="image/jpeg,image/png,image/svg+xml" 
            style="display: none;" 
            on:change={(e) => handleFileSelect(e, 'image')}
          />
        </div>
        <p class="text-gray-500 text-xs mt-2 text-center">File must be JPG, PNG, or SVG. Maximum size: 5MB.</p>
        <div class="flex justify-end gap-2 mt-4">
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white" 
            on:click={closeModal}
          >Cancel</button>
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white" 
            on:click={saveImage} 
            disabled={isImageSaveDisabled}
          >Save</button>
        </div>
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
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Changes Saved</h3>
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
  <div class="fixed inset-0 w-full h-full bg-black/60 flex items-center justify-center z-[1001] p-4" on:click={handleDeleteModalClick} role="button" tabindex="0" on:keydown={() => {}}>
    <div class="bg-white rounded-[10px] w-[350px] max-w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] relative p-6 text-center">
      <button class="absolute top-3 right-3 text-gray-400 bg-none border-none cursor-pointer p-1.5 rounded hover:bg-gray-100 hover:text-gray-600" on:click={closeDeleteModal}>
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
      <div class="w-[60px] h-[60px] bg-[#ff0000] rounded-full mx-auto mb-4 flex items-center justify-center">
        <span class="material-symbols-outlined text-white text-[28px] font-bold">close</span>
      </div>
      <h3 class="text-[18px] font-bold text-[#1e293b] m-0 mb-2">Delete this {deleteType}?</h3>
      <p class="text-[13px] text-[#6b7280] m-0">This action cannot be undone.</p>
      <button 
        class="bg-[#ff0000] text-white px-6 py-2 rounded-md text-[12px] font-bold mt-4 hover:bg-[#dc2626] cursor-pointer" 
        on:click={confirmDelete}
      >Delete</button>
    </div>
  </div>
{/if}

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

  button:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
</style>