import { UpdateProfileDto } from '@/modules/projects/dtos';

export interface ServerToClientEvents {
  connect_ack: (data: { message: string; at: string }) => void;
  profile_update: (profile: UpdateProfileDto) => void;
}
