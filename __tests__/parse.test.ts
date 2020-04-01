import { parse } from '../src';

describe('parse', () => {
  it('parses just headers', () => {
    const output = parse(`To: a@example.com\nContent-Type: text/invalid\n`);

    expect(output).toMatchObject({
      contentType: {
        type: 'text/invalid',
      },
      body: '',
      headers: {
        To: 'a@example.com',
        'Content-Type': 'text/invalid',
      },
    });
  });

  it('parses just body (text/plain)', () => {
    const output = parse(`\nHello world`);

    expect(output).toMatchObject({
      contentType: {
        type: 'text/plain',
      },
      body: 'Hello world',
    });
  });

  it('parses multiline headers', () => {
    const output = parse(`X-Test-Header: test\n test\n`);

    expect(output).toMatchObject({
      headers: {
        'X-Test-Header': 'test\ntest',
      },
    });
  });

  it('parses multipart messages', () => {
    const output = parse(
      `Content-Type: multipart/alternative; boundary="boundary"\n\n--boundary\nContent-Type: text/plain\n\nHello world!\n\n--boundary\nContent-Type: text/plain\n\nHello, again!\n\n--boundary--`
    );

    expect(output).toMatchObject({
      body: [
        {
          contentType: {
            type: 'text/plain',
          },
          body: 'Hello world!',
        },
        {
          contentType: {
            type: 'text/plain',
          },
          body: 'Hello, again!',
        },
      ],
    });
  });
});