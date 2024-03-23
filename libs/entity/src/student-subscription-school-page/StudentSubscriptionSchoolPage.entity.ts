import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';

@Entity('student_subscription_school_page')
@Unique('unique_student_subscription_school_page_1', [
  'studentId',
  'schoolPage',
])
export class StudentSubscriptionSchoolPageEntity extends BaseTimeEntity {
  @Column({
    nullable: false,
  })
  studentId: number;

  @ManyToOne(() => SchoolPageEntity, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'school_page_id', referencedColumnName: 'id' })
  schoolPage: SchoolPageEntity;

  @DeleteDateColumn()
  deletedAt: Date;
}
