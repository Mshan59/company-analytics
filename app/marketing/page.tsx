import MinimalComingSoon from '@/components/comingsoon'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { NextPage } from 'next'
const Page: NextPage = () => {
  return <div>
   <DefaultLayout>
     <MinimalComingSoon />
    </DefaultLayout>
  </div>
}

export default Page