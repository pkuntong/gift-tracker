import { event, trackConversion } from './analytics';

// Event types
export enum EventType {
  SIGNUP = 'signup',
  LOGIN = 'login',
  CREATE_EVENT = 'create_event',
  ADD_GIFT = 'add_gift',
  MARK_THANK_YOU = 'mark_thank_you',
  EXPORT_DATA = 'export_data',
  UPGRADE_PLAN = 'upgrade_plan',
  PURCHASE = 'purchase',
}

// Conversion types
export enum ConversionType {
  FREE_SIGNUP = 'free_signup',
  PRO_PURCHASE = 'pro_purchase',
  PLANNER_PURCHASE = 'planner_purchase',
}

/**
 * Track user events
 */
export const trackEvent = (
  eventType: EventType,
  label: string,
  value?: number
) => {
  event({
    action: eventType,
    category: 'user_action',
    label,
    value,
  });
};

/**
 * Track conversions
 */
export const trackUserConversion = (
  conversionType: ConversionType,
  value?: number
) => {
  trackConversion(conversionType, value);
};

/**
 * Track signup events
 */
export const trackSignup = (plan: string) => {
  trackEvent(EventType.SIGNUP, plan);
  if (plan === 'free') {
    trackUserConversion(ConversionType.FREE_SIGNUP);
  }
};

/**
 * Track purchase events
 */
export const trackPurchase = (plan: string, amount: number) => {
  trackEvent(EventType.PURCHASE, plan, amount);
  
  if (plan === 'pro') {
    trackUserConversion(ConversionType.PRO_PURCHASE, amount);
  } else if (plan === 'planner') {
    trackUserConversion(ConversionType.PLANNER_PURCHASE, amount);
  }
};

/**
 * Track gift-related events
 */
export const trackGiftEvent = (action: string, giftType: string) => {
  trackEvent(EventType.ADD_GIFT, `${action}_${giftType}`);
};

/**
 * Track thank you note events
 */
export const trackThankYouEvent = (count: number) => {
  trackEvent(EventType.MARK_THANK_YOU, `thank_you_notes`, count);
}; 