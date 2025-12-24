import { ModuleName } from '@/common/enums';
import { Serialize } from '@/common/interceptors';
import {
  CreateCompleteProjectDto,
  CreateProjectDto,
  DetailProjectResponseDto,
  ProfileListQueryDto,
  ProfileListResponseDto,
  ProjectListQueryDto,
  ProjectListResponseDto,
  ProjectResponseDto,
  TaskListQueryDto,
  TaskListResponseDto,
  UpdateProjectDto,
} from '@/modules/projects/dtos';
import { SuccessResponse } from '@/shared/responses';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateCompletedProjectSwaggerDocs,
  CreateProjectSwaggerDocs,
  DetailProjectSwaggerDocs,
  ProfileListSwaggerDocs,
  ProjectListSwaggerDocs,
  RemoveProjectSwaggerDocs,
  TaskListSwaggerDocs,
  UpdateProjectSwaggerDocs,
} from './swaggers';

/**
 * Controller responsible for managing projects.
 *
 * Provides endpoints to create, update, delete, view details,
 * and list projects with pagination, sorting, and search.
 */
@Controller(ModuleName.Project)
export class ProjectController {
  constructor(
    private readonly successResponse: SuccessResponse,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * Creates a new project.
   *
   * @param dto - Data Transfer Object containing the project creation details.
   * @returns The created project object wrapped in a success response.
   */
  @Post()
  @Serialize(ProjectResponseDto)
  @CreateProjectSwaggerDocs()
  async create(@Body() dto: CreateProjectDto) {
    const result = await this.projectService.create(dto);
    return this.successResponse.created({
      module: ModuleName.Project,
      key: 'create-project',
      ...result,
    });
  }

  @Post('completed')
  @Serialize(DetailProjectResponseDto)
  @CreateCompletedProjectSwaggerDocs()
  async createCompletedProject(@Body() dto: CreateCompleteProjectDto) {
    const result = await this.projectService.createCompletedProject(dto);
    return this.successResponse.created({
      module: ModuleName.Project,
      key: 'create-complete-project',
      ...result,
    });
  }

  /**
   * Updates an existing project by ID.
   *
   * @param id - The ID of the project to update.
   * @param dto - Data Transfer Object containing the project update details.
   * @returns The updated project object wrapped in a success response.
   */
  @Patch(':id')
  @Serialize(ProjectResponseDto)
  @UpdateProjectSwaggerDocs()
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    const result = await this.projectService.update(id, dto);
    return this.successResponse.ok({
      module: ModuleName.Project,
      key: 'update-project',
      ...result,
    });
  }

  /**
   * Deletes a project by ID.
   *
   * @param id - The ID of the project to delete.
   * @returns A no-content success response if deletion is successful.
   */
  @Delete(':id')
  @RemoveProjectSwaggerDocs()
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.projectService.remove(id);
    return this.successResponse.noContent({ module: ModuleName.Project, key: 'remove-project' });
  }

  @Get('profiles')
  @Serialize(ProfileListResponseDto)
  @ProfileListSwaggerDocs()
  async profileList(@Query() dto: ProfileListQueryDto) {
    const result = await this.projectService.profileList(dto);
    return this.successResponse.ok({ module: ModuleName.Project, key: 'profile-list', ...result });
  }

  @Get('tasks')
  @Serialize(TaskListResponseDto)
  @TaskListSwaggerDocs()
  async taskList(@Query() dto: TaskListQueryDto) {
    const result = await this.projectService.taskList(dto);
    return this.successResponse.ok({ module: ModuleName.Project, key: 'task-list', ...result });
  }

  /**
   * Retrieves details of a single project by ID.
   *
   * @param id - The ID of the project to retrieve.
   * @returns The project details wrapped in a success response.
   */
  @Get(':id')
  @Serialize(DetailProjectResponseDto)
  @DetailProjectSwaggerDocs()
  async detail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.projectService.detail(id);
    return this.successResponse.ok({
      module: ModuleName.Project,
      key: 'detail-project',
      ...result,
    });
  }

  /**
   * Retrieves a paginated list of accounts.
   *
   * Supports optional pagination, sorting, and search query.
   *
   * @param query - Query parameters for pagination, sorting, and search.
   * @returns Paginated list of accounts wrapped in a success response.
   */
  @Get()
  @Serialize(ProjectListResponseDto)
  @ProjectListSwaggerDocs()
  async list(@Query() dto: ProjectListQueryDto) {
    const result = await this.projectService.list(dto);
    return this.successResponse.ok({ module: ModuleName.Project, key: 'project-list', ...result });
  }
}
