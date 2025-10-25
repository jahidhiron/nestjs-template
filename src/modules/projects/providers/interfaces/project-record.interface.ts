export interface ProjectRecord {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  profile: {
    id: number;
    bio: string;
    createdAt: string;
    updatedAt: string;
  };
  totalTasks: number;
}
