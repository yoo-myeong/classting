import { Column, Entity, Index } from 'typeorm';
import { BaseTimeEntity } from '@app/entity/BaseTimeEntity';

@Entity('school_page')
@Index('idx_school_page_1', ['region', 'name'])
export class SchoolPageEntity extends BaseTimeEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  region: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
  })
  schoolId: number;
}
