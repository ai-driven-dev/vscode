# Contextual Coding Guidelines

Use these “When?” sections as micro-rules for specific tasks or outputs.

## When writing code
- Separate concerns into different files, functions, and tests
- Document only complex or domain-specific flows, no inline comments if possible

## When creating a function
- Write a function that does exactly one thing
- Use clear, descriptive variable names
- Limit parameters and prefer immutability
- Update any reference docs if behavior changes

## When writing a test
- Focus on behavior, not internal implementation
- Avoid over-mocking external services
- Use concise, realistic scenarios