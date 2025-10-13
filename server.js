const express = require('express');
const cors = require('cors');
const { VM } = require('vm2');
const path = require('path');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5555;
const isDev = process.env.NODE_ENV !== 'production';

// constants
const MAX_CODE_LENGTH = 10000;
const EXECUTION_TIMEOUT = 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // disabled for dev mode
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP in 15 minutes
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// slow down after rate limit
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, 
  delayAfter: 50, 
  delayMs: 1000, 
  validate: {
    delayMs: false // disable delayMs warning
  }
});

// middleware
app.use(cors());
app.use(express.json({ limit: '1mb' })); // limit request size
app.use('/api', limiter);
app.use('/api', speedLimiter);

// request logging
app.use((req, res, next) => {
  if (req.path === '/api/execute') {
    console.log(`[${new Date().toISOString()}] API Request from ${req.ip}`);
  }
  next();
});

// check if we're in development mode
if (isDev) {
  console.log('Running in development mode');
} else {
  // production mode - serve static files
  const buildPath = path.join(__dirname, 'client/build');
  app.use(express.static(buildPath));
}

// Safe JavaScript code execution
app.post('/api/execute', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    // create isolated execution environment
    let output = '';
    let hasOutput = false;
    
    // validation
    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({ success: false, error: 'Code too long' });
    }

    const dangerous = /require\s*\(|process\.|fs\.|child_process|eval\s*\(|Function\s*\(|import\s*\(|__dirname|__filename/;
    if (dangerous.test(code)) {
      return res.status(400).json({ success: false, error: 'Dangerous code detected' });
    }

    const vm = new VM({
      timeout: EXECUTION_TIMEOUT,
      sandbox: {
        console: {
          log: (...args) => {
            hasOutput = true;
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            output += message + '\n';
            return message;
          },
          error: (...args) => {
            hasOutput = true;
            const message = 'ERROR: ' + args.join(' ');
            output += message + '\n';
            return message;
          },
          warn: (...args) => {
            hasOutput = true;
            const message = 'WARN: ' + args.join(' ');
            output += message + '\n';
            return message;
          }
        },
        // add global functions for async operations with limits
        setTimeout: (callback, delay) => {
          if (delay > 10000) {
            throw new Error('Timeout delay too long. Maximum 10 seconds allowed.');
          }
          return setTimeout(callback, Math.min(delay, 10000));
        },
        setInterval: (callback, delay) => {
          if (delay < 100) {
            throw new Error('Interval too frequent. Minimum 100ms required.');
          }
          if (delay > 10000) {
            throw new Error('Interval delay too long. Maximum 10 seconds allowed.');
          }
          return setInterval(callback, Math.max(100, Math.min(delay, 10000)));
        },
        clearTimeout: (id) => {
          return clearTimeout(id);
        },
        clearInterval: (id) => {
          return clearInterval(id);
        },
        Promise: Promise,
        Math: Math,
        Date: Date,
        JSON: JSON
      }
    });

    // Execute code and handle async results
    let result;
    try {
      result = vm.run(code);
      
      // if result is a promise, wait for it to resolve
      if (result && typeof result.then === 'function') {
        result = await result;
      }
    } catch (error) {
      throw error;
    }
    
    // if no console output, show execution result
    if (!hasOutput && result !== undefined) {
      output += String(result);
    }
    
    res.json({ 
      success: true, 
      result: result !== undefined ? String(result) : (hasOutput ? 'Code executed' : 'undefined'),
      output: output || (result !== undefined ? String(result) : '')
    });

  } catch (error) {
    console.error('Execution error:', error.message);
    
    const safeError = error.message.includes('timeout') ? 'Execution timeout' :
                     error.message.includes('memory') ? 'Memory limit exceeded' :
                     error.message.includes('too') ? error.message : 'Execution failed';
    
    res.json({ success: false, error: safeError });
  }
});
// route for React static files (only in production)
if (!isDev) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`JavaScript Sandbox available at: http://localhost:${PORT}`);
});
