export const generateUniqueUsername = (firstName, lastName) => {
  // Clean and normalize the inputs
  const cleanFirstName = firstName.trim().toLowerCase();
  const cleanLastName = lastName.trim().toLowerCase();

  // Base username: first letter of first name + last name
  let baseUsername = cleanFirstName.charAt(0) + cleanLastName;

  // Remove special characters and spaces
  baseUsername = baseUsername.replace(/[^a-z0-9]/g, "");

  // Add random suffix for uniqueness (4-digit number)
  const randomSuffix = Math.floor(1000 + Math.random() * 900000);

  return baseUsername + randomSuffix;
};
