import { HTTP_STATUS } from '@/common/constants';
import { SwaggerApiSuccessResponse } from '@/common/decorators';
import { HttpMethod, ModuleName } from '@/common/enums';
import { BadRequestResponse, InternalServerErrorResponse } from '@/common/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateCompleteProjectDto } from '../dtos';

export function CreateCompletedProjectSwaggerDocs() {
  const path = `${ModuleName.Project}/completed`;
  const method = HttpMethod.POST;

  return applyDecorators(
    ApiOperation({
      summary: 'Create a new completed project',
      description:
        'This endpoint allows creating a new project with title, and optional bio, tasks.',
    }),

    ApiBody({ type: CreateCompleteProjectDto }),

    SwaggerApiSuccessResponse(CreateCompleteProjectDto, {
      method,
      status: HTTP_STATUS.CREATED.context,
      statusCode: HTTP_STATUS.CREATED.status,
      path,
      message: 'Complete project created successful',
    }),

    BadRequestResponse({
      path,
      method,
      examples: {
        validationError: {
          summary: 'Validation Error',
          message: 'Validation Error',
          errors: [
            { field: 'title', message: 'Title should not be empty' },
            { field: 'title', message: 'Title must be a string' },
            { field: 'tasks', message: 'Task titles must be unique' },
          ],
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
