import { ModuleName } from '@/common/enums';
import {
  CreateCompleteProjectDto,
  CreateProjectDto,
  ProfileListQueryDto,
  ProjectListQueryDto,
  TaskListQueryDto,
  UpdateProjectDto,
} from '@/modules/projects/dtos';
import { ProjectEntity } from '@/modules/projects/entities';
import {
  CreateCompleteProjectProvider,
  CreateProjectProvider,
  FindOneProjectProvider,
  ProfileListProvider,
  ProjectListProvider,
  RemoveProjectProvider,
  TaskListProvider,
  UpdateProjectProvider,
} from '@/modules/projects/providers';
import { ErrorResponse } from '@/shared/responses';
import { Injectable } from '@nestjs/common';

/**
 * Service handling project operations.
 * Delegates business logic to specialized providers.
 */
@Injectable()
export class ProjectService {
  /**
   * Initializes ProjectService with required providers.
   * @param createProject - Provider to create basic projects
   * @param createCompleteProject - Provider to create project with profile and tasks
   * @param updateProject - Provider to update projects
   * @param removeProject - Provider to remove projects
   * @param findOneProject - Provider to fetch single project
   * @param projectList - Provider for paginated project list
   * @param profileListPro - Provider for profile listing
   * @param taskListPro - Provider for task listing
   * @param errorResponse - Shared error handler
   */
  constructor(
    private readonly createProject: CreateProjectProvider,
    private readonly createCompleteProject: CreateCompleteProjectProvider,
    private readonly updateProject: UpdateProjectProvider,
    private readonly removeProject: RemoveProjectProvider,
    private readonly findOneProject: FindOneProjectProvider,
    private readonly projectList: ProjectListProvider,
    private readonly profileListPro: ProfileListProvider,
    private readonly taskListPro: TaskListProvider,
    private readonly errorResponse: ErrorResponse,
  ) {}

  /**
   * Creates a project.
   * @param dto - Project creation data
   * @returns Created project
   */
  async create(dto: CreateProjectDto) {
    const project = await this.createProject.execute(dto);
    return { project };
  }

  /**
   * Creates a project with profile and tasks.
   * @param dto - Complete project data
   * @returns Created project with relations
   */
  async createCompletedProject(dto: CreateCompleteProjectDto) {
    const project = await this.createCompleteProject.execute(dto);
    return { project };
  }

  /**
   * Updates a project by ID.
   * @param id - Project ID
   * @param dto - Update data
   * @returns Updated project
   */
  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.updateProject.execute(id, dto);
    return { project };
  }

  /**
   * Removes a project by ID.
   * @param id - Project ID
   * @returns Removed project
   */
  async remove(id: number) {
    const project = await this.removeProject.execute(id);
    return { project };
  }

  /**
   * Retrieves a single project by ID.
   * Throws error if not found.
   * @param id - Project ID
   * @returns Project with profile and tasks
   */
  async detail(id: number): Promise<{ project: ProjectEntity }> {
    const project = await this.findOneProject.execute(
      { id },
      { relations: { profile: true, tasks: true } },
    );

    if (!project) {
      return this.errorResponse.badRequest({
        module: ModuleName.Project,
        key: 'project-not-found',
      });
    }

    return { project };
  }

  /**
   * Retrieves paginated project list.
   * @param dto - List query params
   * @returns Paginated projects
   */
  list(dto: ProjectListQueryDto) {
    return this.projectList.execute(dto);
  }

  /**
   * Retrieves profile list.
   * @param dto - Profile query params
   * @returns Profiles
   */
  profileList(dto: ProfileListQueryDto) {
    return this.profileListPro.execute(dto);
  }

  /**
   * Retrieves task list.
   * @param dto - Task query params
   * @returns Tasks
   */
  taskList(dto: TaskListQueryDto) {
    return this.taskListPro.execute(dto);
  }
}
