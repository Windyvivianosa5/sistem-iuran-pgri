# Midtrans Payment Integration - PGRI Iuran System

## Overview
This document explains the Midtrans payment gateway integration for the PGRI Iuran (membership fee) management system.

## Features Implemented

### 1. Transaction Management
- **Transaction Model**: Tracks all payment transactions with comprehensive fields
- **Status Tracking**: Monitors payment status (pending, settlement, cancel, deny, expire, failure)
- **Order Management**: Unique order IDs for each transaction
- **Payment History**: Complete transaction history for each user

### 2. Midtrans Integration
- **Snap Payment**: Uses Midtrans Snap for seamless payment experience
- **Multiple Payment Methods**: Supports various payment methods (credit card, bank transfer, e-wallet, etc.)
- **Webhook Notifications**: Automatic status updates via Midtrans callbacks
- **Secure Transactions**: 3D Secure enabled for card payments

### 3. Dashboard Features
- **Payment Button**: Easy-to-use payment interface
- **Transaction History**: View all past transactions with status
- **Real-time Updates**: Automatic page refresh after successful payment
- **Status Badges**: Visual indicators for transaction status

## Configuration

### Environment Variables
Add the following to your `.env` file:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=your-server-key-here
MIDTRANS_CLIENT_KEY=your-client-key-here
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
```

### Getting Midtrans Keys

1. **Register at Midtrans**
   - Go to https://dashboard.midtrans.com/
   - Create an account or login
   
2. **Get Sandbox Keys** (for testing)
   - Navigate to Settings → Access Keys
   - Copy the Sandbox Server Key and Client Key
   
3. **Get Production Keys** (for live)
   - After verification, get Production keys from the same page
   - Set `MIDTRANS_IS_PRODUCTION=true` in `.env`

## Database Schema

### Transactions Table
```sql
- id: Primary key
- user_id: Foreign key to users table
- order_id: Unique order identifier
- transaction_id: Midtrans transaction ID
- gross_amount: Payment amount
- payment_type: Payment method used
- payment_method: Specific payment method
- status: Transaction status (pending, settlement, cancel, deny, expire, failure)
- snap_token: Midtrans Snap token
- description: Transaction description
- transaction_time: When transaction was initiated
- settlement_time: When payment was settled
- metadata: Additional transaction data (JSON)
- created_at, updated_at: Timestamps
```

## API Endpoints

### 1. Create Transaction
**POST** `/kabupaten/transaction/create`

**Request Body:**
```json
{
  "amount": 50000,
  "description": "Iuran Bulan Desember 2025"
}
```

**Response:**
```json
{
  "success": true,
  "snap_token": "xxx-xxx-xxx",
  "order_id": "TRX-1-1234567890"
}
```

### 2. Check Transaction Status
**GET** `/kabupaten/transaction/status/{orderId}`

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": 1,
    "order_id": "TRX-1-1234567890",
    "status": "settlement",
    "gross_amount": 50000,
    ...
  }
}
```

### 3. Get User Transactions
**GET** `/kabupaten/transactions`

**Response:**
```json
{
  "success": true,
  "transactions": [...]
}
```

### 4. Midtrans Webhook
**POST** `/midtrans/notification`

This endpoint receives automatic notifications from Midtrans when payment status changes.

## Usage Guide

### For Users (Kabupaten Dashboard)

1. **Making a Payment**
   - Click "Bayar Iuran dengan Midtrans" button
   - Enter payment amount (minimum Rp 1,000)
   - Add description (optional)
   - Click "Bayar Sekarang"
   - Complete payment in Midtrans popup

2. **Viewing Transaction History**
   - Recent transactions appear automatically on dashboard
   - Shows Order ID, description, amount, status, and date
   - Status badges indicate payment state

### Payment Status Meanings

- **Pending** (Yellow): Payment initiated but not completed
- **Berhasil** (Green): Payment successful and settled
- **Dibatalkan** (Red): Payment cancelled by user
- **Ditolak** (Red): Payment denied by bank/system
- **Kadaluarsa** (Gray): Payment link expired
- **Gagal** (Red): Payment failed

## Testing

### Sandbox Testing
Use Midtrans sandbox credentials for testing:

**Test Credit Cards:**
- Success: 4811 1111 1111 1114
- Challenge: 4411 1111 1111 1118
- Failure: 4911 1111 1111 1113

**CVV:** Any 3 digits
**Expiry:** Any future date

### Test Flow
1. Set `MIDTRANS_IS_PRODUCTION=false`
2. Use sandbox keys
3. Make a test payment
4. Use test credit card numbers
5. Verify transaction status updates

## Webhook Configuration

### Setting Up Webhook in Midtrans Dashboard

1. Login to Midtrans Dashboard
2. Go to Settings → Configuration
3. Set Payment Notification URL to:
   ```
   https://your-domain.com/midtrans/notification
   ```
4. Enable HTTP notification
5. Save settings

### Local Testing with ngrok
For local development:
```bash
ngrok http 8000
```
Use the ngrok URL for webhook configuration.

## Security Considerations

1. **Server Key**: Never expose server key in frontend code
2. **CSRF Protection**: All POST requests include CSRF token
3. **User Authentication**: All transaction endpoints require authentication
4. **3D Secure**: Enabled for additional card security
5. **Input Sanitization**: Enabled in Midtrans config

## Troubleshooting

### Common Issues

1. **"Snap token not generated"**
   - Check server key is correct
   - Verify Midtrans credentials
   - Check error logs

2. **"Payment popup doesn't open"**
   - Ensure Snap.js is loaded
   - Check client key is correct
   - Verify browser console for errors

3. **"Webhook not working"**
   - Verify webhook URL is accessible
   - Check server logs
   - Ensure URL is HTTPS (for production)

4. **"Transaction status not updating"**
   - Check webhook configuration
   - Verify notification endpoint is working
   - Check database for transaction record

## File Structure

```
app/
├── Http/Controllers/
│   └── TransactionController.php    # Transaction handling
├── Models/
│   └── Transaction.php               # Transaction model
config/
└── midtrans.php                      # Midtrans configuration
database/
└── migrations/
    └── xxx_create_transactions_table.php
resources/
└── js/pages/kabupaten/dashboard/
    └── index.tsx                     # Dashboard with payment UI
routes/
└── web.php                           # Transaction routes
```

## Support

For Midtrans support:
- Documentation: https://docs.midtrans.com/
- Support: support@midtrans.com
- Dashboard: https://dashboard.midtrans.com/

## License

This integration is part of the PGRI Iuran Management System.
