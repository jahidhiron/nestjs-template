import { HTTP_STATUS } from '@/common/constants';
import { SwaggerApiSuccessResponse } from '@/common/decorators';
import { HttpMethod, ModuleName } from '@/common/enums';
import { InternalServerErrorResponse } from '@/common/swagger';
import { ProjectListResponseDto } from '@/modules/projects/dtos';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function ProjectListSwaggerDocs() {
  const path = ModuleName.Project;
  const method = HttpMethod.GET;

  return applyDecorators(
    ApiOperation({
      summary: 'Get list of projects',
      description:
        'Retrieves a paginated list of projects. Supports pagination, search, and sorting.',
    }),

    SwaggerApiSuccessResponse(
      ProjectListResponseDto,
      {
        method,
        status: HTTP_STATUS.OK.context,
        statusCode: HTTP_STATUS.OK.status,
        path,
        message: 'Project list retrieved successful',
      },
      true,
    ),

    InternalServerErrorResponse({
      path,
      method,
    }),
  );
}
