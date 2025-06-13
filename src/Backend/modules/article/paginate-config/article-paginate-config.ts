import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Article } from '../entities/article.entity';  // Article entity'sini doğru yoldan import ettiğinden emin ol

export const ARTICLE_PAGINATION_CONFIG: PaginateConfig<Article> = {
//   relations: ['author', 'category'],  // İlişkili alanlar; article'ın author ve category gibi ilişkili alanları olabilir
  sortableColumns: ['publicationDate', 'title'],  // Sıralanabilir sütunlar
  searchableColumns: ['title', 'author', 'category'],  // Aranabilir sütunlar; ilişkilendirilmiş tablolardaki alanlar da aranabilir
  defaultSortBy: [['publicationDate', 'DESC']],  // Varsayılan sıralama
  filterableColumns: {
    author: [FilterOperator.ILIKE],
    category: [FilterOperator.EQ],
    title: [FilterOperator.EQ, FilterOperator.IN],
    publicationDate: [FilterOperator.EQ],  // Yayın tarihine göre eşleşen
  },
  maxLimit: 50,  // Maksimum döndürülebilecek sonuç sayısı (0 sınırsız)
};
