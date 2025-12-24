import { CreatePartialDto } from '@/common/utils';
import { CreateProjectDto } from '@/modules/projects/dtos/create-project.dto';

export class UpdateProjectDto extends CreatePartialDto(CreateProjectDto) {}
