import { HTTP_STATUS } from '@/common/constants';
import { SwaggerApiSuccessResponse } from '@/common/decorators';
import { HttpMethod, ModuleName } from '@/common/enums';
import { BadRequestResponse, InternalServerErrorResponse } from '@/common/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateProjectDto, ProjectResponseDto } from '../dtos';

export function CreateProjectSwaggerDocs() {
  const path = ModuleName.Project;
  const method = HttpMethod.POST;

  return applyDecorators(
    ApiOperation({
      summary: 'Create a new project',
      description: 'This endpoint allows creating a new project with title.',
    }),

    ApiBody({ type: CreateProjectDto }),

    SwaggerApiSuccessResponse(ProjectResponseDto, {
      method,
      status: HTTP_STATUS.CREATED.context,
      statusCode: HTTP_STATUS.CREATED.status,
      path,
      message: 'Project created successful',
    }),

    BadRequestResponse({
      path,
      method,
      examples: {
        validationError: {
          summary: 'Validation Error',
          message: 'Validation Error',
          errors: [{ field: 'title', message: 'Title should not be empty' }],
        },
        duplicateTitle: {
          summary: 'Duplicate Project Title',
          message: 'Project title already exist',
        },
      },
    }),

    InternalServerErrorResponse({
      path,
      method,
    }),
  );
}
