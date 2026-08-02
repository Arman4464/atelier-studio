import { Outlet } from "react-router-dom";
import AccountSidebar from "../../components/account/AccountSidebar";
import AccountMobileTabs from "../../components/account/AccountMobileTabs";

export default function AccountLayout() {
  return (
    <div className="mx-auto grid max-w-[1800px] grid-cols-1 lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-line lg:block">
        <div className="sticky top-[100px] h-[calc(100vh-100px)]">
          <AccountSidebar />
        </div>
      </aside>

      <div className="min-w-0">
        <AccountMobileTabs />
        <div className="px-5 py-10 md:px-10 md:py-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
