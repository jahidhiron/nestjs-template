import { handle } from '@/common/helpers';
import {
  ListParams,
  ListResult,
  PaginatedListParams,
  PaginatedResult,
  RangeCondition,
} from '@/common/repositories/interfaces';
import { AppLogger } from '@/config/logger';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindOneOptions,
  FindOperator,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class BaseRepository<T extends ObjectLiteral> {
  public readonly repo: Repository<T>;

  constructor(
    protected readonly dataSource: DataSource,
    entity: new () => T,
    private readonly alias: string,
    protected readonly errorResponse: ErrorResponse,
    protected readonly logger: AppLogger,
  ) {
    this.repo = this.dataSource.getRepository(entity);
  }

  public createQueryBuilder(alias?: string): SelectQueryBuilder<T> {
    return this.repo.createQueryBuilder(alias ?? this.alias);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    options?: {
      relations?: FindOptionsRelations<T>;
      select?: FindOptionsSelect<T>;
      order?: FindOptionsOrder<T>;
    },
    manager?: EntityManager,
  ): Promise<T | null> {
    return handle(
      async () => {
        const repo = manager ? manager.getRepository<T>(this.repo.target) : this.repo;

        const findOptions: FindOneOptions<T> = {
          where,
          relations: options?.relations,
          select: options?.select,
          order: options?.order,
        };

        return repo.findOne(findOptions);
      },
      this.errorResponse,
      this.logger,
    );
  }

  async create(data: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    return handle(
      async () => {
        const repo = manager ? manager.getRepository<T>(this.repo.target) : this.repo;
        const entity = repo.create(data);
        return repo.save(entity);
      },
      this.errorResponse,
      this.logger,
    );
  }

  async createMany(data: DeepPartial<T>[], manager?: EntityManager): Promise<T[]> {
    return handle(
      async () => {
        const repo = manager ? manager.getRepository<T>(this.repo.target) : this.repo;
        const entities = repo.create(data);
        return repo.save(entities);
      },
      this.errorResponse,
      this.logger,
    );
  }

  async update(
    query: FindOptionsWhere<T>,
    data: DeepPartial<T>,
    manager?: EntityManager,
  ): Promise<T | null> {
    return handle(
      async () => {
        const repo = manager ? manager.getRepository<T>(this.repo.target) : this.repo;
        const entity = await repo.findOne({ where: query });
        if (!entity) return null;
        return repo.save(repo.merge(entity, data));
      },
      this.errorResponse,
      this.logger,
    );
  }

  async updateMany(
    query: { [P in keyof T]?: T[P] | FindOperator<T[P]> },
    data: DeepPartial<T>,
    manager?: EntityManager,
  ): Promise<T[]> {
    return handle(
      async () => {
        const repo = manager ? manager.getRepository<T>(this.repo.target) : this.repo;

        const entities = await repo.find({
          where: query as FindOptionsWhere<T>,
        });

        if (!entities.length) return [];

        const updatedEntities = entities.map((entity) => repo.merge(entity, data));

        await repo.save(updatedEntities);

        return updatedEntities;
      },
      this.errorResponse,
      this.logger,
    );
  }

  async remove(query: Partial<T>, manager?: EntityManager): Promise<T | null> {
    return handle(
      async () => {
        const repo = manager ? manager.getRepository<T>(this.repo.target) : this.repo;
        const entity = await repo.findOne({ where: query });
        if (!entity) return null;
        await repo.delete(query);
        return entity;
      },
      this.errorResponse,
      this.logger,
    );
  }

  async removeMany(
    query: { [P in keyof T]?: T[P] | FindOperator<T[P]> },
    manager?: EntityManager,
  ): Promise<T[]> {
    return handle(
      async () => {
        const repo = manager ? manager.getRepository<T>(this.repo.target) : this.repo;

        const entities = await repo.find({ where: query as FindOptionsWhere<T> });
        if (!entities.length) return [];

        await repo.delete(query as FindOptionsWhere<T>);
        return entities;
      },
      this.errorResponse,
      this.logger,
    );
  }

  private buildListQuery(params: PaginatedListParams<T> & { paginate?: boolean }) {
    const {
      q,
      searchBy,
      query,
      sortBy,
      relations,
      select,
      page = 1,
      limit = 10,
      paginate = false,
    } = params;

    const qb = this.createQueryBuilder(this.alias);
    const joinedAliases: Record<string, string> = {};

    /* JOIN RELATIONS */
    const joinRelations = (rels: FindOptionsRelations<unknown>, parent = this.alias): void => {
      for (const [key, value] of Object.entries(rels)) {
        const path = `${parent}.${key}`;
        const alias = `${parent}_${key}_${Object.keys(joinedAliases).length}`;

        if (
          joinedAliases[path] ||
          qb.expressionMap.joinAttributes.some(
            (j) => j.alias?.name === alias || j.relation?.propertyPath === path,
          )
        )
          continue;

        qb.leftJoinAndSelect(path, alias);
        joinedAliases[path] = alias;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          joinRelations(value as FindOptionsRelations<unknown>, alias);
        }
      }
    };

    if (relations) joinRelations(relations);

    /* WHERE CLAUSES */
    const applyConditions = (obj: Record<string, unknown>, parentAlias = this.alias): void => {
      for (const [key, value] of Object.entries(obj)) {
        // Check if the value is an object (but not an array), for dynamic range filtering
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          // Check if the value is a RangeCondition (has properties like $gte, $lte, etc.)
          if (
            '$gte' in value ||
            '$lte' in value ||
            '$gt' in value ||
            '$lt' in value ||
            '$eq' in value
          ) {
            const rangeValue = value as RangeCondition;
            const column = `${parentAlias}.${key}`;
            const paramKey = `${parentAlias.replace(/\./g, '_')}_${key}`;

            // Dynamically apply filters for the range operators
            if (rangeValue.$gte !== undefined) {
              const sanitizedParamKey = paramKey.replace(/[${}]/g, '_');
              qb.andWhere(`${column} >= :${sanitizedParamKey}_gte`, {
                [`${sanitizedParamKey}_gte`]: rangeValue.$gte,
              });
            }
            if (rangeValue.$lte !== undefined) {
              const sanitizedParamKey = paramKey.replace(/[${}]/g, '_');
              qb.andWhere(`${column} <= :${sanitizedParamKey}_lte`, {
                [`${sanitizedParamKey}_lte`]: rangeValue.$lte,
              });
            }
            if (rangeValue.$gt !== undefined) {
              const sanitizedParamKey = paramKey.replace(/[${}]/g, '_');
              qb.andWhere(`${column} > :${sanitizedParamKey}_gt`, {
                [`${sanitizedParamKey}_gt`]: rangeValue.$gt,
              });
            }
            if (rangeValue.$lt !== undefined) {
              const sanitizedParamKey = paramKey.replace(/[${}]/g, '_');
              qb.andWhere(`${column} < :${sanitizedParamKey}_lt`, {
                [`${sanitizedParamKey}_lt`]: rangeValue.$lt,
              });
            }
            if (rangeValue.$eq !== undefined) {
              const sanitizedParamKey = paramKey.replace(/[${}]/g, '_');
              qb.andWhere(`${column} = :${sanitizedParamKey}_eq`, {
                [`${sanitizedParamKey}_eq`]: rangeValue.$eq,
              });
            }
          } else {
            // If the value is an object but not a range condition, recurse into it (for handling relations)
            const relationPath = `${parentAlias}.${key}`;
            const relationAlias =
              joinedAliases[relationPath] ||
              `${parentAlias}_${key}_${Object.keys(joinedAliases).length}`;
            applyConditions(value as Record<string, unknown>, relationAlias);
          }
        } else if (value !== undefined) {
          // Handle simple equality condition if value is not an object
          const column = `${parentAlias}.${key}`;
          const paramKey = `${parentAlias.replace(/\./g, '_')}_${key}`;
          qb.andWhere(`${column} = :${paramKey}`, {
            [paramKey]: value as string | number | boolean | Date,
          });
        }
      }
    };

    if (query) applyConditions(query);

    /* SELECT */
    if (select) {
      const columns = Object.keys(select).map((key) => `${this.alias}.${key}`);
      qb.select(columns);
    }

    /* SEARCH */
    if (q && searchBy?.length) {
      const dbType = this.dataSource.options.type;
      const likeOperator = dbType === 'postgres' ? 'ILIKE' : 'LIKE';

      searchBy.forEach((rawField, index) => {
        const field = String(rawField);
        const param = `search${index}`;
        let condition: string;

        if (field.includes('.')) {
          const path = field.split('.');
          const relationPath = `${this.alias}.${path.slice(0, -1).join('.')}`;
          const column = path[path.length - 1];
          const relationAlias =
            joinedAliases[relationPath] ||
            `${this.alias}_${path[path.length - 2]}_${Object.keys(joinedAliases).length}`;
          condition = `${relationAlias}.${column} ${likeOperator} :${param}`;
        } else {
          condition = `${this.alias}.${field} ${likeOperator} :${param}`;
        }

        if (index === 0) qb.andWhere(`(${condition}`);
        else qb.orWhere(condition);

        qb.setParameter(param, `%${q}%`);
      });
      qb.andWhere('1=1)');
    }

    /* SORTING */
    if (sortBy?.length) {
      sortBy.forEach((s) => {
        const order = s.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const field = String(s.whom);

        if (field.includes('.')) {
          const [relation, column] = field.split('.');
          const relationPath = `${this.alias}.${relation}`;
          const relationAlias =
            joinedAliases[relationPath] ||
            `${this.alias}_${relation}_${Object.keys(joinedAliases).length}`;
          if (
            !qb.expressionMap.joinAttributes.some(
              (j) => j.alias?.name === relationAlias || j.relation?.propertyPath === relationPath,
            )
          ) {
            qb.leftJoin(`${this.alias}.${relation}`, relationAlias);
          }
          qb.addOrderBy(`${relationAlias}.${column}`, order);
        } else {
          qb.addOrderBy(`${this.alias}.${field}`, order);
        }
      });
    } else {
      qb.addOrderBy(`${this.alias}.id`, 'DESC');
    }

    if (paginate) qb.skip((page - 1) * limit).take(limit);

    return { qb, page, limit, paginate };
  }

  async list(params: ListParams<T> = {}): Promise<ListResult<T>> {
    return handle(
      async () => {
        const { qb } = this.buildListQuery({ ...params, paginate: false });
        const items = await qb.getMany();
        return { items };
      },
      this.errorResponse,
      this.logger,
    );
  }

  async paginatedList(params: PaginatedListParams<T> = {}): Promise<PaginatedResult<T>> {
    return handle(
      async () => {
        const { qb, page, limit } = this.buildListQuery({ ...params, paginate: true });
        const [items, total] = await qb.getManyAndCount();
        return {
          items,
          meta: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
          },
        };
      },
      this.errorResponse,
      this.logger,
    );
  }

  async rawQuery<R = any>(
    query: string,
    parameters: any[] = [],
    manager?: EntityManager,
  ): Promise<R[]> {
    return handle(
      async () => {
        const repo = manager ? manager.getRepository<T>(this.repo.target) : this.repo;

        const result: unknown = await repo.query(query, parameters);
        return result as R[];
      },
      this.errorResponse,
      this.logger,
    );
  }
}
