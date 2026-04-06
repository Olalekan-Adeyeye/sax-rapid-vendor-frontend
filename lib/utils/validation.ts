/**
 * Checks if two provided passwords match.
 * Reusable helper function for form validation.
 * 
 * @param password The original password
 * @param confirmPassword The password confirmation to check against
 * @returns boolean True if passwords match, false otherwise
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
	return password === confirmPassword;
};
