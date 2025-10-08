<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
	import api from '$lib/axios-instance';
	import { env } from '$env/dynamic/public';
    import { userName, userEmail } from '$lib/store';
    
    let userId = $state(null); 
    let selectedFile: File | null = $state(null);
    let fullName = $state('');
    let email = $state('');
    let password = $state('');
    let bio = $state('');
    let profileImageSrc = $state('/api/placeholder/120/120');
    let isSubmitting = $state(false);
    let showSuccessMessage = $state(false);
    let showInlineSuccess = $state(false);
    
    let errors = $state({
        fullName: '',
        email: '',
        password: '',
        bio: '',
        image: '',
        general: ''
    });

    onMount(async() => {
        try {
            const res = await api.get("/api/users/me?populate=image");
            const body = res.data;
            console.log("User Data:", body);

            userId = body.id;
            fullName = body.username || "";
            password = "";
            email = body.email || "";
            bio = body.bio || "";
            profileImageSrc = body.image ? env.PUBLIC_BASE_URL + body.image.url : "/api/placeholder/120/120";
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            goto("/login");
        }
    });

    let fileInput: HTMLInputElement | null = $state(null);
    let profileImage: HTMLImageElement | null = $state(null);

    function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string): boolean {
        return password.length === 0 || password.length >= 6;
    }

    function showError(field: string, message: string): void {
        errors = { ...errors, [field]: message };
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
            fieldElement.classList.add('shake');
            setTimeout(() => {
                fieldElement.classList.remove('shake');
            }, 500);
        }
    }

    function clearError(field: string): void {
        errors = { ...errors, [field]: '' };
    }

    function clearAllErrors() {
        errors = {
            fullName: '',
            email: '',
            password: '',
            bio: '',
            image: '',
            general: ''
        };
    }

    function handleNameInput(): void {
        if (fullName.trim()) {
            clearError('fullName');
        }
    }

    function handleEmailInput(): void {
        if (email && !validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
        } else {
            clearError('email');
        }
    }

    function handlePasswordInput(): void {
        if (password && !validatePassword(password)) {
            showError('password', 'Password must be at least 6 characters long');
        } else {
            clearError('password');
        }
    }

    function handleFileUpload(event: Event): void {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImageSrc = e.target?.result as string;
            };
            reader.readAsDataURL(file);
            clearError('image');
        } else {
            showError('image', 'Please select an image file');
        }
    }

    function redirectToDashboard(): void {
        goto('/admin');
    }

    function goBack(): void {
        window.history.back();
    }

    async function handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        clearAllErrors();
        
        let hasErrors = false;
        
        if (!fullName.trim()) {
            showError('fullName', 'Full name is required');
            hasErrors = true;
        }
        
        if (email.trim() && !validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        if (password && !validatePassword(password)) {
            showError('password', 'Password must be at least 6 characters long');
            hasErrors = true;
        }
        
        if (!bio.trim()) {
            showError('bio', 'Bio cannot be empty');
            hasErrors = true;
        }
        
        if (hasErrors) {
            return;
        }
        
        isSubmitting = true;
        showInlineSuccess = false;

        try {
            let imageId: number | null = null;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('files', selectedFile);

                const uploadResponse = await api.post('/api/upload', formData);
                imageId = uploadResponse.data[0].id;
            }

            const userData: any = {
                username: fullName,
                bio: bio
            };
            if (email) userData.email = email;
            if (password) userData.password = password;
            if (imageId) userData.image = imageId;

            const updateResponse = await api.put(`/api/users/${userId}`, userData);
            console.log(' Profile updated:', updateResponse.data);

            //  Ambil ulang data user lengkap dengan image
            const refreshed = await api.get('/api/users/me?populate=image');
            const updatedUser = refreshed.data;
            const newEmail = updatedUser.email;
            const newAvatar = updatedUser.image 
                ? env.PUBLIC_BASE_URL + updatedUser.image.url 
                : "/api/placeholder/120/120";
            
            profileImageSrc = newAvatar;

            console.log(' Updated user data:', {
                userName: fullName,
                userEmail: newEmail,
                userAvatar: newAvatar
            });

            //  Update localStorage
            localStorage.setItem('userName', fullName);
            localStorage.setItem('userEmail', newEmail);
            localStorage.setItem('userAvatar', newAvatar);
            
            //  Update Svelte stores
            userName.set(fullName);
            userEmail.set(newEmail);

            //  TRIGGER CUSTOM EVENT untuk notify layout
            window.dispatchEvent(new CustomEvent('userDataUpdated', {
                detail: {
                    userName: fullName,
                    userEmail: newEmail,
                    userAvatar: newAvatar
                }
            }));

            console.log(' User data updated and event dispatched successfully');

            isSubmitting = false;
            showInlineSuccess = true;
            showSuccessMessage = true;
            createParticles();

            setTimeout(() => {
                redirectToDashboard();
            }, 2000);

        } catch (error: any) {
            isSubmitting = false;
            showError("general", 
            error.response?.data?.error?.message ||
            error.message ||  'An error occurred while saving profile.');
            console.error(" Error updating profile:", error);
        }
    }
    
    function closeModalAndRedirect(): void {
        showSuccessMessage = false;
        redirectToDashboard();
    }
    
    function createParticles(): void {
        const container = document.querySelector('.profile-container');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #2448B1;
                border-radius: 50%;
                pointer-events: none;
                animation: particle-float 2s ease-out forwards;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }
    
    function handleFocus(event: FocusEvent): void {
        const target = event.target as HTMLElement;
        if (target.parentElement) {
            target.parentElement.style.transform = 'translateY(-2px)';
        }
    }
    
    function handleBlur(event: FocusEvent): void {
        const target = event.target as HTMLElement;
        if (target.parentElement) {
            target.parentElement.style.transform = 'translateY(0)';
        }
    }
</script>

<svelte:head>
    <style>
        @keyframes particle-float {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(0);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }

        @keyframes slideInSuccess {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px); 
            }
            to { 
                opacity: 1;
                transform: translateY(0); 
            }
        }

        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            50% {
                opacity: 1;
                transform: scale(1.1);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</svelte:head>

<div class="min-h-screen w-full flex items-center justify-center p-5 bg-gray-100">
    <div class="profile-container bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-gray-200/20 backdrop-blur-lg">
        <div class="page-header mb-6 flex items-center justify-center relative">
            <button class="back-btn absolute left-0 top-1 bg-transparent border-2 border-[#2448B1] text-[#2448B1] px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-[#2448B1] hover:text-white hover:shadow-md cursor-pointer" onclick={goBack} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>
            <h1 class="text-gray-800 text-2xl font-bold mb-2">Profile Settings</h1>
        </div>
        <div class="profile-header text-center mb-8 pb-5 border-b border-gray-200">
            <div class="profile-image-container relative block mx-auto mb-4 w-[90px]">
                <img 
                    src={profileImageSrc} 
                    alt="Profile" 
                    class="profile-image w-[90px] h-[90px] rounded-full object-cover border-4 border-[#2448B1] transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                    bind:this={profileImage}
                />
                <div class="upload-overlay absolute inset-0 bg-[#2448B1]/80 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100 cursor-pointer" onclick={() => fileInput?.click()}></div>
            </div>
            <button class="upload-btn bg-[#2448B1] text-white border-none px-4 py-2 rounded-full cursor-pointer text-xs font-medium transition-all duration-300 hover:bg-[#1e3d99] hover:-translate-y-0.5 hover:shadow-md block mx-auto" onclick={() => fileInput?.click()}>Upload Photo</button>
            <input 
                type="file" 
                bind:this={fileInput}
                class="file-input hidden" 
                accept="image/*"
                onchange={handleFileUpload}
            />
            {#if errors.image}
                <div class="error-message mt-1 text-red-600 text-xs opacity-100 translate-y-0 transition-all duration-300">{errors.image}</div>
            {/if}
        </div>

        <form onsubmit={handleSubmit}>
            <div class="form-group mb-5 relative" class:error={errors.fullName}>
                <label for="fullName" class="block text-gray-800 font-medium mb-1.5 text-sm">Full Name</label>
                <input 
                    type="text" 
                    id="fullName" 
                    class="form-control w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#2448B1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)] focus:-translate-y-0.5 placeholder-gray-400" 
                    placeholder="Enter your full name" 
                    bind:value={fullName}
                    oninput={handleNameInput}
                    onfocus={handleFocus}
                    onblur={handleBlur}
                />
                <div class="error-message mt-1 text-red-600 text-xs opacity-0 -translate-y-1 transition-all duration-300" class:show={errors.fullName}>{errors.fullName}</div>
            </div>

            <div class="form-group mb-5 relative" class:error={errors.email}>
                <label for="email" class="block text-gray-800 font-medium mb-1.5 text-sm">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    class="form-control w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#2448B1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)] focus:-translate-y-0.5 placeholder-gray-400" 
                    placeholder="Enter new email (optional)" 
                    bind:value={email}
                    oninput={handleEmailInput}
                    onfocus={handleFocus}
                    onblur={handleBlur}
                />
                <div class="error-message mt-1 text-red-600 text-xs opacity-0 -translate-y-1 transition-all duration-300" class:show={errors.email}>{errors.email}</div>
            </div>

            <div class="form-group mb-5 relative" class:error={errors.password}>
                <label for="password" class="block text-gray-800 font-medium mb-1.5 text-sm">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    class="form-control w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#2448B1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)] focus:-translate-y-0.5 placeholder-gray-400" 
                    placeholder="Enter new password (optional)"
                    bind:value={password}
                    oninput={handlePasswordInput}
                    onfocus={handleFocus}
                    onblur={handleBlur}
                />
                <div class="error-message mt-1 text-red-600 text-xs opacity-0 -translate-y-1 transition-all duration-300" class:show={errors.password}>{errors.password}</div>
            </div>

            <div class="form-group mb-5 relative" class:error={errors.bio}>
                <label for="bio" class="block text-gray-800 font-medium mb-1.5 text-sm">Bio</label>
                <textarea 
                    id="bio" 
                    class="form-control w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#2448B1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(36,72,177,0.1)] focus:-translate-y-0.5 placeholder-gray-400 resize-y min-h-[70px]" 
                    placeholder="Ga ngoding Ga makan!"
                    bind:value={bio}
                    onfocus={handleFocus}
                    onblur={handleBlur}
                ></textarea>
                <div class="error-message mt-1 text-red-600 text-xs opacity-0 -translate-y-1 transition-all duration-300" class:show={errors.bio}>{errors.bio}</div>
            </div>
            {#if errors.general}
                <div class="error-message mt-1 text-red-600 text-xs opacity-100 translate-y-0 transition-all duration-300">{errors.general}</div>
            {/if}

            <button type="submit" class="save-btn w-full bg-[#2448B1] text-white border-none p-3.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#1e3d99] hover:-translate-y-0.5 hover:shadow-xl relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed mb-4" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>

            {#if showInlineSuccess}
                <div class="inline-success-message bg-green-100 text-green-800 border border-green-200 rounded-lg p-3 mt-4 flex items-center gap-2 text-sm font-medium animate-slideInSuccess">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#4CAF50"/>
                        <path d="M8 10L9 11L12 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Profile updated successfully! Redirecting to dashboard...
                </div>
            {/if}
        </form>
    </div>
</div>

{#if showSuccessMessage}
    <div 
        class="modal-overlay fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1000] opacity-0 animate-fadeIn" 
        onclick={closeModalAndRedirect} 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="success-title"
        aria-describedby="success-description"
    >
        <div class="success-modal bg-white rounded-2xl p-6 text-center shadow-2xl relative w-[90%] max-w-[350px] mx-5 translate-y-5 animate-slideUp" onclick={(e) => e.stopPropagation()}>
            <button 
                class="close-btn absolute top-3 right-3 bg-transparent border-none text-gray-500 text-xl cursor-pointer w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-100 hover:text-gray-700" 
                onclick={closeModalAndRedirect} 
                aria-label="Close success message"
                type="button"
            >
                ×
            </button>
            <div class="success-icon mb-4 animate-bounceIn" aria-hidden="true">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" role="img" aria-label="Success checkmark">
                    <circle cx="30" cy="30" r="30" fill="#4CAF50"/>
                    <path d="M25 30L28 33L35 26" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2 id="success-title" class="text-gray-800 text-xl font-semibold mb-1.5 opacity-0 animate-fadeInUp [animation-delay:0.4s]">Changes Saved</h2>
            <p id="success-description" class="text-gray-600 text-sm mb-4 opacity-0 animate-fadeInUp [animation-delay:0.5s]">Your changes have been saved successfully. Redirecting to dashboard...</p>
            <button class="dashboard-btn bg-[#2448B1] text-white border-none px-5 py-2.5 rounded-full cursor-pointer text-sm font-semibold transition-all duration-300 hover:bg-[#1e3d99] hover:-translate-y-0.5 hover:shadow-md opacity-0 animate-fadeInUp [animation-delay:0.6s]" onclick={closeModalAndRedirect} type="button">
                Go to Dashboard
            </button>
        </div>
    </div>
{/if}

<style>
    @reference "tailwindcss";
    /* Animations */
    @keyframes particle-float {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }

    @keyframes slideInSuccess {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(20px); 
        }
        to { 
            opacity: 1;
            transform: translateY(0); 
        }
    }

    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .form-group.error .form-control {
        @apply border-red-500 bg-red-50;
    }

    .error-message.show {
        @apply opacity-100 translate-y-0;
    }

    .save-btn::before {
        content: '';
        @apply absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-[left] duration-500;
    }

    .save-btn:hover::before {
        @apply left-full;
    }
</style>