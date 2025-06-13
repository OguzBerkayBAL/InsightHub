import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  university: string;

  @Column()
  subjectLink: string;

  @Column()
  country: string;

  @Column({ type: 'date' })
  subjectYear: Date;

  @CreateDateColumn() // bunlar her entity(model) de olacak.
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
