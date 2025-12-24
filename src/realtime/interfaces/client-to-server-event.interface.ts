import { GetProfilePayload } from '@/realtime/gateways/interfaces';
import { ClientProfile } from '@/realtime/interfaces/client-profile.interface';

export interface ClientToServerEvents {
  connect_ack: (data: ClientProfile) => void;
  get_profile: (data: GetProfilePayload) => void;
}
