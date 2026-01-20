# Vercel Deployment Guide for Payment Gateway API

## Prerequisites
- Vercel account
- Git repository connected to Vercel
- MongoDB Atlas database (or other MongoDB instance accessible from the internet)

## Step 1: Configure Environment Variables in Vercel

**CRITICAL**: The "FUNCTION_INVOCATION_FAILED" error is most commonly caused by missing environment variables.

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `MONGO_URI` | Your MongoDB connection string | Production, Preview, Development |
   | `STRIPE_SECRET_KEY` | Your Stripe secret key | Production, Preview, Development |
   | `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |

   **Important Notes:**
   - Make sure to select all three environments (Production, Preview, Development) for each variable
   - The `MONGO_URI` must be accessible from the internet (use MongoDB Atlas)
   - Double-check there are no extra spaces in your values

## Step 2: Verify Your Files

Make sure these files are correctly configured:

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

### `package.json` (verify these fields)
```json
{
  "main": "index.js",
  "type": "commonjs"
}
```

## Step 3: Deploy

### Option A: Deploy via Git (Recommended)
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

Vercel will automatically deploy when you push to your connected branch.

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel --prod
```

## Step 4: Test Your Deployment

After deployment, test these endpoints:

1. **Root endpoint**: `https://your-app.vercel.app/`
   - Should return: `{"message": "Payment Gateway API", "status": "success", ...}`

2. **Health check**: `https://your-app.vercel.app/health`
   - Should return environment status
   - Check that `hasMongoUri` and `hasStripeKey` are both `true`
   - Check that `mongoConnectionState` is `1` (connected) or `2` (connecting)

3. **API endpoint**: `https://your-app.vercel.app/api/v1/...`

## Troubleshooting

### Error: "FUNCTION_INVOCATION_FAILED"

**Cause 1: Missing Environment Variables**
- Solution: Go to Vercel Settings → Environment Variables and add all required variables
- After adding, redeploy the project

**Cause 2: Database Connection Issues**
- Check that your MongoDB URI is correct
- Ensure your MongoDB instance allows connections from anywhere (0.0.0.0/0) or Vercel's IP ranges
- For MongoDB Atlas: Go to Network Access → Add IP Address → Allow Access from Anywhere

**Cause 3: Code Errors**
- Check Vercel deployment logs: Project → Deployments → Click on deployment → View Function Logs
- Look for specific error messages

### How to View Logs

1. Go to your Vercel dashboard
2. Click on your project
3. Click on **Deployments**
4. Click on the latest deployment
5. Click on **Functions** tab
6. Click on your function to see logs

### MongoDB Atlas Configuration

If using MongoDB Atlas:
1. Go to your cluster
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (or add `0.0.0.0/0`)
5. Click **Confirm**

## Common Issues

### Issue: "Cannot find module"
- Make sure all dependencies are in `dependencies` (not `devDependencies`)
- Run `npm install` locally to verify

### Issue: Database connection timeout
- Check MongoDB Atlas network access settings
- Verify your MONGO_URI is correct
- Ensure your database user has proper permissions

### Issue: Stripe errors
- Verify STRIPE_SECRET_KEY is set correctly in Vercel
- Make sure you're using the correct key (test vs production)

## Verification Checklist

- [ ] All environment variables are set in Vercel
- [ ] MongoDB allows connections from Vercel
- [ ] `vercel.json` is properly configured
- [ ] Code is pushed to Git repository
- [ ] Deployment completed successfully
- [ ] `/health` endpoint returns success
- [ ] Environment variables show as `true` in health check
- [ ] API endpoints are working

## Need More Help?

Check the Vercel function logs for specific error messages:
1. Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to "Functions" tab
4. Click on the function name to see detailed logs
