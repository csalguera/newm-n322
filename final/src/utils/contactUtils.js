/**
 * Gets the display name for a contact, handling both old and new data formats
 * @param {Object} contact - The contact object
 * @returns {string} - The display name
 */
export const getContactDisplayName = (contact = {}) => {
  const firstName = (contact.firstName || "").trim();
  const lastName = (contact.lastName || "").trim();
  const combined = `${firstName} ${lastName}`.trim();

  // Use new format if available
  if (combined) return combined;

  // Fall back to old format for backward compatibility
  if (contact.name) return contact.name;

  return "Unnamed";
};

/**
 * Splits a full name into first and last names
 * Handles both single and multi-word last names
 * @param {string} fullName - The full name to split
 * @returns {Object} - Object with { first: string, last: string }
 */
export const splitFullName = (fullName = "") => {
  const parts = fullName.trim().split(" ");
  if (!parts.length) return { first: "", last: "" };

  const [firstName, ...lastNameParts] = parts;
  return {
    first: firstName,
    last: lastNameParts.join(" ").trim(),
  };
};
