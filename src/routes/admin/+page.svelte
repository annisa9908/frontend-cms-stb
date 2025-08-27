<script lang="ts">
    import { onMount } from 'svelte';
    import custbkj from '../../lib/assets/bkj.jpeg';
    import custfinnet from '../../lib/assets/finnet.jpeg';
    import custlintasarta from '../../lib/assets/lintasarta.jpeg';
    import custbtn from '../../lib/assets/btn.jpeg';
    import custbri from '../../lib/assets/bri.jpeg';
    import custcaptifit from '../../lib/assets/captifit.jpeg';
    import custkemnaker from '../../lib/assets/kemnaker.jpeg';
    import custlinknet from '../../lib/assets/linknet.jpeg';
    import { goto } from '$app/navigation';
    import { userName, isLoggedIn, restoreSession } from '../login/store';
 
    interface Activity {
        date: string;
        time: string;
        icon: string;
        iconClass: string;
        title: string;
        desc: string;
        status: 'success' | 'failed' | 'pending';
        user: string;
        avatar: string;
        avatarClass: string;
        page: number;
        type: string;
    }

    interface CalendarDay {
        text: string | number;
        isHeader?: boolean;
        isEmpty?: boolean;
        isToday?: boolean;
    }

    // Reactive variables with proper types
    let currentPage: number = 1;
    let totalPages: number = 3;
    let itemsPerPage: number = 7;
    let totalItems: number = 21;
    let activeFilter: string = 'all';
    let currentCalendarMonth: number = 6; // July (0-indexed)
    let currentCalendarYear: number = 2025;
    let totalActivities: number = totalItems;
    let activityRange: string = '1-7';
    let displayName: string = '';
    let displayInitial: string = '';
    let mounted: boolean = false; 
    let searchQuery: string = '';
    
    const monthNames: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const activities: Activity[] = [
        // Page 1
        {
            date: '11 JULY 2025',
            time: '14:30',
            icon: 'inventory_2',
            iconClass: 'icon-product',
            title: 'Update produk "Layanan IT"',
            desc: 'Modified pricing and description',
            status: 'success',
            user: 'Putri M.',
            avatar: 'P',
            avatarClass: 'avatar-putri',
            page: 1,
            type: 'update'
        },
        {
            date: '10 JULY 2025',
            time: '11:45',
            icon: 'inventory_2',
            iconClass: 'icon-product',
            title: 'Update produk "Web Design"',
            desc: 'Updated features and pricing',
            status: 'success',
            user: 'Sarah',
            avatar: 'S',
            avatarClass: 'avatar-sarah',
            page: 1,
            type: 'update'
        },
        {
            date: '9 JULY 2025',
            time: '16:20',
            icon: 'inventory_2',
            iconClass: 'icon-product',
            title: 'Update produk "Digital Marketing"',
            desc: 'Adjusted campaign details',
            status: 'success',
            user: 'Joseph',
            avatar: 'J',
            avatarClass: 'avatar-joseph',
            page: 1,
            type: 'update'
        },
        {
            date: '8 JULY 2025',
            time: '09:45',
            icon: 'upload',
            iconClass: 'icon-upload',
            title: 'Upload gambar produk',
            desc: '5 images uploaded for "Web Development"',
            status: 'success',
            user: 'Fattyah Kayla',
            avatar: 'FK',
            avatarClass: 'avatar-fattyah',
            page: 1,
            type: 'upload'
        },
        {
            date: '7 JULY 2025',
            time: '13:50',
            icon: 'inventory_2',
            iconClass: 'icon-product',
            title: 'Update produk "Layanan IT"',
            desc: 'Modified pricing and description',
            status: 'success',
            user: 'Annisa',
            avatar: 'A',
            avatarClass: 'avatar-annisa',
            page: 1,
            type: 'update'
        },
        {
            date: '6 JULY 2025',
            time: '16:45',
            icon: 'person',
            iconClass: 'icon-customer',
            title: 'Edit customer data',
            desc: 'Updated contact information',
            status: 'failed',
            user: 'Zalfa',
            avatar: 'Z',
            avatarClass: 'avatar-zalfa',
            page: 1,
            type: 'update'
        },
        {
            date: '5 JULY 2025',
            time: '10:20',
            icon: 'upload',
            iconClass: 'icon-upload',
            title: 'Upload gambar produk',
            desc: '2 images uploaded for "Web Development"',
            status: 'success',
            user: 'Ivan',
            avatar: 'I',
            avatarClass: 'avatar-ivan',
            page: 1,
            type: 'upload'
        },
        // Page 2
        {
            date: '4 JULY 2025',
            time: '15:30',
            icon: 'settings',
            iconClass: 'icon-system',
            title: 'System backup',
            desc: 'Database backup completed successfully',
            status: 'success',
            user: 'Maya S.',
            avatar: 'M',
            avatarClass: 'avatar-maya',
            page: 2,
            type: 'system'
        },
        {
            date: '3 JULY 2025',
            time: '08:15',
            icon: 'person',
            iconClass: 'icon-customer',
            title: 'Customer registration',
            desc: 'New customer signed up for premium service',
            status: 'success',
            user: 'Sari N.',
            avatar: 'S',
            avatarClass: 'avatar-sari',
            page: 2,
            type: 'customer'
        },
        {
            date: '2 JULY 2025',
            time: '14:40',
            icon: 'upload',
            iconClass: 'icon-upload',
            title: 'Upload portfolio images',
            desc: '12 images uploaded for company gallery',
            status: 'pending',
            user: 'Dimas P.',
            avatar: 'D',
            avatarClass: 'avatar-dimas',
            page: 2,
            type: 'upload'
        },
        {
            date: '1 JULY 2025',
            time: '11:20',
            icon: 'inventory_2',
            iconClass: 'icon-product',
            title: 'Update produk "Mobile App"',
            desc: 'Updated app features and pricing structure',
            status: 'success',
            user: 'Lina K.',
            avatar: 'L',
            avatarClass: 'avatar-lina',
            page: 2,
            type: 'update'
        },
        {
            date: '30 JUNE 2025',
            time: '16:30',
            icon: 'settings',
            iconClass: 'icon-system',
            title: 'System maintenance',
            desc: 'Performed routine system optimization',
            status: 'success',
            user: 'Maya S.',
            avatar: 'M',
            avatarClass: 'avatar-maya',
            page: 2,
            type: 'system'
        },
        {
            date: '29 JUNE 2025',
            time: '09:45',
            icon: 'edit',
            iconClass: 'icon-content',
            title: 'Update company profile',
            desc: 'Modified about us section and contact info',
            status: 'failed',
            user: 'Rudi A.',
            avatar: 'R',
            avatarClass: 'avatar-rudi',
            page: 2,
            type: 'update'
        },
        {
            date: '28 JUNE 2025',
            time: '13:10',
            icon: 'upload',
            iconClass: 'icon-upload',
            title: 'Upload testimonial videos',
            desc: '3 customer testimonial videos uploaded',
            status: 'success',
            user: 'Ivan',
            avatar: 'I',
            avatarClass: 'avatar-ivan',
            page: 2,
            type: 'upload'
        },
        // Page 3
        {
            date: '27 JUNE 2025',
            time: '12:15',
            icon: 'edit',
            iconClass: 'icon-content',
            title: 'Update blog content',
            desc: 'Published new article about digital marketing',
            status: 'success',
            user: 'Rudi A.',
            avatar: 'R',
            avatarClass: 'avatar-rudi',
            page: 3,
            type: 'update'
        },
        {
            date: '26 JUNE 2025',
            time: '15:25',
            icon: 'person',
            iconClass: 'icon-customer',
            title: 'Customer data export',
            desc: 'Exported customer database for analysis',
            status: 'success',
            user: 'Sarah',
            avatar: 'S',
            avatarClass: 'avatar-sarah',
            page: 3,
            type: 'customer'
        },
        {
            date: '25 JUNE 2025',
            time: '10:50',
            icon: 'inventory_2',
            iconClass: 'icon-product',
            title: 'Update produk "Consulting"',
            desc: 'Added new consulting packages and rates',
            status: 'success',
            user: 'Joseph',
            avatar: 'J',
            avatarClass: 'avatar-joseph',
            page: 3,
            type: 'update'
        }
    ];
    
    function setupUserDisplay(): void {
        // Cek dari localStorage dulu
        const savedUser: string | null = localStorage.getItem('userName');
        
        if (savedUser) {
            displayName = savedUser.charAt(0).toUpperCase() + savedUser.slice(1);
            displayInitial = displayName.charAt(0).toUpperCase();
        } else if ($userName) {
            displayName = $userName.charAt(0).toUpperCase() + $userName.slice(1);
            displayInitial = displayName.charAt(0).toUpperCase();
        } else {
            // Default values untuk testing
            displayName = 'Admin';
            displayInitial = 'A';
        }
    }

    function goToSettings(): void {
        goto('admin/dashboard-setting');
    }

    // Authentication check yang lebih robust
    function checkAuthentication(): boolean {
        console.log('Checking authentication...');
        
        // Cek localStorage dulu
        const savedUser: string | null = localStorage.getItem('userName');
        const savedLoginStatus: string | null = localStorage.getItem('isLoggedIn');
        
        console.log('localStorage userName:', savedUser);
        console.log('localStorage isLoggedIn:', savedLoginStatus);
        console.log('store isLoggedIn:', $isLoggedIn);
        
        // Jika ada data di localStorage, restore session
        if (savedUser && savedLoginStatus === 'true') {
            console.log('Found valid session in localStorage, restoring...');
            restoreSession();
            return true;
        }
        
        // Jika tidak ada di localStorage, cek store
        if ($isLoggedIn) {
            console.log('User is logged in via store');
            return true;
        }
        
        console.log('No valid session found, redirecting to login');
        return false;
    }

    function handleSearch(): void {
        // Reset ke halaman pertama saat search
        currentPage = 1;
    }

    function searchActivities(activities: Activity[], query: string): Activity[] {
        if (!query.trim()) return activities;
        
        const searchTerm = query.toLowerCase();
        return activities.filter(activity => 
            activity.title.toLowerCase().includes(searchTerm) ||
            activity.desc.toLowerCase().includes(searchTerm) ||
            activity.user.toLowerCase().includes(searchTerm) ||
            activity.date.toLowerCase().includes(searchTerm)
        );
    }

    // Reactive computed values dengan proper typing
    $: searchedActivities = searchActivities(activities, searchQuery);
    $: filteredActivities = getFilteredActivities(activeFilter, searchedActivities);
    $: visibleActivities = getVisibleActivities(activeFilter, currentPage, filteredActivities);
    $: maxPages = activeFilter === 'all' ? totalPages : Math.ceil(filteredActivities.length / itemsPerPage);
    $: calendarDays = generateCalendarDays(currentCalendarMonth, currentCalendarYear);
    
    function getFilteredActivities(filter: string, activities: Activity[]): Activity[] {
        return activities.filter((activity: Activity) => {
            if (filter === 'all') return true;
            if (filter === 'updates') {
                return activity.title.toLowerCase().includes('update') ||
                       activity.title.toLowerCase().includes('edit') ||
                       activity.desc.toLowerCase().includes('modified');
            }
            if (filter === 'uploads') {
                return activity.title.toLowerCase().includes('upload') ||
                       activity.desc.toLowerCase().includes('uploaded');
            }
            return false;
        });
    }

    function getVisibleActivities(filter: string, page: number, filtered: Activity[]): Activity[] {
        if (filter === 'all' && !searchQuery.trim()) {
            return activities.filter((activity: Activity) => activity.page === page);
        } else {
            const start: number = (page - 1) * itemsPerPage;
            return filtered.slice(start, start + itemsPerPage);
        }
    }

    function updatePagination(filter: string, page: number, filtered: Activity[]): void {
        if (filter === 'all' && !searchQuery.trim()) {
            const start: number = (page - 1) * itemsPerPage + 1;
            let end: number = page * itemsPerPage;
            if (page === totalPages) {
                end = totalItems;
            }
            activityRange = `${start}-${end}`;
            totalActivities = totalItems;
        } else {
            const visibleCount: number = filtered.length;
            const start: number = (page - 1) * itemsPerPage + 1;
            const end: number = Math.min(start + itemsPerPage - 1, visibleCount);
            activityRange = visibleCount > 0 ? `${start}-${end}` : '0-0';
            totalActivities = visibleCount;
        }
    }
    
    function setFilter(filter: string): void {
        activeFilter = filter;
        currentPage = 1;
    }

    function setPage(page: number): void {
        if (page >= 1 && page <= maxPages) {
            currentPage = page;
        }
    }
    
    function nextPage(): void {
        if (currentPage < maxPages) {
            currentPage++;
        }
    }
    
    function prevPage(): void {
        if (currentPage > 1) {
            currentPage--;
        }
    }
    
    function changeMonth(direction: number): void {
        currentCalendarMonth += direction;
        if (currentCalendarMonth > 11) {
            currentCalendarMonth = 0;
            currentCalendarYear++;
        } else if (currentCalendarMonth < 0) {
            currentCalendarMonth = 11;
            currentCalendarYear--;
        }
    }

    function generateCalendarDays(month: number, year: number): CalendarDay[] {
        const firstDay: number = new Date(year, month, 1).getDay();
        const daysInMonth: number = new Date(year, month + 1, 0).getDate();
        const today: Date = new Date();
        const days: CalendarDay[] = [];
        
        // Add day headers
        const dayHeaders: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        dayHeaders.forEach((day: string) => {
            days.push({ text: day, isHeader: true });
        });

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push({ text: '', isEmpty: true });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday: boolean =
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate();
            days.push({ text: day, isToday });
        }
        
        return days;
    }

    // Event handlers dengan proper typing
    function handleKeyDown(e: KeyboardEvent, action: () => void): void {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    }

    // Update pagination when reactive values change
    $: updatePagination(activeFilter, currentPage, filteredActivities);

    // Main authentication reactive statement
    //$: if (mounted && !checkAuthentication()) {
        //goto('/login');
    //}

    onMount(() => {
        console.log('Dashboard component mounted');
        mounted = true;
        
        // Setup user display regardless of auth status
        setupUserDisplay();
        
        // Untuk development/testing, comment baris di bawah jika ingin skip auth
        // checkAuthentication();
    });
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</svelte:head>

<div class="app">
    <!-- Main Content -->
    <div class="main-content">
        <!-- Header -->
        <header class="header">
            <div>
                <div class="header-title">Selamat Datang {displayName}</div>
                <div class="header-subtitle">Content Management System Dashboard</div>
            </div>
            <div class="header-right">
                <div class="search-box">
                    <input 
                        type="text" 
                        placeholder="Search " 
                        bind:value={searchQuery}
                        on:input={handleSearch}
                    >
                    <span class="material-symbols-outlined search-icon">search</span>
                </div>
                <div class="profile-section">
                    <div class="profile-avatar">{displayInitial}</div>
                    <div class="profile-name">{displayName}</div>
                    <button 
                        class="settings-btn" 
                        on:click={goToSettings} 
                        title="Settings"
                        type="button"
                    >
                        <span class="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Dashboard Content -->
        <div class="dashboard-content">
            <div class="main-section">
                <!-- Stats Grid -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <span class="material-symbols-outlined">settings</span>
                        </div>
                        <div class="stat-number">35</div>
                        <div class="stat-label">Services</div>
                        <div class="stat-desc">
                             <span class="green-icon material-symbols-outlined">trending_up</span>
                            Total layanan yang tersedia
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <span class="material-symbols-outlined">inventory_2</span>
                        </div>
                        <div class="stat-number">3</div>
                        <div class="stat-label">Products</div>
                        <div class="stat-desc">
                             <span class="green-icon material-symbols-outlined">trending_up</span>
                            Produk dalam sistem
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <span class="material-symbols-outlined">group</span>
                        </div>
                        <div class="stat-number">2</div>
                        <div class="stat-label">Admin</div>
                        <div class="stat-desc">
                            <span class="green-icon material-symbols-outlined">trending_up</span>
                            Total pengguna admin aktif
                        </div>
                    </div>
                </div>

                <!-- Activity Section -->
                <div class="container">
                    <div class="header-activity">
                        <h1>Recent Activity</h1>
                        <div class="filter-tabs">
                            <div 
                                class="filter-tab"
                                class:active={activeFilter === 'all'}
                                on:click={() => setFilter('all')}
                                on:keydown={(e) => handleKeyDown(e, () => setFilter('all'))}
                                role="button"
                                tabindex="0"
                            >
                                All
                            </div>
                            <div 
                                class="filter-tab"
                                class:active={activeFilter === 'updates'}
                                on:click={() => setFilter('updates')}
                                on:keydown={(e) => handleKeyDown(e, () => setFilter('updates'))}
                                role="button"
                                tabindex="0"
                            >
                                Updates
                            </div>
                            <div 
                                class="filter-tab"
                                class:active={activeFilter === 'uploads'}
                                on:click={() => setFilter('uploads')}
                                on:keydown={(e) => handleKeyDown(e, () => setFilter('uploads'))}
                                role="button"
                                tabindex="0"
                            >
                                Uploads
                            </div>
                        </div>
                    </div>

                    <div class="table-header">
                        <div>DATE</div>
                        <div>ACTIVITY</div>
                        <div>STATUS</div>
                        <div>USER</div>
                    </div>

                    <div class="activity-list">
                        {#if visibleActivities && visibleActivities.length > 0}
                            {#each visibleActivities as activity (activity.date + activity.time)}
                                <div class="activity-item">
                                    <div class="date-time">
                                        <div class="date">{activity.date}</div>
                                        <div>{activity.time}</div>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-icon {activity.iconClass}">
                                            <span class="material-symbols-outlined">{activity.icon}</span>
                                        </div>
                                        <div class="activity-details">
                                            <h3>{activity.title}</h3>
                                            <p>{activity.desc}</p>
                                        </div>
                                    </div>
                                    <div class="status-badge status-{activity.status}">
                                        <div class="status-dot status-dot-{activity.status}"></div>
                                        {activity.status ? activity.status.toUpperCase() : ''}
                                    </div>
                                    <div class="user-info">
                                        <div class="user-avatar {activity.avatarClass}">{activity.avatar}</div>
                                        <div class="user-name">{activity.user}</div>
                                    </div>
                                </div>
                            {/each}
                        {:else}
                            <div class="no-results">
                                <span class="material-symbols-outlined">search_off</span>
                                <p>No activities found matching your search</p>
                            </div>
                        {/if}
                    </div>

                    <div class="pagination">
                        <div class="activity-count">
                            Showing {activityRange} of {totalActivities} activities
                        </div>
                        <div class="page-controls">
                            <button 
                                class="page-btn"
                                disabled={currentPage === 1}
                                on:click={prevPage}
                                type="button"
                            >
                                Previous
                            </button>
                            {#each Array(maxPages) as _, i}
                                <button 
                                    class="page-btn {currentPage === i + 1 ? 'active' : ''}"
                                    on:click={() => setPage(i + 1)}
                                    type="button"
                                >
                                    {i + 1}
                                </button>
                            {/each}
                            <button 
                                class="page-btn"
                                disabled={currentPage >= maxPages}
                                on:click={nextPage}
                                type="button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="container">
                <!-- Sidebar Section -->
                <div class="sidebar-section">
                    <!-- Calendar Widget -->
                    <div class="modern-calendar-widget">
                        <div class="calendar-month-header">
                            <button 
                                class="calendar-nav" 
                                on:click={() => changeMonth(-1)}
                                type="button"
                            >
                                <span class="material-symbols-outlined">chevron_left</span>
                            </button>
                            <div class="calendar-month-name">
                                {monthNames[currentCalendarMonth]} {currentCalendarYear}
                            </div>
                            <button 
                                class="calendar-nav" 
                                on:click={() => changeMonth(1)}
                                type="button"
                            >
                                <span class="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                        <div class="calendar-content">
                            <div class="calendar-headers">
                                {#each calendarDays.slice(0, 7) as day}
                                    <div class="calendar-day-header">{day.text}</div>
                                {/each}
                            </div>
                            <div class="calendar-grid">
                                {#each calendarDays.slice(7) as day}
                                    <div class="calendar-day" 
                                         class:today={day.isToday} 
                                         class:empty={day.isEmpty}>
                                        {day.text}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <!-- Customers Section -->
                    <div class="customers-section">
                        <div class="customers-header">
                            <!-- Custom 3-person SVG icon -->
                            <div class="custom-three-person-icon">
                                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                                    <!-- Person 1 -->
                                    <circle cx="6" cy="6" r="2.5"/>
                                    <path d="M6 10c-2.5 0-4.5 2-4.5 4.5v1.5h9v-1.5C10.5 12 8.5 10 6 10z"/>
                                    
                                    <!-- Person 2 -->
                                    <circle cx="12" cy="6" r="2.5"/>
                                    <path d="M12 10c-2.5 0-4.5 2-4.5 4.5v1.5h9v-1.5C16.5 12 14.5 10 12 10z"/>
                                    
                                    <!-- Person 3 -->
                                    <circle cx="18" cy="6" r="2.5"/>
                                    <path d="M18 10c-2.5 0-4.5 2-4.5 4.5v1.5h9v-1.5C22.5 12 20.5 10 18 10z"/>
                                </svg>
                            </div>
                            <div class="customers-title">Our Customers</div>
                        </div>
                        <div class="customers-grid">
                            <div class="customer-logo">
                                <img src={custbkj} alt="BKJ" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src={custfinnet} alt="finnet" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src={custlintasarta} alt="lintasarta" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src={custbtn} alt="btn" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src={custbri} alt="BRI" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src={custcaptifit} alt="captifit" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src={custkemnaker} alt="kemnaker" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src={custlinknet} alt="Linknet" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src="/assets/hotkan-logo.png" alt="Hotkan Datapack" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src="/assets/customer-placeholder1.png" alt="Customer 10" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src="/assets/customer-placeholder2.png" alt="Customer 11" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src="/assets/customer-placeholder3.png" alt="Customer 12" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src="/assets/customer-placeholder4.png" alt="Customer 13" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src="/assets/customer-placeholder5.png" alt="Customer 14" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src="/assets/customer-placeholder6.png" alt="Customer 15" class="customer-image" />
                            </div>
                            <div class="customer-logo">
                                <img src="/assets/customer-placeholder7.png" alt="Customer 16" class="customer-image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(body) {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #f5f7fa;
    }

    .app {
        display: flex;
        min-height: 100vh;
    }

    .main-content {
        flex: 1;
        padding: 0;
    }

    .header {
        background: white;
        padding: 12px 20px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 12px 20px 20px 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .header-title {
        font-size: 22px;
        font-weight: 700;
        color: #1e293b;
        letter-spacing: -0.3px; 
    }

    .header-subtitle {
        font-size: 12px;
        color: #64748b;
        margin-top: 3px;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .search-box {
        display: flex;
        align-items: center;
        background: #f8f9fc;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 8px 16px;
        width: 320px;
        height: 38px;
    }

    .search-box input {
        border: none;
        background: none;
        outline: none;
        flex: 1;
        padding: 3px 6px;
        font-size: 13px;
    }

    .search-icon {
        color: #64748b;
        cursor: pointer;
        font-size: 18px;
    }

    .profile-section {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .profile-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #4f6cc9;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 12px;
    }

    .profile-name {
        font-weight: 500;
        font-size: 13px;
        color: #1e293b;
    }

    .settings-btn {
        padding: 5px;
        background: #f8f9fc;
        border: 1px solid #e2e8f0;
        border-radius: 5px;
        cursor: pointer;
        color: #64748b;
    }

    .dashboard-content {
        padding: 18px;
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 18px;
    }

    .main-section {
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
    }

    .stat-card {
        background: white;
        border-radius: 10px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, #2448B1);
    }

    .stat-icon {
        width: 34px;
        height: 34px;
        background: #B2DBFF;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 10px;
        color: #2854C5;
        font-size: 18px;
        line-height: 1;
    }

    .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 5px;
    }

    .stat-label {
        font-size: 13px;
        font-weight: 600;
        color: #4f6cc9;
        margin-bottom: 2px;
    }

    .stat-desc {
        font-size: 10px;
        color: #64748b;
    }

    .green-icon {
        color: #28a745;           
        font-size: 11px;          
        margin-right: 2px;        
        vertical-align: middle;   
    }

    .container {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }

    .header-activity {
        background: linear-gradient(135deg, #4f6cc9, #5a7bd4);
        color: white;
        padding: 10px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-activity h1 {
        font-size: 16px;
        margin: 0;
    }

    .filter-tabs {
        display: flex;
        gap: 5px;
    }

    .filter-tab {
        padding: 4px 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 11px;
    }

    .filter-tab.active,
    .filter-tab:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .table-header {
        display: grid;
        grid-template-columns: 80px 1fr 70px 80px;
        padding: 6px 14px;
        background: #f8f9fc;
        font-weight: 600;
        font-size: 10px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    .activity-list {
        min-height: 280px;
    }

    .activity-item {
        display: grid;
        grid-template-columns: 80px 1fr 70px 80px;
        padding: 6px 14px;
        border-bottom: 1px solid #e2e8f0;
        align-items: center;
    }

    .activity-item:hover {
        background-color: #f8f9fc;
    }

    .no-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 14px;
        color: #64748b;
        text-align: center;
    }

    .no-results .material-symbols-outlined {
        font-size: 35px;
        margin-bottom: 8px;
        opacity: 0.5;
    }

    .no-results p {
        font-size: 13px;
        margin: 0;
    }

    .date-time {
        font-size: 10px;
        color: #64748b;
    }

    .date {
        font-weight: 500;
        color: #1e293b;
        font-size: 11px;
    }

    .activity-content {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .activity-icon {
        width: 22px;
        height: 22px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
    }

    :global(.icon-product) { background: #e1f5fe; color: #0277bd; }
    :global(.icon-content) { background: #f3e5f5; color: #7b1fa2; }
    :global(.icon-customer) { background: #e8f5e8; color: #2e7d32; }
    :global(.icon-upload) { background: #fff3e0; color: #f57c00; }
    :global(.icon-system) { background: #fce4ec; color: #c2185b; }

    .activity-details h3 {
        font-size: 12px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 1px;
    }

    .activity-details p {
        font-size: 10px;
        color: #64748b;
    }

    .status-badge {
        display: flex;
        align-items: center;
        gap: 3px;
        padding: 2px 6px;
        border-radius: 6px;
        font-size: 9px;
        font-weight: 500;
        text-align: center;
        width: 60px;
    }

    .status-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .status-success {
        background: #e6ffe6;
        color: #28a745;
    }

    .status-dot-success {
        background: #28a745;
    }

    .status-pending {
        background: #fff3cd;
        color: #856404;
    }

    .status-dot-pending {
        background: #ffc107;
    }

    .status-failed {
        background: #f8d7da;
        color: #dc3545;
    }

    .status-dot-failed {
        background: #dc3545;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .user-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 10px;
        color: white;
        flex-shrink: 0;
    }

    .user-name {
        font-size: 11px;
        font-weight: 500;
        color: #1e293b;
    }

    :global(.avatar-putri) { background: #6366f1; }
    :global(.avatar-sarah) { background: #3b82f6; }
    :global(.avatar-joseph) { background: #8b5cf6; }
    :global(.avatar-fattyah) { background: #06b6d4; }
    :global(.avatar-annisa) { background: #10b981; }
    :global(.avatar-zalfa) { background: #f59e0b; }
    :global(.avatar-ivan) { background: #ef4444; }
    :global(.avatar-maya) { background: #ec4899; }
    :global(.avatar-rudi) { background: #84cc16; }
    :global(.avatar-sari) { background: #f97316; }
    :global(.avatar-dimas) { background: #8b5a2b; }
    :global(.avatar-lina) { background: #06d6a0; }

    .pagination {
        padding: 6px 14px;
        background: #f8f9fc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .activity-count {
        color: #64748b;
        font-size: 11px;
    }

    .page-controls {
        display: flex;
        gap: 4px;
        align-items: center;
    }

    .page-btn {
        padding: 3px 6px;
        border: 1px solid #d1d5db;
        background: white;
        color: #374151;
        border-radius: 3px;
        cursor: pointer;
        font-size: 10px;
        transition: all 0.2s ease;
    }

    .page-btn:hover {
        background: #f3f4f6;
    }

    .page-btn.active {
        background: #4f6cc9;
        color: white;
        border-color: #4f6cc9;
    }

    .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .page-btn:disabled:hover {
        background: white;
    }

    .sidebar-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .custom-three-person-icon {
        color: #1e293b;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .custom-three-person-icon svg {
        width: 48px;
        height: 48px;
        fill: currentColor;
    }

    .customers-section {
        background: white;
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .customers-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        color: #1e293b;
    }

    .customers-title {
        font-weight: 600;
        font-size: 20px;
    }

    .customers-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        justify-items: center;
        width: 100%;
        max-width: 360px;
        margin: 0 auto;
    }

    .customer-logo {
        aspect-ratio: 1;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
        padding: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        height: 80px;
        width: 80px;
    }

    .customer-logo:hover {
        border-color: #4f6cc9;
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(79, 108, 201, 0.15);
    }

    .customer-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 6px;
        transition: transform 0.3s ease;
    }

    .customer-logo:hover .customer-image {
        transform: scale(1.05);
    }

    .modern-calendar-widget {
        background: white;
        border-radius: 10px;
        padding: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        border: 1px solid #e2e8f0;
    }

    .calendar-month-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .calendar-nav {
        background: none;
        border: none;
        color: #4f6cc9;
        cursor: pointer;
        padding: 4px;
        border-radius: 3px;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .calendar-nav:hover {
        background: #f1f5f9;
    }

    .calendar-nav .material-symbols-outlined {
        font-size: 16px;
    }

    .calendar-month-name {
        font-weight: 600;
        color: #1e293b;
        font-size: 13px;
    }

    .calendar-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .calendar-headers {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
    }

    .calendar-day-header {
        text-align: center;
        font-weight: 600;
        color: #64748b;
        font-size: 9px;
        padding: 3px 1px;
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
    }

    .calendar-day {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 1px;
        min-height: 22px;
        color: #1e293b;
    }

    .calendar-day.empty {
        cursor: default;
        color: transparent;
    }

    .calendar-day.today {
        background: #4f6cc9;
        color: white;
        font-weight: 600;
    }

    .calendar-day:hover:not(.empty):not(.today) {
        background: #f1f5f9;
        color: #4f6cc9;
    }

    :global(.material-symbols-outlined) {
        font-family: 'Material Symbols Outlined';
        font-weight: normal;
        font-style: normal;
        font-size: 18px;
        display: inline-block;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }

    /* Responsive breakpoints - LEBIH COMPACT */
    
    /* Large laptops (15"-17") - LEBIH KECIL */
    @media (max-width: 1440px) {
        .header-title {
            font-size: 20px;
        }
        
        .search-box {
            width: 280px;
            height: 36px;
        }
        
        .dashboard-content {
            padding: 16px;
            gap: 16px;
        }
        
        .stat-card {
            padding: 14px;
        }
        
        .stat-number {
            font-size: 22px;
        }

        .customers-grid {
            max-width: 320px;
        }
        
        .customer-logo {
            height: 72px;
            width: 72px;
        }
    }

    /* Standard laptops (13"-15") - LEBIH COMPACT */
    @media (max-width: 1366px) {
        .header {
            padding: 10px 16px;
            margin: 10px 16px 16px 16px;
        }
        
        .header-title {
            font-size: 19px;
        }
        
        .search-box {
            width: 260px;
            height: 34px;
            padding: 6px 12px;
        }
        
        .dashboard-content {
            padding: 14px;
            gap: 14px;
        }
        
        .stats-grid {
            gap: 10px;
        }
        
        .stat-card {
            padding: 12px;
        }
        
        .stat-number {
            font-size: 20px;
        }
        
        .stat-icon {
            width: 30px;
            height: 30px;
            font-size: 16px;
        }
        
        .activity-list {
            min-height: 260px;
        }

        .customers-grid {
            max-width: 300px;
        }
        
        .customer-logo {
            height: 68px;
            width: 68px;
        }
    }

    /* Compact laptops (13" dan lebih kecil) - SANGAT COMPACT */
    @media (max-width: 1280px) {
        .header-title {
            font-size: 18px;
        }
        
        .search-box {
            width: 240px;
            height: 32px;
            padding: 5px 10px;
        }
        
        .search-box input {
            font-size: 12px;
        }
        
        .dashboard-content {
            padding: 12px;
            gap: 12px;
        }
        
        .stats-grid {
            gap: 8px;
        }
        
        .stat-card {
            padding: 10px;
        }
        
        .stat-number {
            font-size: 18px;
        }
        
        .stat-icon {
            width: 28px;
            height: 28px;
            font-size: 15px;
            margin-bottom: 8px;
        }
        
        .stat-label {
            font-size: 12px;
        }
        
        .stat-desc {
            font-size: 9px;
        }
        
        .activity-list {
            min-height: 240px;
        }
        
        .customers-grid {
            grid-template-columns: repeat(4, 1fr);
            max-width: 280px;
        }
        
        .customer-logo {
            height: 64px;
            width: 64px;
        }
        
        .calendar-day {
            min-height: 20px;
        }
    }

    /* Small laptops/tablets (breakpoint untuk single column) */
    @media (max-width: 1200px) {
        .dashboard-content {
            grid-template-columns: 1fr;
        }
        
        .header {
            flex-direction: column;
            gap: 10px;
            text-align: center;
            padding: 10px 12px;
            margin: 10px 12px 14px 12px;
        }
        
        .header-right {
            width: 100%;
            justify-content: center;
        }
        
        .stats-grid {
            grid-template-columns: repeat(3, 1fr);
        }
        
        .table-header {
            grid-template-columns: 60px 1fr 60px 70px;
            padding: 5px 10px;
            font-size: 9px;
        }
        
        .activity-item {
            grid-template-columns: 60px 1fr 60px 70px;
            padding: 5px 10px;
        }
        
        .customers-grid {
            grid-template-columns: repeat(4, 1fr);
            max-width: 260px;
        }
        
        .customer-logo {
            height: 60px;
            width: 60px;
        }
    }

    /* Tablets */
    @media (max-width: 1024px) {
        .header-title {
            font-size: 17px;
        }
        
        .search-box {
            width: 220px;
            height: 30px;
        }
        
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }
        
        .stat-card {
            padding: 10px;
        }
        
        .stat-number {
            font-size: 16px;
        }
        
        .activity-details h3 {
            font-size: 11px;
        }
        
        .activity-details p {
            font-size: 9px;
        }
        
        .customers-grid {
            grid-template-columns: repeat(3, 1fr);
            max-width: 240px;
        }
        
        .customer-logo {
            height: 56px;
            width: 56px;
            padding: 4px;
        }
        
        .calendar-day {
            min-height: 18px;
            font-size: 9px;
        }
    }

    /* Mobile */
    @media (max-width: 768px) {
        .header {
            margin: 6px;
            padding: 8px 10px;
        }
        
        .header-title {
            font-size: 16px;
        }
        
        .search-box {
            width: 180px;
            height: 28px;
            padding: 4px 8px;
        }
        
        .dashboard-content {
            padding: 8px;
            gap: 8px;
        }
        
        .stats-grid {
            grid-template-columns: 1fr;
            gap: 6px;
        }
        
        .stat-card {
            padding: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            text-align: left;
        }
        
        .stat-icon {
            margin: 0;
        }
        
        .table-header {
            grid-template-columns: 50px 1fr 50px 60px;
            padding: 3px 6px;
            font-size: 8px;
        }
        
        .activity-item {
            grid-template-columns: 50px 1fr 50px 60px;
            padding: 3px 6px;
        }
        
        .customers-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            max-width: 210px;
        }
        
        .customer-logo {
            height: 48px;
            width: 48px;
            padding: 3px;
        }
        
        .modern-calendar-widget {
            padding: 6px;
        }
        
        .calendar-day {
            min-height: 16px;
            font-size: 8px;
        }
        
        .customers-section {
            padding: 12px;
        }
        
        .customers-title {
            font-size: 16px;
        }
        
        .custom-three-person-icon svg {
            width: 36px;
            height: 36px;
        }
    }
</style>