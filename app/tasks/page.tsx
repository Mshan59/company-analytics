import DefaultLayout from '@/components/Layouts/DefaultLayout'
import TaskManager from '@/components/Tasks/TaskManager'
import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <div>
      <DefaultLayout>
        <TaskManager />
      </DefaultLayout>
    </div>
  )
}

export default Page