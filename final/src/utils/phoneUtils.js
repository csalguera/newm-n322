/**
 * Formats a phone number string into (XXX) XXX-XXXX format
 * @param {string} value - The phone number string to format
 * @returns {string} - The formatted phone number
 */
export const formatPhoneNumber = (value = "") => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/**
 * Extracts only digits from a string
 * @param {string} value - The string to extract digits from
 * @returns {string} - Only the digits
 */
export const extractDigits = (value = "") => value.replace(/\D/g, "");

/**
 * Validates that a phone number has exactly 10 digits
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhoneNumber = (phoneNumber = "") => {
  return extractDigits(phoneNumber).length === 10;
};
