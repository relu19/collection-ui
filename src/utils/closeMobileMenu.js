/**
 * Utility function to close the mobile menu by removing focus from the menu element
 * This is used when navigation occurs to ensure the mobile menu closes automatically
 */
export const closeMobileMenu = () => {
    // Remove focus from the menu element to close it on mobile
    const menuElement = document.querySelector('.menu');
    if (menuElement) {
        menuElement.blur();
    }
};

export default closeMobileMenu;
