import { BadRequestException } from '@nestjs/common';
import { SchoolNewsDomain } from '@app/domain/school-news/SchoolNews.domain';

describe('SchoolNewsDomain', () => {
  it('소식 제목 길이는 2이상 100이하입니다', async () => {
    await expect(
      SchoolNewsDomain.create({
        title: 't',
        content: 'content'.repeat(20),
        schoolPageId: 1,
      }).validate(),
    ).rejects.toThrow(BadRequestException);

    await expect(
      SchoolNewsDomain.create({
        title: 'title'.repeat(101),
        content: 'content'.repeat(20),
        schoolPageId: 1,
      }).validate(),
    ).rejects.toThrow(BadRequestException);
  });

  it('소식 내용 길이는 20 이상입니다', async () => {
    const sut = SchoolNewsDomain.create({
      title: 'title',
      content: 'content',
      schoolPageId: 1,
    });

    await expect(sut.validate()).rejects.toThrow(BadRequestException);
  });

  it('학교 소식 도메인 유효성 검증', async () => {
    const sut = SchoolNewsDomain.create({
      title: 'title'.repeat(10),
      content: 'content'.repeat(10),
      schoolPageId: 1,
    });

    await expect(sut.validate()).resolves.not.toThrow();
  });

  it('학교 소식 수정', async () => {
    const sut = SchoolNewsDomain.create({
      title: 'title'.repeat(10),
      content: 'content',
      schoolPageId: 1,
    });
    const updateContext = {
      title: 'title2',
      content: 'content2'.repeat(10),
    };

    sut.update(updateContext);

    expect(sut.getUpdateContext()).toEqual(updateContext);
  });
});
