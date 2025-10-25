import { HTTP_STATUS } from '@/common/constants';
import { SwaggerApiSuccessResponse } from '@/common/decorators';
import { HttpMethod, ModuleName } from '@/common/enums';
import { InternalServerErrorResponse, NotFoundResponse } from '@/common/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

export function RemoveProjectSwaggerDocs() {
  const path = `${ModuleName.Project}/{id}`;
  const method = HttpMethod.DELETE;

  return applyDecorators(
    ApiOperation({
      summary: 'Delete an project',
      description: 'Deletes an project by its ID.',
    }),

    ApiParam({
      name: 'id',
      description: 'ID of the project to delete',
      required: true,
      example: 1,
    }),

    SwaggerApiSuccessResponse(null, {
      method,
      status: HTTP_STATUS.NO_CONTENT.context,
      statusCode: HTTP_STATUS.NO_CONTENT.status,
      path,
      message: 'Project removed successful',
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
