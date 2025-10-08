  <script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { userName, isLoggedIn, restoreSession } from '../../lib/store';
    import api from '$lib/axios-instance';
    import { PUBLIC_BASE_URL } from '$env/static/public';
	import { env } from '$env/dynamic/public';

    interface Activity {
        id: number;
        date: string;
        icon: string;
        iconClass: string;
        title: string;
        desc: string;
        status: 'success' | 'failed' | 'pending';
        user: string;
        page: number;
        type: string;
    }

    interface CalendarDay {
        text: string | number;
        isHeader?: boolean;
        isEmpty?: boolean;
        isToday?: boolean;
    }

    const now = new Date();

    let currentPage = $state(1);
    let itemsPerPage = $state(7);
    let currentCalendarMonth = $state(now.getMonth());
    let currentCalendarYear = $state(now.getFullYear());
    let totalActivities = $state(0);
    let activityRange = $state('0-0');
    let displayName = $state('');
    let displayInitial = $state('');
    let displayImage = $state(''); 
    let mounted = $state(false);
    let searchQuery = $state('');
    let productsCount = $state(0);
    let servicesCount = $state(0);
    let totalAdmins = $state(0);
    let activities = $state<Activity[]>([]);

    const monthNames: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    async function fetchActivities(): Promise<void> {
        try {
            const res = await api.get('/api/activities?populate=*&sort=date:desc&pagination[pageSize]=100000');
            console.log('API Response:', JSON.stringify(res.data, null, 2)); // Debug
            if (!res.data.data || res.data.data.length === 0) {
                console.warn('No activities found in API response');
                activities = [];
                totalActivities = 0;
                return;
            }
            activities = res.data.data.map((log: any, index: number) => {
                const username = log.users_permissions_user?.username || 'Unknown';
                const activityRaw = log.activity?.toLowerCase() || '';
                const contentType = activityRaw.match(/api::(\w+)\.\w+/)?.[1] || 'customer';

                let icon = 'settings';
                let iconClass = 'icon-system';
                let type = 'system';
                if (activityRaw.includes('product')) {
                    icon = 'inventory_2';
                    iconClass = 'icon-product';
                    type = 'update';
                } else if (activityRaw.includes('service')) {
                    icon = 'settings';
                    iconClass = 'icon-service';
                    type = 'update';
                } else if (activityRaw.includes('customer') || activityRaw.includes('user')) {
                    icon = 'person';
                    iconClass = 'icon-customer';
                    type = 'update';
                } else if (activityRaw.includes('about-us') || activityRaw.includes('home-setting') || activityRaw.includes('contact')) {
                    icon = 'info';
                    iconClass = 'icon-info';
                    type = 'update';
                } else if (activityRaw.includes('product-section-setting') || activityRaw.includes('service-section-setting')) {
                    icon = 'tune';
                    iconClass = 'icon-setting';
                    type = 'update';
                }

                const dateTime = new Date(log.date);
                const activityData = {
                    id: log.id,
                    date: dateTime.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    }),
                    icon,
                    iconClass,
                    title: activityRaw ? activityRaw.charAt(0).toUpperCase() + activityRaw.slice(1) : 'Unknown activity',
                    desc: '',
                    status: log.activity_status?.toLowerCase() || 'pending',
                    user: username,
                    page: Math.ceil((index + 1) / itemsPerPage),
                    type,
                };
                console.log(`Mapped Activity ${log.id}:`, JSON.stringify(activityData, null, 2)); // Debug
                return activityData;
            });
            totalActivities = res.data.meta?.pagination?.total || activities.length;
            localStorage.setItem('activities', JSON.stringify(activities));
        } catch (error) {
            console.error('Failed to fetch activities:', error);
            const cached = localStorage.getItem('activities');
            if (cached) {
                activities = JSON.parse(cached);
                totalActivities = activities.length;
            } else {
                activities = [];
                totalActivities = 0;
            }
        }
    }

    async function fetchTotalAdmins(): Promise<void> {
        try {
            const res = await api.get("/api/users");
            totalAdmins = res.data.length;
            console.log('Total admins:', totalAdmins);
        } catch (error) {
            console.error('Failed to fetch admin count:', error);
            totalAdmins = 0;
        }
    }

    async function setupUserDisplay(): Promise<void> {
        try {
            const res = await api.get("/api/users/me?populate=image");
            const body = res.data;

            displayName = body.username || 'Admin';
            displayInitial = displayName.charAt(0).toUpperCase();

            if (body.image && body.image.url) {
                displayImage = body.image.url.startsWith('http')
                    ? body.image.url
                    : `${env.PUBLIC_BASE_URL}${body.image.url}`;
            } else {
                displayImage = ''; 
            }

            localStorage.setItem('userName', body.username);
            userName.set(body.username);
            console.log('Loaded user:', body.username, 'Image:', displayImage);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            const savedUser = localStorage.getItem('userName');

            if (savedUser) {
                displayName = savedUser;
                displayInitial = displayName.charAt(0).toUpperCase();
            } else {
                displayName = 'Admin';
                displayInitial = 'A';
            }

            displayImage = ''; 
        }
    }

    async function fetchProductsCount(): Promise<void> {
        try {
            const res = await api.get("/api/products?pagination[limit]=0");
            productsCount = res.data.meta?.pagination?.total || 0;
            console.log('Products count loaded:', productsCount);
        } catch (error) {
            console.error('Failed to fetch products count:', error);
            productsCount = 0;
        }
    }

    async function fetchServicesCount(): Promise<void> {
        try {
            const res = await api.get("/api/services?pagination[limit]=0");
            servicesCount = res.data.meta?.pagination?.total || 0;
            console.log('Services count loaded:', servicesCount);
        } catch (error) {
            console.error('Failed to fetch services count:', error);
            servicesCount = 0;
        }
    }

    function goToSettings(): void {
        goto('admin/dashboard-setting');
    }

    function checkAuthentication(): boolean {
        const token = localStorage.getItem('jwt');
        if (token) {
            userName.set('admin');
            isLoggedIn.set(true);
            localStorage.setItem('userName', 'admin');
            localStorage.setItem('isLoggedIn', 'true');
            return true;
        }
        return false;
    }

    function handleSearch(): void {
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

    function getVisibleActivities(page: number, filtered: Activity[]): Activity[] {
        const start = (page - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }

    function updatePagination(page: number, filtered: Activity[]): void {
        const visibleCount = filtered.length;
        const start = (page - 1) * itemsPerPage + 1;
        const end = Math.min(start + itemsPerPage - 1, visibleCount);
        activityRange = visibleCount > 0 ? `${start}-${end}` : '0-0';
        totalActivities = visibleCount;
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
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const days: CalendarDay[] = [];

        const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        dayHeaders.forEach(day => {
            days.push({ text: day, isHeader: true });
        });

        for (let i = 0; i < firstDay; i++) {
            days.push({ text: '', isEmpty: true });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate();
            days.push({ text: day, isToday });
        }

        return days;
    }

    const searchedActivities = $derived(searchActivities(activities, searchQuery));
    const visibleActivities = $derived(getVisibleActivities(currentPage, searchedActivities));
    const maxPages = $derived(Math.ceil(searchedActivities.length / itemsPerPage));
    const calendarDays = $derived(generateCalendarDays(currentCalendarMonth, currentCalendarYear));

    $effect(() => {
        updatePagination(currentPage, searchedActivities);
    });

    let intervalId: number;

    onMount(() => {
        mounted = true;
        setupUserDisplay();
        checkAuthentication();
        fetchProductsCount();
        fetchServicesCount();
        fetchTotalAdmins();
        fetchActivities();
        intervalId = setInterval(fetchActivities, 10000);
        return () => clearInterval(intervalId);
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
                            class="border-none bg-transparent outline-none focus:outline-none flex-1 text-sm xl:text-base" />
                        <span class="material-symbols-outlined search-icon text-gray-500 cursor-pointer text-lg">search</span>
                    </div>
                    <div class="profile-section flex items-center gap-2 xl:gap-3">
                        <div class="profile-avatar w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs overflow-hidden">
                            {#if displayImage}  
                                <img src={displayImage} alt={displayName} class="w-full h-full object-cover" />
                            {:else}
                                {displayInitial}
                            {/if}
                        </div>
                        <div class="flex flex-col leading-tight">
                            <span class="font-semibold text-gray-900 text-sm">{displayName}</span>
                            <span class="text-xs text-gray-500">Administrator</span>
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
                    {#each [
                        { icon: 'settings', number: servicesCount, label: 'Services', desc: 'Service available' }, 
                        { icon: 'inventory_2', number: productsCount, label: 'Products', desc: 'Products in system' }, 
                        { icon: 'group', number: totalAdmins, label: 'Admin', desc: 'Active admins' }
                    ] as stat}
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
                    <div class="header-activity bg-[#2448B1] text-white p-2.5 px-4">
                        <h1 class="text-sm font-semibold">Recent Activity</h1>
                    </div>
                    <div class="table-header grid grid-cols-[120px_1fr_100px_120px] p-1.5 px-3 bg-gray-50 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                        <div class="text-left pl-2">DATE</div>
                        <div class="text-left pl-2">ACTIVITY</div>
                        <div class="text-left pl-2">STATUS</div>
                        <div class="text-left pl-2">USER</div>
                    </div>

                    <div class="activity-list min-h-[220px]">
                        {#if visibleActivities && visibleActivities.length > 0}
                            {#each visibleActivities as activity (activity.id + '-' + currentPage)}
                                <div class="activity-item grid grid-cols-[120px_1fr_100px_120px] p-1.5 px-3 border-b border-gray-200 last:border-b-0 items-center hover:bg-gray-50">
                                    <div class="date-time pl-2">
                                        <div class="date font-medium text-gray-900 text-xs">{activity.date}</div>
                                    </div>
                                    <div class="activity-content pl-2 flex items-center gap-2">
                                        <span class="material-symbols-outlined {activity.iconClass} text-lg">{activity.icon}</span>
                                        <h3 class="text-xs font-semibold text-gray-900">{activity.title}</h3>
                                    </div>
                                    <div class="pl-2">
                                        <div class="status-badge status-{activity.status} flex items-center gap-1 px-2 py-1 rounded text-[8px] font-medium w-10">
                                            <div class="status-dot status-dot-{activity.status} w-1.5 h-1.5 rounded-full"></div>
                                            <span>{activity.status.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div class="user-info pl-2">
                                        <div class="user-name text-xs font-medium text-gray-900">{activity.user}</div>
                                    </div>
                                </div>
                            {/each}
                        {:else}
                            <div class="no-results flex flex-col items-center justify-center p-8 text-gray-500 text-center">
                                <span class="material-symbols-outlined text-3xl mb-1.5 opacity-50">search_off</span>
                                <p class="text-xs">No recent activity</p>
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
                <div class="sidebar-section flex flex-col h-full">
                    <div class="modern-calendar-widget bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
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
                        
                        <div class="calendar-body p-6 flex-1 flex flex-col">
                            <div class="calendar-weekdays grid grid-cols-7 gap-2 mb-3">
                                {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
                                    <div class="calendar-weekday text-center text-sm font-semibold text-gray-600 py-2">
                                        {day}
                                    </div>
                                {/each}
                            </div>
                            
                            <div class="calendar-days grid grid-cols-7 gap-2 flex-1">
                                {#each calendarDays.slice(7) as day}
                                    <div class="calendar-day-cell h-full">
                                        {#if !day.isEmpty}
                                            <button 
                                                class="calendar-day w-full h-full flex items-center justify-center text-base rounded-lg transition-all {day.isToday ? 'bg-[#2448B1] text-white font-semibold shadow-md' : 'text-gray-700 hover:bg-gray-100 font-medium'}"
                                                type="button"
                                            >
                                                {day.text}
                                            </button>
                                        {:else}
                                            <div class="w-full h-full"></div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
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

    .icon-service {
        @apply bg-gray-50 text-gray-600;
    }

    .icon-customer {
        @apply bg-green-50 text-green-700;
    }

    .icon-info {
        @apply bg-blue-50 text-blue-600;
    }

    .icon-setting {
        @apply bg-yellow-50 text-yellow-600;
    }

    .status-success {
        @apply bg-green-100 text-green-600;
    }

    .status-dot-success {
        @apply bg-green-600 w-1.5 h-1.5 rounded-full aspect-square;
    }

    .status-pending {
        @apply bg-yellow-100 text-yellow-800;
    }

    .status-dot-pending {
        @apply bg-yellow-500 w-1.5 h-1.5 rounded-full aspect-square;
    }

    .status-failed {
        @apply bg-red-100 text-red-600;
    }

    .status-dot-failed {
        @apply bg-red-600 w-1.5 h-1.5 rounded-full aspect-square;
    }

    .status-badge {
        @apply flex items-center gap-1 px-2 py-1 rounded text-[8px] font-medium w-[62px] justify-start;
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
        .calendar-header {
            @apply p-3;
        }
        .calendar-body {
            @apply p-5;
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
        .calendar-header {
            @apply p-3;
        }
        .calendar-body {
            @apply p-4;
        }
        .calendar-title {
            @apply text-sm;
        }
        .calendar-nav {
            @apply w-7 h-7;
        }
        .calendar-weekday {
            @apply py-1.5 text-[10px];
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
        .calendar-header {
            @apply p-2.5;
        }
        .calendar-body {
            @apply p-3;
        }
        .calendar-title {
            @apply text-xs;
        }
        .calendar-nav {
            @apply w-6 h-6;
        }
        .calendar-weekday {
            @apply py-1 text-[9px];
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
        .calendar-header {
            @apply p-2;
        }
        .calendar-body {
            @apply p-3;
        }
        .calendar-title {
            @apply text-xs;
        }
        .calendar-nav {
            @apply w-6 h-6;
        }
        .calendar-weekday {
            @apply py-1 text-[9px];
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
        .dashboard-content {
            @apply p-2 gap-2;
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
        .calendar-header {
            @apply p-2;
        }
        .calendar-body {
            @apply p-2.5;
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
        .activity-details h3 {
            @apply text-[10px];
        }
        .status-badge {
            @apply px-1 py-0.5 w-10 text-[7px];
        }
        .status-dot {
            @apply w-0.75 h-0.75 rounded-full aspect-square;
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
        .calendar-header {
            @apply p-1.5;
        }
        .calendar-body {
            @apply p-2;
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
    }
</style>