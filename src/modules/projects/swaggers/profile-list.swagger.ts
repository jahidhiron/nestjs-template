import { HTTP_STATUS } from '@/common/constants';
import { SwaggerApiSuccessResponse } from '@/common/decorators';
import { HttpMethod, ModuleName } from '@/common/enums';
import { InternalServerErrorResponse } from '@/common/swagger';
import { ProfileListResponseDto } from '@/modules/projects/dtos';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function ProfileListSwaggerDocs() {
  const path = `${ModuleName.Project}/profiles`;
  const method = HttpMethod.GET;

  return applyDecorators(
    ApiOperation({
      summary: 'Get list of profiles',
      description:
        'Retrieves a paginated list of profiles. Supports pagination, search, and sorting.',
    }),

    SwaggerApiSuccessResponse(
      ProfileListResponseDto,
      {
        method,
        status: HTTP_STATUS.OK.context,
        statusCode: HTTP_STATUS.OK.status,
        path,
        message: 'Profile list retrieved successful',
      },
      true,
    ),

    InternalServerErrorResponse({
      path,
      method,
    }),
  );
}
