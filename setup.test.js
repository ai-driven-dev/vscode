import { describe, it, expect } from 'vitest';
import { stripJSONComments, getDescriptionFromComments } from './setup.js';

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

describe('getDescriptionFromComments', () => {
    it('should find single-line comment description above a key', () => {
        const input = `{
            // This is a description
            "someKey": true
        }`;
        expect(getDescriptionFromComments(input, 'someKey')).toBe('This is a description');
    });

    it('should handle keys with no comments', () => {
        const input = `{
            "someKey": true
        }`;
        expect(getDescriptionFromComments(input, 'someKey')).toBe('');
    });

    it('should find comment even with multi-line comments present', () => {
        const input = `{
            /**
             * Some multi-line comment
             */
            // This is the actual description
            "someKey": true
        }`;
        expect(getDescriptionFromComments(input, 'someKey')).toBe('This is the actual description');
    });

    it('should return empty string for non-existent key', () => {
        const input = `{
            // This is a description
            "someKey": true
        }`;
        expect(getDescriptionFromComments(input, 'nonExistentKey')).toBe('');
    });

    it('should find comment for multiple keys under the same comment', () => {
        const input = `{
            /** Editor Settings **/
            // Configure word wrap settings
            "editor.wordWrap": "on",
            "editor.wordWrapColumn": 80,
            "editor.wrappingIndent": "same",

            /** Other Settings **/
            // Different description
            "other.setting": true
        }`;
        expect(getDescriptionFromComments(input, 'editor.wordWrap')).toBe('Configure word wrap settings');
        expect(getDescriptionFromComments(input, 'editor.wordWrapColumn')).toBe('Configure word wrap settings');
        expect(getDescriptionFromComments(input, 'editor.wrappingIndent')).toBe('Configure word wrap settings');
        expect(getDescriptionFromComments(input, 'other.setting')).toBe('Different description');
    });
});
