import { GetProfilePayload } from '@/realtime/gateways/interfaces';
import { AckPayload } from '@/realtime/interfaces/client-profile.interface';

export interface ClientToServerEvents {
  connect_ack: (data: AckPayload) => void;
  get_profile: (data: GetProfilePayload) => void;
}
