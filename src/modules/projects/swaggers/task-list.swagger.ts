import { HTTP_STATUS } from '@/common/constants';
import { SwaggerApiSuccessResponse } from '@/common/decorators';
import { HttpMethod, ModuleName } from '@/common/enums';
import { InternalServerErrorResponse } from '@/common/swagger';
import { TaskListResponseDto } from '@/modules/projects/dtos';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function TaskListSwaggerDocs() {
  const path = `${ModuleName.Project}/tasks`;
  const method = HttpMethod.GET;

  return applyDecorators(
    ApiOperation({
      summary: 'Get list of tasks',
      description: 'Retrieves a paginated list of tasks. Supports pagination, search, and sorting.',
    }),

    SwaggerApiSuccessResponse(
      TaskListResponseDto,
      {
        method,
        status: HTTP_STATUS.OK.context,
        statusCode: HTTP_STATUS.OK.status,
        path,
        message: 'Task list retrieved successful',
      },
      true,
    ),

    InternalServerErrorResponse({
      path,
      method,
    }),
  );
}
