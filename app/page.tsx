import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RoleBasedDashboard from "@/components/Dashboard/RoleBasedDashboard";

export const metadata: Metadata = {
  title:
    "feature flow",
  description: "",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <RoleBasedDashboard />
      </DefaultLayout>
    </>
  );
}
