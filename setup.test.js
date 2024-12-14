import { describe, it, expect } from 'vitest';
import { stripJSONComments } from './setup.js';

describe('stripJSONComments', () => {
    it('should return unchanged JSON when no comments are present', () => {
        const input = `{
            "name": "test",
            "value": 123
        }`;
        expect(stripJSONComments(input)).toBe(input);
    });

    it('should remove single-line comments', () => {
        const input = `{
            "name": "test", // This is a comment
            // Another comment
            "value": 123
        }`;
        const expected = `{
            "name": "test", 
            
            "value": 123
        }`;
        expect(stripJSONComments(input)).toBe(expected);
    });

    it('should remove multi-line comments', () => {
        const input = `{
            /* This is a
               multi-line comment */
            "name": "test",
            /**
             * Another multi-line comment
             */
            "value": 123
        }`;
        const expected = `{
            
            "name": "test",
            
            "value": 123
        }`;
        expect(stripJSONComments(input)).toBe(expected);
    });

    it('should not remove comments within strings', () => {
        const input = `{
            "comment": "This is not a // comment",
            "multiline": "This is not a /* comment */ either"
        }`;
        expect(stripJSONComments(input)).toBe(input);
    });
});
