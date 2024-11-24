import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router: Router = express.Router();

const routers: string[] = fs.readdirSync(__dirname);

for (const route of routers) {
  // TypeScript tür güvenliği için ek kontroller
  if (route.endsWith('.ts') && route !== 'index.ts') {
    try {
      const routePath = `/${route.replace('.ts', '')}`;
      const modulePath = path.join(__dirname, route);
      const routeModule = require(modulePath);

      if (routeModule && routeModule.default) {
        // Eğer default bir Router export edildiyse
        router.use(routePath, routeModule.default);
      } else {
        console.warn(`No default export found in module: ${route}`);
      }
    } catch (error) {
      console.error(`Failed to load route: ${route}. Error: ${error}`);
    }
  }
}

export default router;
