import dynamic from "next/dynamic";
import { DashboardHomeSkeleton } from "./components/dashboard-home-skeleton";

const DashboardHome = dynamic(
  () =>
    import("./components/dashboard-home").then((module) => module.DashboardHome),
  {
    loading: () => <DashboardHomeSkeleton />,
  },
);

export default function DashboardPage() {
  return <DashboardHome />;
}
