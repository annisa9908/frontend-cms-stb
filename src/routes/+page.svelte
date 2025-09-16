<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let isLoaded = false;

  onMount(() => {
    isLoaded = true;
  });

  function goToLogin() {
    goto('/login');
  }
</script>

<main class="h-screen bg-gradient-to-br from-[#E6F0FA] to-[#CECF6F9] py-8 px-6 overflow-hidden">
  <div class="container mx-auto max-w-7xl h-full flex items-center">
    <div class="flex flex-col lg:flex-row items-center justify-between gap-8 w-full">
      
     
      <div class="lg:w-1/2 space-y-6 lg:ml-8" class:fade-in={isLoaded}>
        
        <div class="space-y-2">
          <h1 class="text-5xl lg:text-6xl font-bold gradient-text">CMS</h1>
          <div class="w-20 h-1 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] rounded-full"></div>
        </div>
        
       
        <div class="space-y-4">
          <h2 class="text-2xl lg:text-3xl font-bold text-[#1E40AF] leading-tight">
            Welcome to Solusi Tiga Bersama Company CMS
          </h2>
          
          <p class="text-base text-[#4B6CB7] leading-relaxed max-w-lg">
            A centralized platform to manage your company’s website and content easily and securely.
          </p>
          
       
          <div class="space-y-3">
            <div class="flex items-center space-x-3 text-[#4B6CB7]">
              <div class="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
              <span>Manage Company Website</span>
            </div>
            <div class="flex items-center space-x-3 text-[#4B6CB7]">
              <div class="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
              <span>Update Services & Products</span>
            </div>
            <div class="flex items-center space-x-3 text-[#4B6CB7]">
              <div class="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
              <span>Centralized Communication</span>
            </div>
          </div>
          
       
          <div class="pt-2">
            <button 
              on:click={goToLogin}
              class="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white font-semibold py-4 px-8 rounded-xl hover:from-[#173d9a] hover:to-[#2f67d3] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Log in to CMS →
            </button>
          </div>
        </div>
      </div>
      
    
      <div class="lg:w-1/2 flex justify-center">
        <div class="relative" class:floating={isLoaded}>
          
         
          <div class="absolute -top-6 -left-6 w-12 h-12 bg-[#FFA500] rounded-full opacity-80"></div>
          <div class="absolute -bottom-4 -right-4 w-8 h-8 bg-[#3B82F6] rounded-full opacity-60"></div>
          
         
          <div class="relative bg-[#1E40AF] p-4 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div class="bg-white rounded-md p-4 w-72 h-48">
              
              
              <div class="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
                <div class="flex space-x-1">
                  <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div class="flex-1 bg-gray-100 rounded px-3 py-1 text-xs text-gray-500">
                  cms.website.com
                </div>
              </div>
              
              
              <div class="space-y-3">
                
                <div class="flex space-x-4 text-xs">
                  <span class="text-[#3B82F6] font-semibold border-b-2 border-[#3B82F6] pb-1">Dashboard</span>
                  <span class="text-gray-400">Posts</span>
                  <span class="text-gray-400">Media</span>
                  <span class="text-gray-400">Users</span>
                </div>
                
               
                <div class="space-y-1">
                  <div class="bg-blue-50 p-2 rounded border-l-4 border-[#3B82F6]">
                    <div class="flex justify-between items-center">
                      <div class="space-y-1">
                        <div class="w-20 h-2 bg-[#1E40AF] rounded"></div>
                        <div class="w-16 h-1 bg-gray-300 rounded"></div>
                      </div>
                      <div class="w-6 h-6 bg-[#FFA500] rounded flex items-center justify-center">
                        <span class="text-white text-xs">170</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="bg-gray-50 p-2 rounded">
                    <div class="flex space-x-2">
                      <div class="w-4 h-4 bg-[#3B82F6] rounded"></div>
                      <div class="flex-1 space-y-1">
                        <div class="w-full h-2 bg-gray-300 rounded"></div>
                        <div class="w-3/4 h-1 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="bg-gray-50 p-2 rounded">
                    <div class="flex space-x-2">
                      <div class="w-4 h-4 bg-gray-300 rounded"></div>
                      <div class="flex-1 space-y-1">
                        <div class="w-full h-2 bg-gray-300 rounded"></div>
                        <div class="w-2/3 h-1 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div class="w-16 h-8 bg-[#1E40AF] rounded-b-lg"></div>
              <div class="w-24 h-2 bg-[#1E40AF] rounded-full mt-1"></div>
            </div>
          </div>
          
         
          <div class="absolute -right-6 top-6 bg-white p-3 rounded-lg shadow-lg transform rotate-12 hover:rotate-6 transition-transform duration-300">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <div class="w-5 h-5 bg-[#3B82F6] rounded flex items-center justify-center">
                  <span class="text-white text-xs font-bold">Aa</span>
                </div>
                <div class="w-12 h-2 bg-gray-300 rounded"></div>
              </div>
              <div class="space-y-1">
                <div class="w-16 h-1 bg-blue-200 rounded"></div>
                <div class="w-12 h-1 bg-blue-200 rounded"></div>
                <div class="w-14 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>
          </div>
          
        
          <div class="absolute -top-3 -right-1 w-8 h-8 bg-[#FFA500] rounded-full flex items-center justify-center shadow-lg">
            <span class="text-white text-xs">@</span>
          </div>
          
       
          <div class="absolute top-4 -left-6 bg-[#3B82F6] text-white px-2 py-1 rounded-full text-xs shadow-lg">
            ♥ 170
          </div>
          
         
          <div class="absolute -bottom-4 -left-10">
            <div class="space-y-1">
              <div class="w-12 h-2 bg-[#FFA500] rounded"></div>
              <div class="w-12 h-2 bg-[#87CEEB] rounded"></div>
              <div class="w-12 h-2 bg-[#1E40AF] rounded"></div>
            </div>
          </div>
          
          
          <div class="absolute -top-8 left-6 w-6 h-8 opacity-60">
            <svg viewBox="0 0 24 24" fill="none" class="w-full h-full text-green-500">
              <path d="M12 2C12 2 22 8.5 12 22C12 22 2 8.5 12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #1E40AF, #3B82F6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .floating {
    animation: floating 3s ease-in-out infinite;
  }
  
  @keyframes floating {
    0%, 100% { 
      transform: translateY(0px); 
    }
    50% { 
      transform: translateY(-10px); 
    }
  }
  
  .fade-in {
    animation: fadeIn 1s ease-out;
  }
  
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
 
  @media (max-width: 1024px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    main {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    

    .lg\:ml-8 {
      margin-left: 0;
    }
  }
  
  @media (max-width: 768px) {
    .gradient-text {
      font-size: 2.5rem;
    }
    
    main {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    
    .lg\:w-1\/2 {
      width: 100%;
      margin-bottom: 2rem;
    }
  }
</style>