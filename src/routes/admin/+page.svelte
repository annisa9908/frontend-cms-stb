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
    import { userName, isLoggedIn, restoreSession } from '../../lib/store';

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

    // Get current date for calendar initialization
    const now = new Date();

    // Reactive variables using Svelte 5 runes
    let currentPage = $state(1);
    let itemsPerPage = $state(7);
    let activeFilter = $state('all');
    let currentCalendarMonth = $state(now.getMonth());
    let currentCalendarYear = $state(now.getFullYear());
    let totalActivities = $state(21);
    let activityRange = $state('1-7');
    let displayName = $state('');
    let displayInitial = $state('');
    let mounted = $state(false);
    let searchQuery = $state('');

    const monthNames: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const activities: Activity[] = [
        {
            date: '11 July 2025',
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
            date: '10 July 2025',
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
            date: '9 July 2025',
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
            date: '8 July 2025',
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
            date: '7 July 2025',
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
            date: '6 July 2025',
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
            date: '5 July 2025',
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
        {
            date: '4 July 2025',
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
            date: '3 July 2025',
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
            date: '2 July 2025',
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
            date: '1 July 2025',
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
            date: '30 June 2025',
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
            date: '29 June 2025',
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
            date: '28 June 2025',
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
        {
            date: '27 June 2025',
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
            date: '26 June 2025',
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
            date: '25 June 2025',
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

    console.log('Activities with type upload:', activities.filter(a => a.type === 'upload'));

    function setupUserDisplay(): void {
        const savedUser: string | null = localStorage.getItem('userName');
        if (savedUser) {
            displayName = savedUser.charAt(0).toUpperCase() + savedUser.slice(1);
            displayInitial = displayName.charAt(0).toUpperCase();
        } else if ($userName) {
            displayName = $userName.charAt(0).toUpperCase() + $userName.slice(1);
            displayInitial = displayName.charAt(0).toUpperCase();
        } else {
            displayName = 'Admin';
            displayInitial = 'A';
        }
        console.log('User display:', { displayName, displayInitial });
    }

    function goToSettings(): void {
        goto('admin/dashboard-setting');
    }

    function checkAuthentication(): boolean {
        console.log('Checking authentication...');
        const savedUser: string | null = localStorage.getItem('userName');
        const savedLoginStatus: string | null = localStorage.getItem('isLoggedIn');
        console.log('localStorage:', { userName: savedUser, isLoggedIn: savedLoginStatus });
        console.log('store:', { userName: $userName, isLoggedIn: $isLoggedIn });

        userName.set('admin');
        isLoggedIn.set(true);
        localStorage.setItem('userName', 'admin');
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Authentication bypassed for debugging');
        return true;
    }

    function handleSearch(): void {
        currentPage = 1;
        console.log('Search query updated:', searchQuery);
    }

    function searchActivities(activities: Activity[], query: string): Activity[] {
        if (!query.trim()) return activities;
        const searchTerm = query.toLowerCase();
        const filtered = activities.filter(activity => 
            activity.title.toLowerCase().includes(searchTerm) ||
            activity.desc.toLowerCase().includes(searchTerm) ||
            activity.user.toLowerCase().includes(searchTerm) ||
            activity.date.toLowerCase().includes(searchTerm)
        );
        console.log('Search query:', query, 'Searched activities:', filtered);
        return filtered;
    }

    function getFilteredActivities(filter: string, activities: Activity[]): Activity[] {
        const normalizedFilter = filter.toLowerCase();
        const filtered = activities.filter((activity: Activity) => {
            if (normalizedFilter === 'all') return true;
            if (normalizedFilter === 'updates') {
                return activity.title.toLowerCase().includes('update') ||
                       activity.title.toLowerCase().includes('edit') ||
                       activity.desc.toLowerCase().includes('modified');
            }
            if (normalizedFilter === 'uploads') {
                return activity.type === 'upload';
            }
            return false;
        });
        console.log('Filter:', normalizedFilter, 'Search query:', searchQuery, 'Filtered activities:', filtered);
        return filtered;
    }

    function getVisibleActivities(filter: string, page: number, filtered: Activity[]): Activity[] {
        const start: number = (page - 1) * itemsPerPage;
        const result = filtered.slice(start, start + itemsPerPage);
        console.log('Filter:', filter, 'Page:', page, 'Visible activities:', result);
        return result;
    }

    function updatePagination(filter: string, page: number, filtered: Activity[]): void {
        const visibleCount: number = filtered.length;
        const start: number = (page - 1) * itemsPerPage + 1;
        const end: number = Math.min(start + itemsPerPage - 1, visibleCount);
        activityRange = visibleCount > 0 ? `${start}-${end}` : '0-0';
        totalActivities = visibleCount;
        console.log('Pagination updated:', { filter, page, activityRange, totalActivities });
    }

    function setFilter(filter: string): void {
        console.log('Setting filter to:', filter);
        activeFilter = filter.toLowerCase();
        searchQuery = '';
        currentPage = 1;
    }

    function setPage(page: number): void {
        if (page >= 1 && page <= maxPages) {
            currentPage = page;
            console.log('Page set to:', page);
        }
    }

    function nextPage(): void {
        if (currentPage < maxPages) {
            currentPage++;
            console.log('Next page:', currentPage);
        }
    }

    function prevPage(): void {
        if (currentPage > 1) {
            currentPage--;
            console.log('Previous page:', currentPage);
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
        console.log('Calendar updated:', { month: monthNames[currentCalendarMonth], year: currentCalendarYear });
    }

    function generateCalendarDays(month: number, year: number): CalendarDay[] {
        const firstDay: number = new Date(year, month, 1).getDay();
        const daysInMonth: number = new Date(year, month + 1, 0).getDate();
        const today: Date = new Date(); // Set to current date
        const days: CalendarDay[] = [];

        const dayHeaders: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        dayHeaders.forEach((day: string) => {
            days.push({ text: day, isHeader: true });
        });

        for (let i = 0; i < firstDay; i++) {
            days.push({ text: '', isEmpty: true });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday: boolean =
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate();
            days.push({ text: day, isToday });
            if (isToday) {
                console.log('Today detected:', { day, month: monthNames[month], year });
            }
        }

        console.log('Generated calendar days:', days);
        return days;
    }

    function handleKeyDown(e: KeyboardEvent, action: () => void): void {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    }

    const searchedActivities = $derived(searchActivities(activities, searchQuery));
    const filteredActivities = $derived(getFilteredActivities(activeFilter, searchedActivities));
    const visibleActivities = $derived(getVisibleActivities(activeFilter, currentPage, filteredActivities));
    const maxPages = $derived(Math.ceil(filteredActivities.length / itemsPerPage));
    const calendarDays = $derived(generateCalendarDays(currentCalendarMonth, currentCalendarYear));

    $effect(() => {
        updatePagination(activeFilter, currentPage, filteredActivities);
    });

    onMount(() => {
        console.log('Dashboard component mounted');
        mounted = true;
        setupUserDisplay();
        checkAuthentication();
    });
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="app flex min-h-screen bg-[#ECF6F9]">
    <div class="main-content flex-1 p-0 w-full">
        
        <div class="header-container p-4 xl:p-5 mx-0 mb-5 w-full">
            <header class="header bg-white rounded-lg border-b border-gray-200 p-4 flex justify-between items-center xl:p-5 w-full">
                <div class="header-left flex-1">
                    <div class="header-title text-xl font-bold text-gray-900 tracking-tight xl:text-2xl">{displayName}</div>
                    <div class="header-subtitle text-xs text-gray-500 mt-1 xl:text-sm">Content Management System Dashboard</div>
                </div>
                <div class="header-right flex items-center gap-3">
                    <div class="search-box flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-64 h-9 xl:w-80">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            bind:value={searchQuery}
                            on:input={handleSearch}
                            class="border-none bg-transparent outline-none focus:outline-none flex-1 text-sm xl:text-base"
                        />
                        <span class="material-symbols-outlined search-icon text-gray-500 cursor-pointer text-lg">search</span>
                    </div>
                    <div class="profile-section flex items-center gap-2 xl:gap-3">
                        <div class="profile-avatar w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">{displayInitial}</div>
                        <div class="profile-info">
                            <div class="profile-name font-medium text-sm text-gray-900">{displayName}</div>
                            <div class="profile-role text-xs text-gray-500">Administrator</div>
                        </div>
                        <button 
                            class="settings-btn cursor-pointer text-black hover:text-gray-700 transition-colors p-0"
                            on:click={goToSettings} 
                            title="Settings"
                            type="button"
                        >
                            <span class="material-symbols-outlined text-xl">settings</span>
                        </button>
                    </div>
                </div>
            </header>
        </div>

        <div class="dashboard-content grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4 p-4 xl:p-5">
            <div class="main-section flex flex-col gap-4">
                <div class="stats-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {#each [{ icon: 'settings', number: 35, label: 'Services', desc: 'Total layanan yang tersedia' }, { icon: 'inventory_2', number: 3, label: 'Products', desc: 'Produk dalam sistem' }, { icon: 'group', number: 2, label: 'Admin', desc: 'Total pengguna admin aktif' }] as stat}
                        <div class="stat-card relative bg-white rounded-lg p-4 shadow-sm text-center overflow-hidden">
                            <div class="stat-icon w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2.5 text-black text-lg">
                                <span class="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            <div class="stat-number text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                            <div class="stat-label text-sm font-semibold text-blue-600 mb-0.5">{stat.label}</div>
                            <div class="stat-desc text-xs text-gray-500 flex items-center justify-center">
                                <span class="green-icon material-symbols-outlined text-green-500 text-xs mr-0.5">trending_up</span>
                                {stat.desc}
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="container bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="header-activity bg-[#2448B1] text-white p-2.5 px-4 flex justify-between items-center">
                        <h1 class="text-sm font-semibold">Recent Activity</h1>
                        <div class="filter-tabs flex gap-1">
                            {#each ['all', 'updates', 'uploads'] as filter}
                                <div 
                                    class="filter-tab px-1.5 py-0.5 border border-white/30 bg-white/10 rounded-md cursor-pointer text-[10px] transition-all hover:bg-white/20"
                                    class:active={activeFilter === filter}
                                    on:click={() => setFilter(filter)}
                                    on:keydown={(e) => handleKeyDown(e, () => setFilter(filter))}
                                    role="button"
                                    tabindex="0"
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="table-header grid grid-cols-[80px_1fr_70px_80px] p-1.5 px-3 bg-gray-50 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                        <div>DATE</div>
                        <div>ACTIVITY</div>
                        <div>STATUS</div>
                        <div>USER</div>
                    </div>

                    <div class="activity-list min-h-[220px]">
                        {#if visibleActivities && visibleActivities.length > 0}
                            {#each visibleActivities as activity (activity.date + activity.time)}
                                <div class="activity-item grid grid-cols-[80px_1fr_70px_80px] p-1.5 px-3 border-b border-gray-200 items-center hover:bg-gray-50">
                                    <div class="date-time text-[10px] text-gray-500 flex flex-col">
                                        <div class="date font-medium text-gray-900 text-xs">{activity.date}</div>
                                        <div class="time text-[10px]">{activity.time}</div>
                                    </div>
                                    <div class="activity-content flex items-center gap-1.5">
                                        <div class="activity-icon w-5 h-5 rounded flex items-center justify-center text-xs {activity.iconClass}">
                                            <span class="material-symbols-outlined">{activity.icon}</span>
                                        </div>
                                        <div class="activity-details">
                                            <h3 class="text-xs font-semibold text-gray-900 mb-0.5">{activity.title}</h3>
                                            <p class="text-[10px] text-gray-500">{activity.desc}</p>
                                        </div>
                                    </div>
                                    <div class="status-badge status-{activity.status} flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-medium text-center w-14">
                                        <div class="status-dot status-dot-{activity.status} w-1 h-1 rounded-full"></div>
                                        {activity.status ? activity.status.toUpperCase() : ''}
                                    </div>
                                    <div class="user-info flex items-center gap-1">
                                        <div class="user-avatar {activity.avatarClass} w-4 h-4 rounded-full flex items-center justify-center font-semibold text-white text-[8px]">{activity.avatar}</div>
                                        <div class="user-name text-[10px] font-medium text-gray-900">{activity.user}</div>
                                    </div>
                                </div>
                            {/each}
                        {:else}
                            <div class="no-results flex flex-col items-center justify-center p-8 text-gray-500 text-center">
                                <span class="material-symbols-outlined text-3xl mb-1.5 opacity-50">search_off</span>
                                <p class="text-xs">No activities found matching your search</p>
                            </div>
                        {/if}
                    </div>

                    <div class="pagination p-1.5 px-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <div class="activity-count text-[10px] text-gray-500">
                            Showing {activityRange} of {totalActivities} activities
                        </div>
                        <div class="page-controls flex gap-0.5 items-center">
                            <button 
                                class="page-btn px-1.5 py-0.5 border border-gray-300 bg-white text-gray-700 rounded-md text-[9px] transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                                disabled={currentPage === 1}
                                on:click={prevPage}
                                type="button"
                            >
                                Previous
                            </button>
                            {#each Array(maxPages) as _, i}
                                <button 
                                    class="page-btn px-1.5 py-0.5 border border-gray-300 rounded-md text-[9px] transition-all {currentPage === i + 1 ? 'bg-[#2448B1] text-white border-[#2448B1]' : 'bg-white text-gray-700 hover:bg-gray-100'}"
                                    on:click={() => setPage(i + 1)}
                                    type="button"
                                >
                                    {i + 1}
                                </button>
                            {/each}
                            <button 
                                class="page-btn px-1.5 py-0.5 border border-gray-300 bg-white text-gray-700 rounded-md text-[9px] transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
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
                <div class="sidebar-section flex flex-col gap-4">
                    <div class="modern-calendar-widget bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="calendar-header p-4 border-b border-gray-100">
                            <div class="flex justify-between items-center">
                                <button 
                                    class="calendar-nav w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
                                    on:click={() => changeMonth(-1)}
                                    type="button"
                                >
                                    <span class="material-symbols-outlined text-base">chevron_left</span>
                                </button>
                                <h2 class="calendar-title text-base font-semibold text-gray-900">
                                    {monthNames[currentCalendarMonth]} {currentCalendarYear}
                                </h2>
                                <button 
                                    class="calendar-nav w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
                                    on:click={() => changeMonth(1)}
                                    type="button"
                                >
                                    <span class="material-symbols-outlined text-base">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="calendar-body p-4">
                            <div class="calendar-weekdays grid grid-cols-7 gap-1 mb-2">
                                {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
                                    <div class="calendar-weekday text-center text-xs font-medium text-gray-500 py-2">
                                        {day}
                                    </div>
                                {/each}
                            </div>
                            
                            <div class="calendar-days grid grid-cols-7 gap-1">
                                {#each calendarDays.slice(7) as day}
                                    <div class="calendar-day-cell">
                                        {#if !day.isEmpty}
                                            <button 
                                                class="calendar-day w-full h-8 flex items-center justify-center text-sm rounded-md transition-all {day.isToday ? 'bg-[#2448B1] text-white font-semibold shadow-sm' : 'text-gray-700 hover:bg-gray-100'}"
                                                type="button"
                                            >
                                                {day.text}
                                            </button>
                                        {:else}
                                            <div class="w-full h-8"></div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <div class="customers-section bg-white rounded-lg p-4 shadow-sm flex flex-col items-center">
                        <div class="customers-header flex flex-col items-center gap-1.5 mb-3 text-gray-900">
                            <div class="custom-three-person-icon flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                                    <circle cx="6" cy="6" r="2.5"/>
                                    <path d="M6 10c-2.5 0-4.5 2-4.5 4.5v1.5h9v-1.5C10.5 12 8.5 10 6 10z"/>
                                    <circle cx="12" cy="6" r="2.5"/>
                                    <path d="M12 10c-2.5 0-4.5 2-4.5 4.5v1.5h9v-1.5C16.5 12 14.5 10 12 10z"/>
                                    <circle cx="18" cy="6" r="2.5"/>
                                    <path d="M18 10c-2.5 0-4.5 2-4.5 4.5v1.5h9v-1.5C22.5 12 20.5 10 18 10z"/>
                                </svg>
                            </div>
                            <div class="customers-title font-semibold text-base">Our Customers</div>
                        </div>
                        <div class="customers-grid grid grid-cols-4 gap-2 justify-items-center max-w-[300px] w-full">
                            {#each [custbkj, custfinnet, custlintasarta, custbtn, custbri, custcaptifit, custkemnaker, custlinknet, '/assets/hotkan-logo.png', '/assets/customer-placeholder1.png', '/assets/customer-placeholder2.png', '/assets/customer-placeholder3.png', '/assets/customer-placeholder4.png', '/assets/customer-placeholder5.png', '/assets/customer-placeholder6.png', '/assets/customer-placeholder7.png'] as src, i}
                                <div class="customer-logo aspect-square bg-white border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md p-1 shadow-sm h-16 w-16">
                                    <img src={src} alt="Customer {i + 1}" class="customer-image w-full h-full object-contain rounded transition-transform hover:scale-105" />
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference "tailwindcss";
    
    :global(html, body) {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        @apply bg-[#ECF6F9] m-0 p-0 box-border;
    }

    .header-container {
        @apply p-4 xl:p-5 mx-0 mb-5 w-full;
    }

    .header {
        @apply bg-white rounded-lg border-b border-gray-200 p-4 flex justify-between items-center xl:p-5 w-full;
    }

    .header-left {
        @apply flex-1;
    }

    .header-right {
        @apply flex items-center gap-3;
    }

    .search-box {
        @apply flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-64 h-9 xl:w-80 transition-all duration-200;
    }

    .search-box:focus-within {
        @apply border-blue-500 ring-2 ring-blue-100;
    }

    .profile-section {
        @apply flex items-center gap-2 xl:gap-3;
    }

    .profile-avatar {
        @apply w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs;
    }

    .settings-btn {
        @apply cursor-pointer text-black hover:text-gray-700 transition-colors p-0 bg-transparent border-none;
    }

    .icon-product {
        @apply bg-blue-50 text-blue-600;
    }

    .icon-content {
        @apply bg-purple-50 text-purple-700;
    }

    .icon-customer {
        @apply bg-green-50 text-green-700;
    }

    .icon-upload {
        @apply bg-orange-50 text-orange-600;
    }

    .icon-system {
        @apply bg-gray-50 text-gray-600;
    }

    .status-success {
        @apply bg-green-100 text-green-600;
    }

    .status-dot-success {
        @apply bg-green-600 w-1 h-1 rounded-full aspect-square;
    }

    .status-pending {
        @apply bg-yellow-100 text-yellow-800;
    }

    .status-dot-pending {
        @apply bg-yellow-500 w-1 h-1 rounded-full aspect-square;
    }

    .status-failed {
        @apply bg-red-100 text-red-600;
    }

    .status-dot-failed {
        @apply bg-red-600 w-1 h-1 rounded-full aspect-square;
    }

    .avatar-putri {
        @apply bg-indigo-500;
    }

    .avatar-sarah {
        @apply bg-blue-500;
    }

    .avatar-joseph {
        @apply bg-purple-500;
    }

    .avatar-fattyah {
        @apply bg-cyan-500;
    }

    .avatar-annisa {
        @apply bg-green-500;
    }

    .avatar-zalfa {
        @apply bg-yellow-500;
    }

    .avatar-ivan {
        @apply bg-red-500;
    }

    .avatar-maya {
        @apply bg-pink-500;
    }

    .avatar-rudi {
        @apply bg-lime-500;
    }

    .avatar-sari {
        @apply bg-orange-500;
    }

    .avatar-dimas {
        @apply bg-lime-500;
    }

    .avatar-lina {
        @apply bg-teal-500;
    }

    .material-symbols-outlined {
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

    .stat-card {
        @apply relative bg-white rounded-lg p-4 shadow-sm text-center overflow-hidden;
    }

    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 0.375rem;
        background: #2448B1;
        z-index: 1;
    }

    .filter-tab.active {
        @apply bg-white/30 border-white;
    }

    
    @media (max-width: 1440px) {
        .header-container {
            @apply p-4 mx-0 mb-4;
        }
        .header {
            @apply p-4;
        }
        .header-title {
            @apply text-xl;
        }
        .search-box {
            @apply w-60 h-9;
        }
        .dashboard-content {
            @apply p-4 gap-4;
        }
        .stat-card {
            @apply p-3.5;
        }
        .stat-number {
            @apply text-xl;
        }
        .customers-grid {
            @apply max-w-[280px] gap-1.5;
        }
        .customer-logo {
            @apply h-14 w-14;
        }
        .calendar-header {
            @apply p-3;
        }
        .calendar-body {
            @apply p-3;
        }
    }

    @media (max-width: 1366px) {
        .header-container {
            @apply p-3.5 mx-0 mb-4;
        }
        .header {
            @apply p-3.5;
        }
        .header-title {
            @apply text-lg;
        }
        .search-box {
            @apply w-56 h-8.5 p-2;
        }
        .dashboard-content {
            @apply p-3.5 gap-3.5;
        }
        .stats-grid {
            @apply gap-2.5;
        }
        .stat-card {
            @apply p-3;
        }
        .stat-number {
            @apply text-lg;
        }
        .stat-icon {
            @apply w-7 h-7 text-base mb-2;
        }
        .activity-list {
            @apply min-h-[200px];
        }
        .customers-section {
            @apply p-3.5;
        }
        .customers-header {
            @apply gap-1 mb-2.5;
        }
        .customers-title {
            @apply text-sm;
        }
        .customers-grid {
            @apply max-w-[260px] gap-1.5;
        }
        .customer-logo {
            @apply h-12 w-12 p-0.75;
        }
        .custom-three-person-icon svg {
            @apply w-8 h-8;
        }
        .calendar-header {
            @apply p-3;
        }
        .calendar-body {
            @apply p-3;
        }
        .calendar-title {
            @apply text-sm;
        }
        .calendar-nav {
            @apply w-7 h-7;
        }
    }

    @media (max-width: 1280px) {
        .header-title {
            @apply text-base;
        }
        .search-box {
            @apply w-52 h-8 p-2;
        }
        .search-box input {
            @apply text-xs;
        }
        .dashboard-content {
            @apply p-3 gap-3;
        }
        .stats-grid {
            @apply gap-2;
        }
        .stat-card {
            @apply p-2.5;
        }
        .stat-number {
            @apply text-base;
        }
        .stat-icon {
            @apply w-6 h-6 text-sm mb-2;
        }
        .stat-label {
            @apply text-xs;
        }
        .stat-desc {
            @apply text-[9px];
        }
        .activity-list {
            @apply min-h-[180px];
        }
        .customers-section {
            @apply p-3;
        }
        .customers-header {
            @apply gap-1 mb-2;
        }
        .customers-title {
            @apply text-xs;
        }
        .customers-grid {
            @apply grid-cols-4 max-w-[240px] gap-1.5;
        }
        .customer-logo {
            @apply h-11 w-11 p-0.75;
        }
        .custom-three-person-icon svg {
            @apply w-7 h-7;
        }
        .calendar-header {
            @apply p-2.5;
        }
        .calendar-body {
            @apply p-2.5;
        }
        .calendar-title {
            @apply text-sm;
        }
        .calendar-nav {
            @apply w-6 h-6;
        }
        .calendar-weekday {
            @apply py-1.5 text-[10px];
        }
        .calendar-day {
            @apply h-7 text-xs;
        }
    }

    @media (max-width: 1200px) {
        .dashboard-content {
            @apply grid-cols-1;
        }
        .header-container {
            @apply p-3 mx-0 mb-3.5;
        }
        .header {
            @apply flex-col gap-2 text-center p-3;
        }
        .header-right {
            @apply flex-col gap-2;
        }
        .search-box {
            @apply w-full max-w-lg;
        }
        .stats-grid {
            @apply grid-cols-3 gap-2;
        }
        .table-header {
            @apply grid-cols-[60px_1fr_60px_70px] p-1 px-2 text-[9px];
        }
        .activity-item {
            @apply grid-cols-[60px_1fr_60px_70px] p-1 px-2;
        }
        .customers-section {
            @apply p-2.5;
        }
        .customers-header {
            @apply gap-1 mb-2;
        }
        .customers-title {
            @apply text-xs;
        }
        .customers-grid {
            @apply max-w-[220px] gap-1;
        }
        .customer-logo {
            @apply h-10 w-10 p-0.5;
        }
        .custom-three-person-icon svg {
            @apply w-6 h-6;
        }
        .calendar-header {
            @apply p-2;
        }
        .calendar-body {
            @apply p-2;
        }
        .calendar-title {
            @apply text-xs;
        }
        .calendar-nav {
            @apply w-6 h-6;
        }
        .calendar-weekday {
            @apply py-1 text-[10px];
        }
        .calendar-day {
            @apply h-6 text-[10px];
        }
    }

    @media (max-width: 1024px) {
        .header-container {
            @apply p-2.5 mx-0 mb-3;
        }
        .header {
            @apply p-2.5;
        }
        .header-title {
            @apply text-base;
        }
        .search-box {
            @apply w-48 h-7;
        }
        .stats-grid {
            @apply grid-cols-2 gap-2;
        }
        .stat-card {
            @apply p-2.5;
        }
        .stat-number {
            @apply text-sm;
        }
        .activity-details h3 {
            @apply text-[10px];
        }
        .activity-details p {
            @apply text-[9px];
        }
        .customers-section {
            @apply p-2;
        }
        .customers-header {
            @apply gap-0.75 mb-1.5;
        }
        .customers-title {
            @apply text-[11px];
        }
        .customers-grid {
            @apply grid-cols-3 max-w-[200px] gap-1;
        }
        .customer-logo {
            @apply h-10 w-10 p-0.5;
        }
        .custom-three-person-icon svg {
            @apply w-6 h-6;
        }
        .calendar-header {
            @apply p-2;
        }
        .calendar-body {
            @apply p-2;
        }
        .calendar-title {
            @apply text-xs;
        }
        .calendar-nav {
            @apply w-5 h-5;
        }
        .calendar-weekday {
            @apply py-1 text-[9px];
        }
        .calendar-day {
            @apply h-6 text-[9px];
        }
    }

    @media (max-width: 768px) {
        .header-container {
            @apply p-2 mx-0 mb-2;
        }
        .header {
            @apply p-2;
        }
        .header-title {
            @apply text-sm;
        }
        .search-box {
            @apply w-44 h-7 p-1;
        }
        .dashboard-content {
            @apply p-2 gap-2;
        }
        .stats-grid {
            @apply grid-cols-1 gap-1.5;
        }
        .stat-card {
            @apply p-2 flex items-center gap-2 text-left;
        }
        .stat-icon {
            @apply m-0 w-6 h-6 text-sm;
        }
        .table-header {
            @apply grid-cols-[50px_1fr_50px_60px] p-1 px-1.5 text-[8px];
        }
        .activity-item {
            @apply grid-cols-[50px_1fr_50px_60px] p-1 px-1.5;
        }
        .activity-content {
            @apply gap-1;
        }
        .activity-icon {
            @apply w-4 h-4 text-[10px];
        }
        .activity-details h3 {
            @apply text-[10px];
        }
        .activity-details p {
            @apply text-[8px];
        }
        .status-badge {
            @apply px-1 py-0.5 w-12 text-[7px];
        }
        .status-dot {
            @apply w-0.75 h-0.75 rounded-full aspect-square;
        }
        .user-info {
            @apply gap-0.5;
        }
        .user-avatar {
            @apply w-3.5 h-3.5 text-[7px];
        }
        .user-name {
            @apply text-[9px];
        }
        .no-results {
            @apply p-6;
        }
        .no-results .material-symbols-outlined {
            @apply text-2xl mb-1;
        }
        .no-results p {
            @apply text-[10px];
        }
        .pagination {
            @apply p-1 px-1.5;
        }
        .activity-count {
            @apply text-[9px];
        }
        .page-btn {
            @apply px-1 py-0.5 text-[8px] rounded-md;
        }
        .customers-section {
            @apply p-2;
        }
        .customers-header {
            @apply gap-0.5 mb-1;
        }
        .customers-title {
            @apply text-[10px];
        }
        .customers-grid {
            @apply grid-cols-3 gap-1 max-w-[180px];
        }
        .customer-logo {
            @apply h-9 w-9 p-0.5;
        }
        .custom-three-person-icon svg {
            @apply w-5 h-5;
        }
        .calendar-header {
            @apply p-1.5;
        }
        .calendar-body {
            @apply p-1.5;
        }
        .calendar-title {
            @apply text-[10px];
        }
        .calendar-nav {
            @apply w-5 h-5;
        }
        .calendar-weekdays {
            @apply mb-1;
        }
        .calendar-weekday {
            @apply py-0.5 text-[8px];
        }
        .calendar-day {
            @apply h-5 text-[8px];
        }
    }
</style>