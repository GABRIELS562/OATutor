/**
 * PaymentService - Provider-agnostic payment abstraction
 *
 * Supports card/EFT payments via SA gateways (PayFast, Yoco, Ozow style).
 * Clean slot for Direct Carrier Billing to be added later.
 *
 * Usage:
 *   const result = await PaymentService.initiatePayment(userId, planId, 'card');
 *   // Redirect user to result.redirectUrl
 *   // Handle callback at /payment/callback
 */

import db from '../database/DatabaseService';
import { getPlan } from '../config/subscriptionConfig';

// Payment providers configuration
const PROVIDERS = {
    // Card/EFT providers (SA gateways)
    payfast: {
        id: 'payfast',
        name: 'PayFast',
        type: 'card',
        // STUB: Replace with actual PayFast credentials
        merchantId: process.env.REACT_APP_PAYFAST_MERCHANT_ID || 'STUB_MERCHANT_ID',
        merchantKey: process.env.REACT_APP_PAYFAST_MERCHANT_KEY || 'STUB_MERCHANT_KEY',
        baseUrl: process.env.REACT_APP_PAYFAST_URL || 'https://sandbox.payfast.co.za/eng/process',
        returnUrl: '/payment/success',
        cancelUrl: '/payment/cancel',
        notifyUrl: '/api/payment/webhook/payfast',
    },
    yoco: {
        id: 'yoco',
        name: 'Yoco',
        type: 'card',
        // STUB: Replace with actual Yoco credentials
        publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY || 'STUB_PUBLIC_KEY',
        secretKey: process.env.REACT_APP_YOCO_SECRET_KEY || 'STUB_SECRET_KEY',
        baseUrl: 'https://online.yoco.com/v1/charges',
    },
    ozow: {
        id: 'ozow',
        name: 'Ozow (EFT)',
        type: 'eft',
        // STUB: Replace with actual Ozow credentials
        siteCode: process.env.REACT_APP_OZOW_SITE_CODE || 'STUB_SITE_CODE',
        privateKey: process.env.REACT_APP_OZOW_PRIVATE_KEY || 'STUB_PRIVATE_KEY',
        baseUrl: 'https://pay.ozow.com',
    },
    // Placeholder for Direct Carrier Billing (airtime)
    dcb_vodacom: {
        id: 'dcb_vodacom',
        name: 'Pay with Airtime (Vodacom)',
        type: 'dcb',
        enabled: false, // Not yet implemented
        // STUB: DCB aggregator credentials will go here
        aggregatorId: process.env.REACT_APP_DCB_AGGREGATOR_ID || '',
        aggregatorKey: process.env.REACT_APP_DCB_AGGREGATOR_KEY || '',
    },
    dcb_mtn: {
        id: 'dcb_mtn',
        name: 'Pay with Airtime (MTN)',
        type: 'dcb',
        enabled: false, // Not yet implemented
    },
};

// Default provider for card payments
const DEFAULT_CARD_PROVIDER = 'payfast';

class PaymentService {
    /**
     * Get available payment methods
     */
    static getAvailableMethods() {
        return [
            {
                id: 'card',
                name: 'Card / EFT',
                description: 'Pay with credit/debit card or instant EFT',
                icon: 'CreditCard',
                providers: ['payfast', 'yoco', 'ozow'],
                enabled: true,
            },
            {
                id: 'dcb',
                name: 'Airtime (Coming Soon)',
                description: 'Pay with mobile airtime',
                icon: 'PhoneAndroid',
                providers: ['dcb_vodacom', 'dcb_mtn'],
                enabled: false, // Slot for future DCB implementation
            },
        ];
    }

    /**
     * Initiate a payment
     *
     * @param {string} userId - User ID
     * @param {string} planId - Subscription plan ID ('monthly' or 'annual')
     * @param {string} method - Payment method ('card' or 'dcb')
     * @param {string} providerId - Specific provider (optional)
     * @returns {object} { paymentId, redirectUrl, provider }
     */
    static async initiatePayment(userId, planId, method = 'card', providerId = null) {
        // Get plan details
        const plan = getPlan(planId);
        if (!plan) {
            throw new Error('Invalid plan');
        }

        // Determine provider
        let provider;
        if (method === 'dcb') {
            // DCB not yet implemented
            throw new Error('Direct Carrier Billing coming soon');
        } else {
            provider = PROVIDERS[providerId] || PROVIDERS[DEFAULT_CARD_PROVIDER];
        }

        // Create payment record in DB
        const paymentId = await db.createPayment(
            userId,
            planId,
            provider.id,
            plan.priceCents,
            plan.currency
        );

        // Generate payment URL based on provider
        let redirectUrl;
        let paymentData = {};

        switch (provider.id) {
            case 'payfast':
                paymentData = this._buildPayFastData(paymentId, plan, userId, provider);
                redirectUrl = `${provider.baseUrl}?${new URLSearchParams(paymentData).toString()}`;
                break;

            case 'yoco':
                // Yoco uses inline checkout, return config for frontend
                paymentData = this._buildYocoData(paymentId, plan, provider);
                redirectUrl = null; // Yoco is inline, no redirect
                break;

            case 'ozow':
                paymentData = this._buildOzowData(paymentId, plan, userId, provider);
                redirectUrl = `${provider.baseUrl}?${new URLSearchParams(paymentData).toString()}`;
                break;

            default:
                throw new Error('Unsupported payment provider');
        }

        return {
            paymentId,
            redirectUrl,
            provider: provider.id,
            providerName: provider.name,
            paymentData, // For inline checkout (Yoco)
            amount: plan.price,
            currency: plan.currency,
        };
    }

    /**
     * Build PayFast payment data
     * STUB: Replace with actual PayFast signature generation
     */
    static _buildPayFastData(paymentId, plan, userId, provider) {
        return {
            merchant_id: provider.merchantId,
            merchant_key: provider.merchantKey,
            return_url: `${window.location.origin}${provider.returnUrl}?payment_id=${paymentId}`,
            cancel_url: `${window.location.origin}${provider.cancelUrl}?payment_id=${paymentId}`,
            notify_url: `${window.location.origin}${provider.notifyUrl}`,
            m_payment_id: paymentId.toString(),
            amount: (plan.priceCents / 100).toFixed(2),
            item_name: `Angelo Tutoring - ${plan.name} Subscription`,
            item_description: plan.description,
            custom_str1: userId,
            custom_str2: plan.id,
            // STUB: Add signature generation here
            // signature: this._generatePayFastSignature(data, passphrase),
        };
    }

    /**
     * Build Yoco payment data
     * STUB: Replace with actual Yoco integration
     */
    static _buildYocoData(paymentId, plan, provider) {
        return {
            publicKey: provider.publicKey,
            amountInCents: plan.priceCents,
            currency: plan.currency,
            name: `Angelo Tutoring - ${plan.name}`,
            description: plan.description,
            metadata: {
                paymentId: paymentId.toString(),
                planId: plan.id,
            },
        };
    }

    /**
     * Build Ozow payment data
     * STUB: Replace with actual Ozow integration
     */
    static _buildOzowData(paymentId, plan, userId, provider) {
        return {
            SiteCode: provider.siteCode,
            CountryCode: 'ZA',
            CurrencyCode: plan.currency,
            Amount: (plan.priceCents / 100).toFixed(2),
            TransactionReference: paymentId.toString(),
            BankReference: `ANGELO-${paymentId}`,
            Customer: userId,
            Optional1: plan.id,
            CancelUrl: `${window.location.origin}/payment/cancel`,
            ErrorUrl: `${window.location.origin}/payment/error`,
            SuccessUrl: `${window.location.origin}/payment/success?payment_id=${paymentId}`,
            NotifyUrl: `${window.location.origin}/api/payment/webhook/ozow`,
            IsTest: process.env.NODE_ENV !== 'production',
            // STUB: Add hash generation here
            // HashCheck: this._generateOzowHash(data, privateKey),
        };
    }

    /**
     * Handle payment callback/webhook
     * Called when payment provider sends confirmation
     *
     * @param {string} provider - Provider ID
     * @param {object} data - Webhook data from provider
     * @returns {object} { success, paymentId, message }
     */
    static async handleCallback(providerId, data) {
        console.debug(`Payment callback from ${providerId}:`, data);

        let paymentId, status, providerReference;

        switch (providerId) {
            case 'payfast':
                paymentId = parseInt(data.m_payment_id);
                status = data.payment_status === 'COMPLETE' ? 'completed' : 'failed';
                providerReference = data.pf_payment_id;
                break;

            case 'yoco':
                paymentId = parseInt(data.metadata?.paymentId);
                status = data.status === 'successful' ? 'completed' : 'failed';
                providerReference = data.id;
                break;

            case 'ozow':
                paymentId = parseInt(data.TransactionReference);
                status = data.Status === 'Complete' ? 'completed' : 'failed';
                providerReference = data.TransactionId;
                break;

            default:
                throw new Error('Unknown payment provider');
        }

        // Update payment status
        await db.updatePaymentStatus(paymentId, status, providerReference, data);

        // If successful, extend subscription
        if (status === 'completed') {
            const payment = await db.getPayment(paymentId);
            if (payment) {
                await db.extendSubscription(payment.user_id, payment.plan_id, paymentId);
            }
        }

        return {
            success: status === 'completed',
            paymentId,
            status,
            message: status === 'completed' ? 'Payment successful!' : 'Payment failed',
        };
    }

    /**
     * Get payment status
     */
    static async getPaymentStatus(paymentId) {
        const payment = await db.getPayment(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }
        return {
            id: payment.id,
            status: payment.status,
            amount: payment.amount_cents / 100,
            currency: payment.currency,
            provider: payment.provider,
            createdAt: payment.created_at,
            completedAt: payment.completed_at,
        };
    }

    /**
     * Manually complete a payment (for testing/admin)
     */
    static async manualComplete(paymentId, userId) {
        const payment = await db.getPayment(paymentId);
        if (!payment) throw new Error('Payment not found');
        if (payment.user_id !== userId) throw new Error('Unauthorized');

        await db.updatePaymentStatus(paymentId, 'completed', 'MANUAL', { manual: true });
        await db.extendSubscription(payment.user_id, payment.plan_id, paymentId);

        return { success: true };
    }
}

export default PaymentService;
