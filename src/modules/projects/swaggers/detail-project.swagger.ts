import { HTTP_STATUS } from '@/common/constants';
import { SwaggerApiSuccessResponse } from '@/common/decorators';
import { HttpMethod, ModuleName } from '@/common/enums';
import { InternalServerErrorResponse, NotFoundResponse } from '@/common/swagger';
import { ProjectResponseDto } from '@/modules/projects/dtos';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

export function DetailProjectSwaggerDocs() {
  const path = `${ModuleName.Project}/{id}`;
  const method = HttpMethod.GET;

  return applyDecorators(
    ApiOperation({
      summary: 'Get project details',
      description: 'This endpoint retrieves details of a specific project by its ID.',
    }),

    ApiParam({
      name: 'id',
      description: 'ID of the project to retrieve',
      required: true,
      example: 1,
    }),

    SwaggerApiSuccessResponse(ProjectResponseDto, {
      method,
      status: HTTP_STATUS.OK.context,
      statusCode: HTTP_STATUS.OK.status,
      path,
      message: 'Project detail retrieved successful',
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
