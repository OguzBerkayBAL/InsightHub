import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    DOI: string;

    @Column('text')
    summary: string;

    @Column()
    archiveLink: string;

    @Column()
    category: string;

    @Column({ nullable: true, name: 'publicationdate', type: 'date' }) // Tarih türü
    publicationDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
