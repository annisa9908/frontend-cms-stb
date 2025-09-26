<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  //untuk mendefinisikan tipe data untuk produk
  interface Product {
    id: number;
    name: string;
    image: string | null;
  }

  // state reaktif untuk menyimpan daftar produk
  let products = $state<Product[]>([]);
  let isLoading = $state<boolean>(false);
  let uploadProgress = $state<number>(0);

  onMount(() => {
    loadProducts();
    loadSectionSettings();
  });

  async function loadProducts () {
    const token = localStorage.getItem("accessToken");
    const response = await fetch("http://localhost:1337/api/products?populate=image", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    const body = await response.json();
    products = body.data.map((e: any) => ({
      id: e.documentId,
      name: e.product_name,
      image: e.image ? "http://localhost:1337" + e.image.url : null
    }));
  };

  async function loadSectionSettings(){
    const token = localStorage.getItem("accessToken");
  const res = await fetch("http://localhost:1337/api/product-section-setting", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });
  const body = await res.json();
  console.log("Section Settings Response:", body);

  sectionTitle = body.data.title;
  sectionDescription = body.data.description.map((p: any) => p.children.map((c: any) => c.text).join(" ")).join("\n\n");}

  // Function to upload image to Strapi
  async function uploadImageToStrapi(file: File): Promise<any> {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch("http://localhost:1337/api/upload", {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await response.json();
    return result[0]; // Strapi returns array of uploaded files
  }

  // Function to create product in Strapi
  async function createProductInStrapi(productData: any): Promise<any> {
    const token = localStorage.getItem("accessToken");
    
    const response = await fetch("http://localhost:1337/api/products", {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: productData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return await response.json();
  }

  // Function to update product in Strapi
  async function updateProductInStrapi(productId: string, productData: any): Promise<any> {
    const token = localStorage.getItem("accessToken");
    
    const response = await fetch(`http://localhost:1337/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: productData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return await response.json();
  }

  // Function to delete product from Strapi
  async function deleteProductFromStrapi(productId: string): Promise<void> {
    const token = localStorage.getItem("accessToken");
    
    const response = await fetch(`http://localhost:1337/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  }

  // Function to update section settings in Strapi
  async function updateSectionSettingsInStrapi(): Promise<void> {
    const token = localStorage.getItem("accessToken");
    
    // Convert description back to rich text format
    const descriptionBlocks = sectionDescription.split('\n\n').map(paragraph => ({
      type: 'paragraph',
      children: [{ type: 'text', text: paragraph }]
    }));

    const response = await fetch("http://localhost:1337/api/product-section-setting", {
      method: 'PUT',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: {
          title: sectionTitle,
          description: descriptionBlocks
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update section settings');
    }
  }

  // State untuk pengelolaan input dan modal
  let sectionTitle = $state<string>('');
  let sectionDescription = $state<string>('');
  let showAddModal = $state<boolean>(false);
  let showEditModal = $state<boolean>(false);
  let showDeleteModal = $state<boolean>(false);
  let showSuccessModal = $state<boolean>(false);
  let showErrorModal = $state<boolean>(false);
  let productName = $state<string>('');
  let editProductName = $state<string>('');
  let currentEditId = $state<number | null>(null);
  let currentDeleteId = $state<number | null>(null);
  let currentImage = $state<string | null>(null);
  let editCurrentImage = $state<string | null>(null);
  let currentImageFile = $state<File | null>(null);
  let editCurrentImageFile = $state<File | null>(null);
  let errorMessage = $state<string>('');

  // Navigasi ke halaman pengaturan
  function goToProfileSettings(): void {
    goto('/admin/dashboard-setting');
  }

  // Menangani unggahan gambar melalui input file
  function handleImageUpload(event: Event, isEdit: boolean = false): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

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

    // Store the file for upload
    if (isEdit) {
      editCurrentImageFile = file;
    } else {
      currentImageFile = file;
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

  // Menangani event drag-over untuk unggahan gambar
  function handleDragOver(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.style.borderColor = '#2448B1';
    target.style.background = '#eff6ff';
  }

  // Menangani event drag-leave untuk unggahan gambar
  function handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.style.borderColor = '#d1d5db';
    target.style.background = '#f9fafb';
  }

  // Menangani event drop untuk unggahan gambar
  function handleDrop(event: DragEvent, isEdit: boolean = false): void {
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

      // Store the file for upload
      if (isEdit) {
        editCurrentImageFile = file;
      } else {
        currentImageFile = file;
      }

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

  // Menghapus gambar yang telah diunggah
  function removeImage(isEdit: boolean = false): void {
    if (isEdit) {
      editCurrentImage = null;
      editCurrentImageFile = null;
    } else {
      currentImage = null;
      currentImageFile = null;
    }
  }

  // Menyimpan perubahan section settings
  async function saveChanges(): Promise<void> {
    if (!sectionTitle.trim()) {
      errorMessage = 'Title is required!';
      showErrorModal = true;
      return;
    }

    try {
      isLoading = true;
      await updateSectionSettingsInStrapi();
      showSuccessModal = true;
    } catch (error) {
      console.error('Error saving changes:', error);
      errorMessage = 'Failed to save changes. Please try again.';
      showErrorModal = true;
    } finally {
      isLoading = false;
    }
  }

  // Menutup modal sukses
  function closeSuccessModal(): void {
    showSuccessModal = false;
  }

  // Menutup modal error
  function closeErrorModal(): void {
    showErrorModal = false;
    errorMessage = '';
  }

  // Membuka modal untuk menambah produk
  function addProduct(): void {
    showAddModal = true;
  }

  // Menutup modal tambah produk dan mereset input
  function closeAddModal(): void {
    showAddModal = false;
    productName = '';
    currentImage = null;
    currentImageFile = null;
  }

  // Menyimpan produk baru ke database
  async function saveProduct(): Promise<void> {
    if (!productName.trim()) {
      alert('Please enter product name!');
      return;
    }

    try {
      isLoading = true;
      uploadProgress = 0;

      let imageId = null;
      
      // Upload image if exists
      if (currentImageFile) {
        uploadProgress = 30;
        const uploadedImage = await uploadImageToStrapi(currentImageFile);
        imageId = uploadedImage.id;
        uploadProgress = 60;
      }

      // Create product data
      const productData: any = {
        product_name: productName.trim()
      };

      // Add image if uploaded
      if (imageId) {
        productData.image = imageId;
      }

      uploadProgress = 80;
      
      // Create product in Strapi
      const result = await createProductInStrapi(productData);
      
      uploadProgress = 90;

      // Reload products from server to get complete data including populated image
      await loadProducts();
      
      uploadProgress = 100;

      closeAddModal();
      showSuccessModal = true;
    } catch (error) {
      console.error('Error saving product:', error);
      errorMessage = 'Failed to save product. Please try again.';
      showErrorModal = true;
    } finally {
      isLoading = false;
      uploadProgress = 0;
    }
  }

  // Membuka modal edit untuk produk tertentu
  function editProduct(id: number): void {
    const product = products.find((p: Product) => p.id === id);
    if (product) {
      currentEditId = id;
      editProductName = product.name;
      editCurrentImage = product.image;
      editCurrentImageFile = null;
      showEditModal = true;
    }
  }

  // Menutup modal edit dan mereset input
  function closeEditModal(): void {
    showEditModal = false;
    editProductName = '';
    currentEditId = null;
    editCurrentImage = null;
    editCurrentImageFile = null;
  }

  // Memperbarui produk di database
  async function updateProduct(): Promise<void> {
    if (!editProductName.trim()) {
      alert('Please enter product name!');
      return;
    }

    if (!currentEditId) return;

    try {
      isLoading = true;
      uploadProgress = 0;

      let imageId = null;
      
      // Upload new image if exists
      if (editCurrentImageFile) {
        uploadProgress = 30;
        const uploadedImage = await uploadImageToStrapi(editCurrentImageFile);
        imageId = uploadedImage.id;
        uploadProgress = 60;
      }

      // Create product data
      const productData: any = {
        product_name: editProductName.trim()
      };

      // Add image if uploaded
      if (imageId) {
        productData.image = imageId;
      }

      uploadProgress = 80;
      
      // Update product in Strapi
      await updateProductInStrapi(currentEditId.toString(), productData);
      
      uploadProgress = 90;

      // Reload products from server to get complete updated data
      await loadProducts();
      
      uploadProgress = 100;

      closeEditModal();
      showSuccessModal = true;
    } catch (error) {
      console.error('Error updating product:', error);
      errorMessage = 'Failed to update product. Please try again.';
      showErrorModal = true;
    } finally {
      isLoading = false;
      uploadProgress = 0;
    }
  }

  // Membuka modal konfirmasi hapus
  function deleteProduct(id: number): void {
    currentDeleteId = id;
    showDeleteModal = true;
  }

  // Menutup modal hapus
  function closeDeleteModal(): void {
    showDeleteModal = false;
    currentDeleteId = null;
  }

  // Mengkonfirmasi penghapusan produk dari database
  async function confirmDelete(): Promise<void> {
    if (!currentDeleteId) return;

    try {
      isLoading = true;
      
      // Delete from Strapi
      await deleteProductFromStrapi(currentDeleteId.toString());
      
      // Reload products from server to reflect changes
      await loadProducts();
      
      closeDeleteModal();
      showSuccessModal = true;
    } catch (error) {
      console.error('Error deleting product:', error);
      errorMessage = 'Failed to delete product. Please try again.';
      showErrorModal = true;
    } finally {
      isLoading = false;
    }
  }

  // Mencegah penutupan modal saat konten di dalamnya diklik
  function handleModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
</script>

<svelte:head>
  <!-- Memuat font Google Material Symbols untuk ikon -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<!-- Loading overlay -->
{#if isLoading}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1002]" role="dialog" aria-modal="true">
    <div class="bg-white rounded-lg p-6 shadow-xl">
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2448B1]"></div>
        <span class="text-sm font-medium">
          {#if uploadProgress > 0}
            Uploading... {uploadProgress}%
          {:else}
            Processing...
          {/if}
        </span>
      </div>
      {#if uploadProgress > 0}
        <div class="mt-3 w-48 bg-gray-200 rounded-full h-2">
          <div class="bg-[#2448B1] h-2 rounded-full transition-all duration-300" style="width: {uploadProgress}%"></div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Modal sukses untuk menunjukkan perubahan tersimpan -->
{#if showSuccessModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-5 box-border" role="dialog" aria-modal="true">
    <div class="bg-white rounded-2xl w-80 max-w-[90%] shadow-2xl relative" on:click|stopPropagation>
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
          aria-label="Close success modal"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal error untuk menunjukkan kesalahan -->
{#if showErrorModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-5 box-border" role="dialog" aria-modal="true">
    <div class="bg-white rounded-xl p-5 text-center shadow-2xl w-80 max-w-[90%]" on:click|stopPropagation>
      <div class="w-12 h-12 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span class="material-symbols-outlined text-white text-2xl font-bold">close</span>
      </div>
      <h2 class="text-base font-semibold text-gray-800 mb-2">Error!</h2>
      <p class="text-sm text-gray-600 mb-4">{errorMessage}</p>
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

<!-- Kontainer utama untuk halaman manajemen produk -->
<div class="w-full min-h-screen bg-slate-100 font-inter text-slate-800 leading-relaxed">
  <div class="p-0 pb-4 flex flex-col gap-3">
    <!-- Header dengan tombol simpan dan pengaturan -->
    <div class="bg-[#2448B1] rounded-lg mx-4 mt-4 p-4 shadow-md border border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-white text-xl font-bold mb-0.5 leading-tight">Products</h1>
          <p class="text-white text-sm font-normal m-0">Manage products page content</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            class="bg-green-600 hover:bg-green-700 text-white border-none py-2 px-3 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed" 
            on:click={saveChanges}
            disabled={isLoading}
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

    <!-- Pengaturan judul dan deskripsi bagian -->
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

    <!-- Daftar produk dan tombol tambah produk -->
    <div class="bg-white rounded-lg p-4 shadow-md border border-gray-200 mx-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-base font-semibold text-gray-800">Manage Products</h3>
        <button 
          class="bg-green-600 hover:bg-green-700 text-white border-none py-1.5 px-2.5 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={addProduct}
          disabled={isLoading}
          type="button"
          aria-label="Add product"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          Add Product
        </button>
      </div>

      <!-- Tabel produk -->
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
                class="py-1 px-2 border-none rounded bg-[#1E3A8A] text-white cursor-pointer text-[10px] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={() => editProduct(product.id)}
                disabled={isLoading}
                type="button"
                aria-label={`Edit ${product.name}`}
              >
                Edit
              </button>
              <button 
                class="py-1 px-2 border-none rounded bg-[#FF0000] text-white cursor-pointer text-[10px] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={() => deleteProduct(product.id)}
                disabled={isLoading}
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

<!-- Modal untuk menambah produk -->
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
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={closeAddModal}
            disabled={isLoading}
            type="button"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={saveProduct}
            disabled={isLoading}
            type="button"
            aria-label="Save product"
          >
            {#if isLoading}
              Saving...
            {:else}
              Save
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Modal untuk mengedit produk -->
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
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#5A5A5A] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={closeEditModal}
            disabled={isLoading}
            type="button"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button 
            class="py-2 px-4 border-none rounded cursor-pointer text-xs font-semibold transition-all duration-200 bg-[#1E3A8A] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={updateProduct}
            disabled={isLoading}
            type="button"
            aria-label="Save product"
          >
            {#if isLoading}
              Updating...
            {:else}
              Save
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Modal konfirmasi hapus produk -->
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
      <p class="text-[13px] text-[#6b7280] m-0 mb-4">This action cannot be undone.</p>
      <div class="flex gap-2 justify-center">
        <button 
          class="bg-[#5A5A5A] text-white px-4 py-2 rounded-md text-[12px] font-bold cursor-pointer hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed" 
          on:click={closeDeleteModal}
          disabled={isLoading}
          type="button"
          aria-label="Cancel delete"
        >
          Cancel
        </button>
        <button 
          class="bg-[#ff0000] text-white px-4 py-2 rounded-md text-[12px] font-bold cursor-pointer hover:bg-[#dc2626] disabled:opacity-50 disabled:cursor-not-allowed" 
          on:click={confirmDelete}
          disabled={isLoading}
          type="button"
          aria-label="Confirm delete"
        >
          {#if isLoading}
            Deleting...
          {:else}
            Delete
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @import "tailwindcss";
  :global(.material-symbols-outlined) {
    font-family: 'Material Symbols Outlined';
    font-size: 16px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

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

  :global(button) {
    cursor: pointer;
  }

  :global(button:focus-visible) {
    outline: 2px solid #2448B1;
    outline-offset: 2px;
  }

  :global(input:focus-visible),
  :global(textarea:focus-visible) {
    outline: 2px solid #2448B1;
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    .btn-text-mobile-hidden {
      display: none;
    }
  }

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

  @media (prefers-contrast: high) {
    :global(input),
    :global(textarea) {
      border-width: 2px;
    }

    :global(.border) {
      border-width: 2px;
    }
  }
  @media (prefers-color-scheme: dark) {
    :global(body) {
      background: #0f172a;
      color: #e2e8f0;
    }
  }

  @media print {
    :global(.fixed),
    :global(button) {
      display: none !important;
    } 
  }
</style>