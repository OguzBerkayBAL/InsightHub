import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ArxivArticle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    arxivId: string;

    @Column()
    title: string;

    @Column('text')
    summary: string;

    @Column('simple-array')
    authors: string[];

    @Column('simple-array', { nullable: true })
    categories: string[];

    @Column()
    link: string;

    @Column({ nullable: true })
    pdfLink: string;

    @Column({ type: 'timestamp' })
    publishedDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 