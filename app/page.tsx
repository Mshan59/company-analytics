import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProjectList from "@/components/Projects/ProjectList";

export const metadata: Metadata = {
  title:
    "feature flow",
  description: "",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <ProjectList  />
      </DefaultLayout>
    </>
  );
}
