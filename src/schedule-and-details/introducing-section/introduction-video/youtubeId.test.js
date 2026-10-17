import { isValidVideoId, normalizeVideoInput } from './youtubeId';

const ID = 'dQw4w9WgXcQ';

describe('normalizeVideoInput', () => {
  it.each([
    [`https://www.youtube.com/watch?v=${ID}`],
    [`https://www.youtube.com/watch?feature=share&v=${ID}&t=30s`],
    [`http://youtube.com/watch?v=${ID}&list=PL1`],
    [`https://m.youtube.com/watch?v=${ID}`],
    [`www.youtube.com/watch?v=${ID}`],
    [`youtube.com/watch?v=${ID}`],
    [`https://youtu.be/${ID}`],
    [`//www.youtube.com/embed/${ID}`],
    [`HTTPS://WWW.YOUTUBE.COM/watch?v=${ID}`],
    [`https://www.youtube.com/embed/${ID}/`],
    [`youtu.be/${ID}?si=abcDEF123&t=10`],
    [`https://www.youtube.com/shorts/${ID}`],
    [`youtube.com/shorts/${ID}?feature=share`],
    [`https://www.youtube.com/embed/${ID}?start=5`],
    [`https://www.youtube-nocookie.com/embed/${ID}`],
    [`https://www.youtube.com/live/${ID}?feature=share`],
    [`  ${ID}  `],
    [ID],
  ])('reduces %s to the ID', (input) => {
    expect(normalizeVideoInput(input)).toBe(ID);
  });

  it('returns blank for blank / nullish input', () => {
    expect(normalizeVideoInput('')).toBe('');
    expect(normalizeVideoInput('   ')).toBe('');
    expect(normalizeVideoInput(null)).toBe('');
    expect(normalizeVideoInput(undefined)).toBe('');
  });

  it.each([
    ['not a video'],
    ['https://vimeo.com/123456789'],
    [`https://evil.com/watch?v=${ID}`],
    [`https://youtube.com.evil.com/embed/${ID}`],
    ['https://www.youtube.com/'],
    ['https://www.youtube.com/watch'],
    [`https://music.youtube.com/watch?v=${ID}`],
    [`https://www.youtube.com/v/${ID}`],
    [`https://www.youtube.com/e/${ID}`],
    [`https://www.youtube-nocookie.com/watch?v=${ID}`],
    ['https://www.youtube.com/playlist?list=PL1234567890'],
    [`https://www.youtube.com/user/${ID}`],
    [`https://www.youtu.be/${ID}`],
    [`ftp://youtu.be/${ID}`],
    // eslint-disable-next-line no-script-url
    ['javascript:alert(1)'],
  ])('leaves %s unchanged so validation rejects it', (input) => {
    expect(normalizeVideoInput(input)).toBe(input);
    expect(isValidVideoId(normalizeVideoInput(input))).toBe(false);
  });
});

describe('isValidVideoId', () => {
  it('accepts blank (no video) and an 11-character ID', () => {
    expect(isValidVideoId('')).toBe(true);
    expect(isValidVideoId(null)).toBe(true);
    expect(isValidVideoId(ID)).toBe(true);
    expect(isValidVideoId('a_b-c_d-e_f')).toBe(true);
  });

  it.each([['dQw4w9WgXc'], ['dQw4w9WgXcQQ'], ['dQw4w9Wg XcQ'], ['dQw4w9WgXc?'], ['dQw4w9WgXc.']])(
    'rejects %s',
    (value) => expect(isValidVideoId(value)).toBe(false),
  );

  it('rejects a 10 or 12 character ID extracted from a link', () => {
    expect(isValidVideoId(normalizeVideoInput('youtu.be/dQw4w9WgXc'))).toBe(false);
    expect(isValidVideoId(normalizeVideoInput('youtu.be/dQw4w9WgXcQQ'))).toBe(false);
  });
});
