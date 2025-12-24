import { buildOrderSQL } from '@/common/repositories/helpers';
import { ListWithMeta } from '@/common/repositories/types';
import { ProjectListQueryDto } from '@/modules/projects/dtos';
import { ProjectRecord } from '@/modules/projects/providers/interfaces';
import { ProjectRepository } from '@/modules/projects/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectListProvider {
  /**
   * Handles retrieval of paginated and filtered projects.
   */
  constructor(private readonly projectRepository: ProjectRepository) {}

  /**
   * Fetch paginated projects with optional search, relations, and sorting.
   *
   * @param dto - Query parameters including page, limit, search term, sort, and filters
   * @returns {Promise<ListWithMeta<ProjectRecord, 'projects'>>} Paginated projects with metadata.
   */
  async execute(dto: ProjectListQueryDto): Promise<ListWithMeta<ProjectRecord, 'projects'>> {
    const dbType = this.projectRepository.repo.manager.connection.options.type;
    const isPostgres = dbType === 'postgres';

    const { q, page = 1, limit = 10, sortBy, profileId } = dto;
    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const params: any[] = [];
    const placeholders = (n: number) => (isPostgres ? `$${n}` : `?`);

    /* WHERE conditions */
    if (profileId) {
      whereClauses.push(`p.id = ${placeholders(params.length + 1)}`);
      params.push(profileId);
    }

    if (q) {
      const likeOperator = isPostgres ? 'ILIKE' : 'LIKE';
      whereClauses.push(
        `(i.title ${likeOperator} ${placeholders(params.length + 1)} OR p.bio ${likeOperator} ${placeholders(params.length + 2)})`,
      );
      params.push(`%${q}%`, `%${q}%`);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    /* ORDER BY */
    const orderSQL = buildOrderSQL(sortBy);

    /* COUNT total */
    const countQuery = `
      SELECT COUNT(DISTINCT i.id) AS total
      FROM projects i
      LEFT JOIN profiles p ON p.project_id = i.id
      LEFT JOIN tasks t ON t.project_id = i.id
      ${whereSQL};
    `;
    const countResult = await this.projectRepository.rawQuery<{ total: string }>(
      countQuery,
      params,
    );
    const total = Number(countResult[0]?.total || 0);
    const pages = Math.ceil(total / limit);

    /* JSON field and LIMIT/OFFSET */
    const jsonProfile = isPostgres
      ? `json_build_object(
          'id', p.id,
          'createdAt', p.created_at,
          'updatedAt', p.updated_at,
          'bio', p.bio
        ) AS profile`
      : `JSON_OBJECT(
          'id', p.id,
          'createdAt', p.created_at,
          'updatedAt', p.updated_at,
          'bio', p.bio
        ) AS profile`;

    const limitOffsetSQL = isPostgres
      ? `OFFSET ${offset} LIMIT ${limit}`
      : `LIMIT ${offset}, ${limit}`;

    /* FETCH ITEMS */
    const itemsQuery = `
      SELECT
        i.id,
      i.title,
      i.created_at AS createdAt,
      i.updated_at AS updatedAt,
        ${jsonProfile},
        COUNT(t.id) AS totalTasks
      FROM projects i
      LEFT JOIN profiles p ON p.project_id = i.id
      LEFT JOIN tasks t ON t.project_id = i.id
      ${whereSQL}
      GROUP BY i.id, p.id
      ORDER BY ${orderSQL}
      ${limitOffsetSQL};
    `;

    const items = await this.projectRepository.rawQuery<ProjectRecord>(itemsQuery, params);

    return {
      meta: {
        total,
        pages,
        currentPage: page,
      },
      projects: items,
    };
  }
}
