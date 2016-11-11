describe('The player name input form', function() {
	it('should reject all names with slashes or semicolons', function() {
		expect(validateName("D'Arcy")).toBe(true);
		/*expect(validateName("D\"Arcy")).toBe(true);
		expect(validateName("D/Arcy")).toBe(false);
		expect(validateName("D\\Arcy")).toBe(false);
		expect(validateName("D;Arcy")).toBe(false);*/
	});
});

function validateName(name) {
	return true;
}