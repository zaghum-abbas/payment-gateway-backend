# 🚨 CRITICAL: Set Environment Variables in Vercel

## The error you're seeing is because environment variables are NOT set in Vercel!

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project: `payment-gateway-backend`

2. **Navigate to Settings**
   - Click on the "Settings" tab at the top

3. **Go to Environment Variables**
   - In the left sidebar, click "Environment Variables"

4. **Add Each Variable**
   For EACH variable below, click "Add New" and enter:

   **Variable 1:**
   - Key: `MONGO_URI`
   - Value: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
   - Environment: Check ALL THREE boxes (Production, Preview, Development)
   - Click "Save"

   **Variable 2:**
   - Key: `STRIPE_SECRET_KEY`
   - Value: Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
   - Environment: Check ALL THREE boxes
   - Click "Save"

   **Variable 3:**
   - Key: `STRIPE_PUBLISHABLE_KEY`
   - Value: Your Stripe publishable key (starts with `pk_test_` or `pk_live_`)
   - Environment: Check ALL THREE boxes
   - Click "Save"

   **Variable 4:**
   - Key: `NODE_ENV`
   - Value: `production`
   - Environment: Check ONLY "Production"
   - Click "Save"

   **Variable 5 (if you have webhooks):**
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: Your Stripe webhook secret (starts with `whsec_`)
   - Environment: Check ALL THREE boxes
   - Click "Save"

5. **Redeploy**
   - After adding all variables, go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"
   - Check "Use existing Build Cache" (optional)
   - Click "Redeploy"

6. **Wait for Deployment**
   - Wait 1-2 minutes for the deployment to complete

7. **Test**
   - Visit: `https://your-app.vercel.app/health`
   - You should see:
     ```json
     {
       "hasMongoUri": true,
       "hasStripeKey": true
     }
     ```

## How to Find Your Values:

### MongoDB URI:
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

### Stripe Keys:
1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Click "Developers" → "API keys"
3. Copy "Publishable key" and "Secret key"
4. For test mode, use keys starting with `pk_test_` and `sk_test_`

## MongoDB Atlas Network Access:

Make sure Vercel can connect to your MongoDB:
1. Go to MongoDB Atlas
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

## Verification:

After setting variables and redeploying, check:
- ✅ All 4-5 environment variables are set
- ✅ Each variable has all three environments checked
- ✅ MongoDB allows connections from 0.0.0.0/0
- ✅ Deployment completed successfully
- ✅ `/health` endpoint shows `hasMongoUri: true` and `hasStripeKey: true`

## Still Not Working?

If you still see errors after setting environment variables:
1. Check the Vercel Function Logs for specific error messages
2. Verify your MongoDB connection string is correct
3. Verify your Stripe keys are correct (test vs production)
4. Make sure you clicked "Redeploy" after adding variables
