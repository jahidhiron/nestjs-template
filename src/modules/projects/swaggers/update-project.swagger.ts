import { HTTP_STATUS } from '@/common/constants';
import { SwaggerApiSuccessResponse } from '@/common/decorators';
import { HttpMethod, ModuleName } from '@/common/enums';
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
} from '@/common/swagger';
import { ProjectResponseDto, UpdateProjectDto } from '@/modules/projects/dtos';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

export function UpdateProjectSwaggerDocs() {
  const path = `${ModuleName.Project}/{id}`;
  const method = HttpMethod.PATCH;

  return applyDecorators(
    ApiOperation({
      summary: 'Update an existing project',
      description: 'This endpoint allows updating an project by ID. You can update title.',
    }),

    ApiBody({ type: UpdateProjectDto }),

    SwaggerApiSuccessResponse(ProjectResponseDto, {
      method,
      status: HTTP_STATUS.OK.context,
      statusCode: HTTP_STATUS.OK.status,
      path,
      message: 'Project updated successful',
    }),

    BadRequestResponse({
      path,
      method,
      message: 'Project title already exist',
    }),

    NotFoundResponse({
      path,
      method,
      message: 'Project not found',
    }),

    InternalServerErrorResponse({
      path,
      method,
    }),
  );
}
