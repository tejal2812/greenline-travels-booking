import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Rate limiting configuration
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  "Too many authentication attempts, please try again later"
);

export const bookingRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  3, // 3 bookings per minute
  "Too many booking attempts, please wait before trying again"
);

export const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  "Too many requests, please try again later"
);

// Input validation middleware
export const validateInput = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Invalid input",
          details: result.error.issues
        });
      }
      req.body = result.data;
      next();
    } catch (error) {
      res.status(400).json({ error: "Invalid input format" });
    }
  };
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:;"
  );
  
  // Other security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: isDevelopment ? err.details : undefined
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized access'
    });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      error: 'Access forbidden'
    });
  }

  // Generic server error
  res.status(500).json({
    error: 'Internal server error',
    details: isDevelopment ? err.message : undefined
  });
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// CORS configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Admin role check middleware
export const requireAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user has admin role
    const { storage } = await import('./storage');
    const user = await storage.getUser(req.user.claims.sub);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Data sanitization
export const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    return data.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeData(value);
    }
    return sanitized;
  }
  
  return data;
};

// Database query optimization
export const queryOptimization = {
  // Connection pooling is handled by Drizzle/Neon
  
  // Query timeout
  queryTimeout: 30000, // 30 seconds
  
  // Connection limits
  maxConnections: process.env.NODE_ENV === 'production' ? 20 : 5,
  
  // Cache frequently accessed data
  cacheConfig: {
    routes: { ttl: 60 * 60, max: 100 }, // 1 hour, max 100 items
    operators: { ttl: 60 * 60, max: 50 },
    buses: { ttl: 30 * 60, max: 200 }, // 30 minutes
  }
};

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  const healthInfo = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };
  
  res.json(healthInfo);
};