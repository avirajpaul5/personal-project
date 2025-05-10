import { Window as WindowType } from "../components/utils/types";

/**
 * Global image cache to store loaded images
 */
export const imageCache = new Map<string, HTMLImageElement>();

/**
 * Preloads app icons to ensure they're ready when needed
 * @param apps Array of app window objects
 * @returns Promise that resolves when all icons are loaded
 */
export const preloadAppIcons = (apps: WindowType[]): Promise<void[]> => {
  const preloadPromises = apps.map((app) => {
    return new Promise<void>((resolve) => {
      // Skip if already cached
      if (imageCache.has(app.icon)) {
        resolve();
        return;
      }

      const img = new Image();
      img.src = app.icon;
      img.onload = () => {
        imageCache.set(app.icon, img);
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to preload icon: ${app.icon}`);
        resolve(); // Resolve anyway to not block loading
      };
    });
  });

  // Also preload the Launchpad icon
  const launchpadPromise = new Promise<void>((resolve) => {
    const launchpadIconPath = "/assets/launchpad icon.png";
    if (imageCache.has(launchpadIconPath)) {
      resolve();
      return;
    }

    const img = new Image();
    img.src = launchpadIconPath;
    img.onload = () => {
      imageCache.set(launchpadIconPath, img);
      resolve();
    };
    img.onerror = () => {
      console.warn(`Failed to preload Launchpad icon`);
      resolve();
    };
  });

  return Promise.all([...preloadPromises, launchpadPromise]);
};

/**
 * Preloads essential components to ensure they're ready when needed
 * @param apps Array of app window objects
 * @returns Promise that resolves when all components are loaded
 */
export const preloadEssentialComponents = async (
  apps: WindowType[]
): Promise<void> => {
  // Preload app icons
  await preloadAppIcons(apps);

  // Preload essential components
  const componentPromises = [
    // Import Navbar and Dock components
    import("../components/layout/Navbar"),
    import("../components/layout/Dock"),

    // Import Window component
    import("../components/layout/Window"),

    // Import DockIcon and LaunchpadIcon components
    import("../components/layout/DockIcon"),
    import("../components/layout/LaunchpadIcon"),
  ];

  await Promise.all(componentPromises);
};
