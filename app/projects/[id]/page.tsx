import ProjectDashboard from '@/components/Projects/ProjectDashboard';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { NextPage } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

const ProjectDashboardPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const projectId = parseInt(id);

  return (
    <DefaultLayout>
      <ProjectDashboard projectId={projectId} />
    </DefaultLayout>
  );
};

export default ProjectDashboardPage;
