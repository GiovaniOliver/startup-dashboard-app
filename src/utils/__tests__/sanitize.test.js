import {
  escapeHtml,
  unescapeHtml,
  stripHtml,
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  sanitizeFilename,
  sanitizeNumber,
  sanitizeCurrency,
  sanitizeObject,
  sanitizeSearchQuery,
  sanitizeSqlInput,
  sanitizeJson,
  removeScripts
} from '../sanitize';

describe('Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    test('escapes HTML special characters', () => {
      expect(escapeHtml('<script>alert("XSS")</script>'))
        .toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    test('escapes ampersand', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    test('escapes quotes', () => {
      expect(escapeHtml(`"double" and 'single'`))
        .toBe('&quot;double&quot; and &#x27;single&#x27;');
    });

    test('returns non-string values unchanged', () => {
      expect(escapeHtml(123)).toBe(123);
      expect(escapeHtml(null)).toBe(null);
    });
  });

  describe('unescapeHtml', () => {
    test('unescapes HTML entities', () => {
      expect(unescapeHtml('&lt;div&gt;')).toBe('<div>');
      expect(unescapeHtml('&amp;')).toBe('&');
      expect(unescapeHtml('&quot;')).toBe('"');
    });

    test('returns non-string values unchanged', () => {
      expect(unescapeHtml(123)).toBe(123);
    });
  });

  describe('stripHtml', () => {
    test('removes HTML tags', () => {
      expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World');
    });

    test('removes all tags', () => {
      expect(stripHtml('<div><span>Text</span></div>')).toBe('Text');
    });

    test('returns non-string values unchanged', () => {
      expect(stripHtml(123)).toBe(123);
    });
  });

  describe('sanitizeString', () => {
    test('removes null bytes', () => {
      expect(sanitizeString('test\0value')).toBe('testvalue');
    });

    test('removes control characters', () => {
      expect(sanitizeString('test\x01\x02value')).toBe('testvalue');
    });

    test('preserves line breaks when allowed', () => {
      expect(sanitizeString('line1\nline2', { allowLineBreaks: true }))
        .toBe('line1\nline2');
    });

    test('removes line breaks when not allowed', () => {
      expect(sanitizeString('line1\nline2', { allowLineBreaks: false }))
        .toBe('line1line2');
    });

    test('trims whitespace by default', () => {
      expect(sanitizeString('  text  ')).toBe('text');
    });

    test('preserves whitespace when trim is false', () => {
      expect(sanitizeString('  text  ', { trim: false })).toBe('  text  ');
    });
  });

  describe('sanitizeEmail', () => {
    test('converts to lowercase', () => {
      expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
    });

    test('removes invalid characters', () => {
      expect(sanitizeEmail('test<>@example.com')).toBe('test@example.com');
    });

    test('trims whitespace', () => {
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com');
    });
  });

  describe('sanitizePhone', () => {
    test('preserves valid phone characters', () => {
      expect(sanitizePhone('+1-234-567-8900')).toBe('+1-234-567-8900');
    });

    test('removes invalid characters', () => {
      expect(sanitizePhone('123-456-7890 ext. 123')).toBe('123-456-7890  123');
    });

    test('trims whitespace', () => {
      expect(sanitizePhone('  123-456-7890  ')).toBe('123-456-7890');
    });
  });

  describe('sanitizeUrl', () => {
    test('allows valid URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    });

    test('blocks javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert("XSS")')).toBe('');
    });

    test('blocks data: URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert()</script>')).toBe('');
    });

    test('trims whitespace', () => {
      expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com');
    });
  });

  describe('sanitizeFilename', () => {
    test('removes path separators', () => {
      expect(sanitizeFilename('../../../etc/passwd')).toBe('etcpasswd');
    });

    test('removes invalid characters', () => {
      expect(sanitizeFilename('file:name?.txt')).toBe('filename.txt');
    });

    test('removes null bytes', () => {
      expect(sanitizeFilename('file\0name.txt')).toBe('filename.txt');
    });
  });

  describe('sanitizeNumber', () => {
    test('returns number unchanged', () => {
      expect(sanitizeNumber(42)).toBe(42);
    });

    test('parses numeric string', () => {
      expect(sanitizeNumber('42')).toBe(42);
    });

    test('parses decimal when allowed', () => {
      expect(sanitizeNumber('3.14', { allowDecimals: true })).toBe(3.14);
    });

    test('returns NaN for decimals when not allowed', () => {
      expect(sanitizeNumber('3.14', { allowDecimals: false })).toBeNaN();
    });

    test('parses negative numbers when allowed', () => {
      expect(sanitizeNumber('-42', { allowNegative: true })).toBe(-42);
    });

    test('returns NaN for negatives when not allowed', () => {
      expect(sanitizeNumber('-42', { allowNegative: false })).toBeNaN();
    });

    test('returns NaN for invalid input', () => {
      expect(sanitizeNumber('abc')).toBeNaN();
    });
  });

  describe('sanitizeCurrency', () => {
    test('returns number unchanged', () => {
      expect(sanitizeCurrency(10.99)).toBe(10.99);
    });

    test('removes currency symbols', () => {
      expect(sanitizeCurrency('$10.99')).toBe(10.99);
    });

    test('removes commas', () => {
      expect(sanitizeCurrency('1,234.56')).toBe(1234.56);
    });

    test('rounds to 2 decimal places', () => {
      expect(sanitizeCurrency('10.999')).toBe(11);
    });

    test('returns NaN for invalid input', () => {
      expect(sanitizeCurrency('abc')).toBeNaN();
    });
  });

  describe('sanitizeObject', () => {
    test('sanitizes all string values', () => {
      const obj = {
        name: '  John  ',
        email: '  test@example.com  '
      };

      const result = sanitizeObject(obj);
      expect(result.name).toBe('John');
      expect(result.email).toBe('test@example.com');
    });

    test('sanitizes nested objects', () => {
      const obj = {
        user: {
          name: '  John  ',
          info: {
            bio: '  Developer  '
          }
        }
      };

      const result = sanitizeObject(obj);
      expect(result.user.name).toBe('John');
      expect(result.user.info.bio).toBe('Developer');
    });

    test('sanitizes arrays', () => {
      const arr = ['  item1  ', '  item2  '];
      const result = sanitizeObject(arr);
      expect(result).toEqual(['item1', 'item2']);
    });

    test('preserves non-string values', () => {
      const obj = {
        name: 'John',
        age: 30,
        active: true,
        data: null
      };

      const result = sanitizeObject(obj);
      expect(result.age).toBe(30);
      expect(result.active).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('sanitizeSearchQuery', () => {
    test('removes HTML tags', () => {
      expect(sanitizeSearchQuery('<script>search</script>')).toBe('scriptsearchscript');
    });

    test('removes special characters', () => {
      expect(sanitizeSearchQuery('search!@#$%')).toBe('search');
    });

    test('preserves hyphens', () => {
      expect(sanitizeSearchQuery('multi-word-search')).toBe('multi-word-search');
    });

    test('limits length to 100 characters', () => {
      const longQuery = 'a'.repeat(150);
      expect(sanitizeSearchQuery(longQuery).length).toBe(100);
    });
  });

  describe('sanitizeSqlInput', () => {
    test('removes SQL comments', () => {
      expect(sanitizeSqlInput('value -- comment')).toBe('value  comment');
    });

    test('removes SQL keywords', () => {
      expect(sanitizeSqlInput('DROP TABLE users')).toBe(' ');
    });

    test('is case insensitive', () => {
      expect(sanitizeSqlInput('DeLeTe FrOm users')).toBe(' ');
    });

    test('preserves safe input', () => {
      expect(sanitizeSqlInput('John Doe')).toBe('John Doe');
    });
  });

  describe('sanitizeJson', () => {
    test('parses and sanitizes valid JSON', () => {
      const json = '{"name": "  John  ", "age": 30}';
      const result = sanitizeJson(json);
      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
    });

    test('returns null for invalid JSON', () => {
      const result = sanitizeJson('invalid json');
      expect(result).toBeNull();
    });

    test('sanitizes nested JSON', () => {
      const json = '{"user": {"name": "  John  "}}';
      const result = sanitizeJson(json);
      expect(result.user.name).toBe('John');
    });
  });

  describe('removeScripts', () => {
    test('removes script tags', () => {
      const html = '<div>Hello</div><script>alert("XSS")</script>';
      expect(removeScripts(html)).toBe('<div>Hello</div>');
    });

    test('removes inline event handlers', () => {
      const html = '<button onclick="alert()">Click</button>';
      expect(removeScripts(html)).toBe('<button>Click</button>');
    });

    test('removes multiple scripts', () => {
      const html = '<script>code1</script><div>content</div><script>code2</script>';
      expect(removeScripts(html)).toBe('<div>content</div>');
    });
  });
});
