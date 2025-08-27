<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    // State variables
    let fullName: string = '';
    let email: string = '';
    let password: string = '';
    let bio: string = '';
    let profileImageSrc: string = '/api/placeholder/120/120';
    let isSubmitting: boolean = false;
    let showSuccessMessage: boolean = false;
    let showInlineSuccess: boolean = false;
    
    let errors: Record<string, string> = {
        fullName: '',
        email: '',
        password: '',
        bio: ''
    };

    let fileInput: HTMLInputElement | null = null;
    let profileImage: HTMLImageElement | null = null;

    function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string): boolean {
        return password.length === 0 || password.length >= 6;
    }

    function showError(field: string, message: string): void {
        errors[field] = message;
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
            fieldElement.classList.add('shake');
            setTimeout(() => {
                fieldElement.classList.remove('shake');
            }, 500);
        }
    }

    function clearError(field: string): void {
        errors[field] = '';
    }

    function clearAllErrors() {
        errors = {
            fullName: '',
            email: '',
            password: '',
            bio: ''
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
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImageSrc = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    // Fungsi untuk redirect ke dashboard admin
    function redirectToDashboard(): void {
        // Menggunakan SvelteKit goto untuk redirect ke admin dashboard
        goto('/admin');
    }

    // Fungsi untuk kembali ke halaman sebelumnya
    function goBack(): void {
        window.history.back();
    }

    function handleSubmit(event: Event): void {
        event.preventDefault();

        clearAllErrors();
        
        let hasErrors = false;
        
        // Validate full name
        if (!fullName.trim()) {
            showError('fullName', 'Full name is required');
            hasErrors = true;
        }
        
        // Validate email
        if (!email.trim()) {
            showError('email', 'Email is required');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        // Validate password (only if provided)
        if (password && !validatePassword(password)) {
            showError('password', 'Password must be at least 6 characters long');
            hasErrors = true;
        }
        
        // Validate bio
        if (!bio.trim()) {
            showError('bio', 'Bio cannot be empty');
            hasErrors = true;
        }
        
        if (hasErrors) {
            return;
        }
        
        // Show loading state
        isSubmitting = true;
        showInlineSuccess = false;
        
        // Simulate API call
        setTimeout(() => {
            isSubmitting = false;
            
            // Show inline success message
            showInlineSuccess = true;
            
            // Show success modal
            showSuccessMessage = true;
            
            // In a real app, this would update user session/profile data
            const formData = {
                fullName,
                email,
                password: password || null,
                bio,
                profileImage: profileImageSrc
            };
            
            console.log('Profile data saved:', formData);
            
            createParticles();

            // Redirect ke admin dashboard setelah 2 detik
            setTimeout(() => {
                redirectToDashboard();
            }, 2000);
            
        }, 1500);
    }
    
    // Fungsi untuk menutup modal dan redirect
    function closeModalAndRedirect(): void {
        showSuccessMessage = false;
        redirectToDashboard();
    }
    
    // Create particle effect
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
    
    // Focus/blur handlers for smooth animations
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

        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
</svelte:head>

<div class="profile-wrapper">
    <div class="profile-container">
        <div class="page-header">
            <button class="back-btn" on:click={goBack} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>
            <h1>Profile Settings</h1>
        </div>
        <div class="profile-header">
            <div class="profile-image-container">
                <img 
                    src={profileImageSrc} 
                    alt="Profile" 
                    class="profile-image" 
                    bind:this={profileImage}
                />
                <div class="upload-overlay" on:click={() => fileInput?.click()}>
                </div>
            </div>
            <button class="upload-btn" on:click={() => fileInput?.click()}>Upload Photo</button>
            <input 
                type="file" 
                bind:this={fileInput}
                class="file-input" 
                accept="image/*"
                on:change={handleFileUpload}
            />
        </div>

        <form on:submit={handleSubmit}>
            <div class="form-group" class:error={errors.fullName}>
                <label for="fullName">Full Name</label>
                <input 
                    type="text" 
                    id="fullName" 
                    class="form-control" 
                    placeholder="Masukkan nama anda" 
                    bind:value={fullName}
                    on:input={handleNameInput}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                />
                <div class="error-message" class:show={errors.fullName}>{errors.fullName}</div>
            </div>

            <div class="form-group" class:error={errors.email}>
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    class="form-control" 
                    placeholder="enter new email (optional)" 
                    bind:value={email}
                    on:input={handleEmailInput}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                />
                <div class="error-message" class:show={errors.email}>{errors.email}</div>
            </div>

            <div class="form-group" class:error={errors.password}>
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    class="form-control" 
                    placeholder="enter new password (optional)"
                    bind:value={password}
                    on:input={handlePasswordInput}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                />
                <div class="error-message" class:show={errors.password}>{errors.password}</div>
            </div>

            <div class="form-group" class:error={errors.bio}>
                <label for="bio">Bio</label>
                <textarea 
                    id="bio" 
                    class="form-control" 
                    placeholder="Ga ngoding Ga makan!"
                    bind:value={bio}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                ></textarea>
                <div class="error-message" class:show={errors.bio}>{errors.bio}</div>
            </div>

            <button type="submit" class="save-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>

            <!-- Inline Success Message -->
            {#if showInlineSuccess}
                <div class="inline-success-message">
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

<!-- Success Modal -->
{#if showSuccessMessage}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="modal-overlay" 
        on:click={closeModalAndRedirect} 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="success-title"
        aria-describedby="success-description">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="success-modal" on:click|stopPropagation>
            <button 
                class="close-btn" 
                on:click={closeModalAndRedirect} 
                aria-label="Close success message"
                type="button"
            >
                ×
            </button>
            <div class="success-icon" aria-hidden="true">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" role="img" aria-label="Success checkmark">
                    <circle cx="30" cy="30" r="30" fill="#4CAF50"/>
                    <path d="M25 30L28 33L35 26" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2 id="success-title">Changes Saved</h2>
            <p id="success-description">Your changes have been saved successfully. Redirecting to dashboard...</p>
            
            <!-- Tombol untuk langsung ke dashboard -->
            <button class="dashboard-btn" on:click={closeModalAndRedirect} type="button">
                Go to Dashboard
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

    :global(html, body) {
        height: 100vh;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f5f7fa;
        overflow-x: hidden;
    }

    .profile-wrapper {
        min-height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: #f5f7fa;
    }

    .profile-container {
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
        padding: 30px;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
    }

    .page-header {
        margin-bottom: 25px;
        text-align: center;
        position: relative;
    }

    .back-btn {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: 2px solid #2448B1;
        color: #2448B1;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.3s ease;
    }

    .back-btn:hover {
        background: #2448B1;
        color: white;
        transform: translateY(-50%) translateX(-2px);
        box-shadow: 0 3px 10px rgba(36, 72, 177, 0.2);
    }

    .back-btn svg {
        transition: transform 0.3s ease;
    }

    .back-btn:hover svg {
        transform: translateX(-2px);
    }

    .page-header h1 {
        color: #2c3e50;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 8px;
    }

    .profile-header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e9ecef;
    }

    .profile-image-container {
        position: relative;
        display: block;
        margin: 0 auto 15px auto;
        width: 90px;
    }

    .profile-image {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #2448B1;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .profile-image:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(36, 72, 177, 0.3);
    }

    .upload-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(36, 72, 177, 0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
    }

    .profile-image-container:hover .upload-overlay {
        opacity: 1;
    }

    .upload-btn {
        background: #2448B1;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
        display: block;
        margin: 0 auto;
    }

    .upload-btn:hover {
        background: #1e3d99;
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(36, 72, 177, 0.3);
    }

    .form-group {
        margin-bottom: 20px;
        position: relative;
    }

    .form-group label {
        display: block;
        color: #2c3e50;
        font-weight: 500;
        margin-bottom: 6px;
        font-size: 13px;
    }

    .form-control {
        width: 100%;
        padding: 12px 14px;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        font-size: 14px;
        transition: all 0.3s ease;
        background: #f8f9fa;
    }

    .form-control:focus {
        outline: none;
        border-color: #2448B1;
        background: white;
        box-shadow: 0 0 0 3px rgba(36, 72, 177, 0.1);
        transform: translateY(-1px);
    }

    .form-control::placeholder {
        color: #9ca3af;
        font-size: 13px;
    }

    textarea.form-control {
        resize: vertical;
        min-height: 70px;
        font-family: inherit;
    }

    .save-btn {
        width: 100%;
        background: linear-gradient(135deg, #2448B1 0%, #1a3a8a 100%);
        color: white;
        border: none;
        padding: 14px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        margin-bottom: 15px;
    }

    .save-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }

    .save-btn:hover::before {
        left: 100%;
    }

    .save-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(36, 72, 177, 0.3);
    }

    .save-btn:active {
        transform: translateY(0);
    }

    .save-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .inline-success-message {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
        border-radius: 8px;
        padding: 10px 14px;
        margin-top: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 500;
        animation: slideInSuccess 0.3s ease-out;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        animation: fadeIn 0.3s ease-out forwards;
    }

    .success-modal {
        background: white;
        border-radius: 16px;
        padding: 30px 25px 25px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        position: relative;
        width: 90%;
        max-width: 350px;
        margin: 20px;
        transform: translateY(20px);
        animation: slideUp 0.3s ease-out 0.1s forwards;
    }

    .close-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 20px;
        color: #999;
        cursor: pointer;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }

    .close-btn:hover {
        background: #f0f0f0;
        color: #666;
    }

    .success-icon {
        margin-bottom: 16px;
        animation: bounceIn 0.6s ease-out 0.3s both;
    }

    .success-modal h2 {
        color: #2c3e50;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 6px;
        opacity: 0;
        animation: fadeInUp 0.4s ease-out 0.4s forwards;
    }

    .success-modal p {
        color: #666;
        font-size: 14px;
        margin: 0 0 18px 0;
        opacity: 0;
        animation: fadeInUp 0.4s ease-out 0.5s forwards;
    }

    .dashboard-btn {
        background: linear-gradient(135deg, #2448B1 0%, #1a3a8a 100%);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.3s ease;
        opacity: 0;
        animation: fadeInUp 0.4s ease-out 0.6s forwards;
    }

    .dashboard-btn:hover {
        background: linear-gradient(135deg, #1a3a8a 0%, #2448B1 100%);
        transform: translateY(-1px);
        box-shadow: 0 3px 12px rgba(36, 72, 177, 0.3);
    }

    .file-input {
        display: none;
    }

    .form-group.error .form-control {
        border-color: #e74c3c;
        background: #fdf2f2;
    }

    .error-message {
        color: #e74c3c;
        font-size: 11px;
        margin-top: 4px;
        opacity: 0;
        transform: translateY(-5px);
        transition: all 0.3s ease;
    }

    .error-message.show {
        opacity: 1;
        transform: translateY(0);
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

    /* Laptop screens (1024px - 1440px) */
    @media (min-width: 1024px) and (max-width: 1440px) {
        .profile-wrapper {
            padding: 40px;
        }
        
        .profile-container {
            max-width: 480px;
            padding: 35px;
        }
        
        .page-header h1 {
            font-size: 26px;
        }
        
        .form-control {
            padding: 13px 15px;
            font-size: 15px;
        }
        
        .save-btn {
            padding: 15px;
            font-size: 15px;
        }
    }

    /* Large laptops and desktops (1441px+) */
    @media (min-width: 1441px) {
        .profile-wrapper {
            padding: 60px;
        }
        
        .profile-container {
            max-width: 520px;
            padding: 40px;
        }
        
        .page-header h1 {
            font-size: 28px;
        }
        
        .profile-image {
            width: 100px;
            height: 100px;
        }
        
        .profile-image-container {
            width: 100px;
        }
        
        .form-control {
            padding: 14px 16px;
            font-size: 15px;
        }
        
        .save-btn {
            padding: 16px;
            font-size: 15px;
        }
    }

    /* Tablets */
    @media (min-width: 768px) and (max-width: 1023px) {
        .profile-wrapper {
            padding: 30px;
        }
        
        .profile-container {
            max-width: 450px;
            padding: 30px;
        }
    }

    /* Mobile screens */
    @media (max-width: 767px) {
        .profile-wrapper {
            padding: 15px;
            min-height: 100vh;
        }
        
        .profile-container {
            padding: 25px 20px;
            border-radius: 12px;
            max-width: 100%;
        }

        .back-btn {
            position: relative;
            margin: 0 auto 15px auto;
            transform: none;
        }

        .back-btn:hover {
            transform: translateX(-2px);
        }

        .page-header {
            text-align: center;
        }
        
        .page-header h1 {
            font-size: 22px;
        }
        
        .profile-image {
            width: 80px;
            height: 80px;
        }
        
        .profile-image-container {
            width: 80px;
        }
        
        .form-control {
            padding: 11px 13px;
            font-size: 14px;
        }
        
        .save-btn {
            padding: 13px;
            font-size: 14px;
        }
        
        .success-modal {
            padding: 25px 20px 20px;
            max-width: 320px;
        }
    }
</style>