import { BadRequestException } from '@nestjs/common';
import { CreateSchoolPage } from '@app/domain/school-page/create-sc-page.domain';

describe('CreateSchoolPage Domain', () => {
  it('지역명은 최대 100자입니다', async () => {
    const sut = CreateSchoolPage.create({
      region: 'region'.repeat(101),
      name: 'name'.repeat(10),
      schoolId: 1,
    });

    await expect(sut.validate()).rejects.toThrow(BadRequestException);
  });

  it('페이지명은 최대 100자입니다', async () => {
    const sut = CreateSchoolPage.create({
      region: 'region'.repeat(10),
      name: 'name'.repeat(101),
      schoolId: 1,
    });

    await expect(sut.validate()).rejects.toThrow(BadRequestException);
  });

  it('학교 페이지 생성 도메인 유효성 검증', async () => {
    const sut = CreateSchoolPage.create({
      region: 'region'.repeat(10),
      name: 'name'.repeat(10),
      schoolId: 1,
    });

    await expect(sut.validate()).resolves.not.toThrow();
  });
});
