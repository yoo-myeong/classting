import { BadRequestException } from '@nestjs/common';
import { SchoolPageDomain } from '@app/domain/school-page/SchoolPage.domain';

describe('SchoolPage Domain', () => {
  it('지역명은 최대 100자입니다', async () => {
    const sut = SchoolPageDomain.create({
      region: 'region'.repeat(101),
      name: 'name'.repeat(10),
      schoolId: 1,
    });

    await expect(sut.validate()).rejects.toThrow(BadRequestException);
  });

  it('페이지명은 최대 100자입니다', async () => {
    const sut = SchoolPageDomain.create({
      region: 'region'.repeat(10),
      name: 'name'.repeat(101),
      schoolId: 1,
    });

    await expect(sut.validate()).rejects.toThrow(BadRequestException);
  });

  it('학교 페이지 생성 도메인 유효성 검증', async () => {
    const sut = SchoolPageDomain.create({
      region: 'region'.repeat(10),
      name: 'name'.repeat(10),
      schoolId: 1,
    });

    await expect(sut.validate()).resolves.not.toThrow();
  });
});
