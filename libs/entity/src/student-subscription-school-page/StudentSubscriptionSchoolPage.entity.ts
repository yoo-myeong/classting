import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';

@Entity('student_subscription_school_page')
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
