import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';
import { SchoolPageEntity } from '@app/entity/school-page/SchoolPage.entity';

@Entity('school_news')
@Index('idx_sc_1', ['schoolPage'])
export class SchoolNewsEntity extends BaseTimeEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @ManyToOne(() => SchoolPageEntity, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'school_page_id', referencedColumnName: 'id' })
  schoolPage: SchoolPageEntity;
}
