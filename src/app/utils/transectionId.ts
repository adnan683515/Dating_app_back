
import crypto from 'crypto';

/**
 * Generate a unique transaction ID
 * @param {string} prefix - optional prefix like "cs_test_"
 * @returns {string} - unique TX ID
 */
export function generateTxId(prefix = 'tr_uth_') {
  // 16 bytes random -> hex string
  const randomHex = crypto.randomBytes(16).toString('hex');
  // timestamp to make it more unique
  const timestamp = Date.now().toString(36);
  // combine prefix + timestamp + random
  return `${prefix}${timestamp}_${randomHex}`;
}

