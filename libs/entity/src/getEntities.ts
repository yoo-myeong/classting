import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';
import { SchoolNewsEntity } from '@app/entity/school-news/SchoolNews.entity';
import { StudentSubscriptionSchoolPageEntity } from '@app/entity/student-subscription-school-page/StudentSubscriptionSchoolPage.entity';

export const getEntities = () => [
  SchoolPageEntity,
  SchoolNewsEntity,
  StudentSubscriptionSchoolPageEntity,
];
