// src/lib/slogin/store.js
import { writable } from 'svelte/store';

// Create stores
export const userName = writable('');
export const isLoggedIn = writable(false);
export const userRole = writable('');
export const userEmail = writable('');

/**
 * Helper function to save to localStorage
 * @param {string} key 
 * @param {any} value 
 */
function saveToStorage(key, value) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (error) {
        console.warn('Could not save to localStorage:', error);
    }
}

/**
 * Helper function to load from localStorage
 * @param {string} key - The storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any}
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
    } catch (error) {
        console.warn('Could not load from localStorage:', error);
    }
    return defaultValue;
}

// Function to restore session from localStorage
export function restoreSession() {
    const savedUserName = loadFromStorage('userName');
    const savedIsLoggedIn = loadFromStorage('isLoggedIn');
    const savedUserRole = loadFromStorage('userRole');
    const savedUserEmail = loadFromStorage('userEmail');
    
    if (savedUserName) userName.set(savedUserName);
    if (savedIsLoggedIn) isLoggedIn.set(savedIsLoggedIn);
    if (savedUserRole) userRole.set(savedUserRole);
    if (savedUserEmail) userEmail.set(savedUserEmail);
}

/**
 * Function to login user
 * @param {Object} userData - User data object
 * @param {string} [userData.name] - User's name
 * @param {string} [userData.username] - User's username
 * @param {string} [userData.email] - User's email
 * @param {string} [userData.role] - User's role
 */
export function loginUser(userData) {
    const name = userData.name || userData.username || 'Admin';
    const email = userData.email || '';
    const role = userData.role || 'admin';
    
    userName.set(name);
    userEmail.set(email);
    userRole.set(role);
    isLoggedIn.set(true);
    
    // Save to localStorage
    saveToStorage('userName', name);
    saveToStorage('userEmail', email);
    saveToStorage('userRole', role);
    saveToStorage('isLoggedIn', true);
}

// Function to logout user
export function logoutUser() {
    userName.set('');
    userEmail.set('');
    userRole.set('');
    isLoggedIn.set(false);
    
    // Clear localStorage
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            localStorage.removeItem('isLoggedIn');
        }
    } catch (error) {
        console.warn('Could not clear localStorage:', error);
    }
}

/**
 * Function to update user profile
 * @param {Object} newData - New user data
 * @param {string} [newData.name] - New name
 * @param {string} [newData.email] - New email
 * @param {string} [newData.role] - New role
 */
export function updateUserProfile(newData) {
    if (newData.name) {
        userName.set(newData.name);
        saveToStorage('userName', newData.name);
    }
    if (newData.email) {
        userEmail.set(newData.email);
        saveToStorage('userEmail', newData.email);
    }
    if (newData.role) {
        userRole.set(newData.role);
        saveToStorage('userRole', newData.role);
    }
}
