import ProjectList from '@/components/Projects/ProjectList'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <DefaultLayout>
      <ProjectList />
    </DefaultLayout>
  )
}

export default Page