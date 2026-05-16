import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import RouterPrivate from "./routerConfig/RouterPrivate";
import LeaderProtectedRouter from "./routerConfig/LeaderProtectedRouter";
import AdminProtectedRouter from "./routerConfig/AdminProtectedRouter";
import AccountManage from "./pages/Admin/AccountManage";
import CreateCampaign from "./pages/Leader/CreateCampaign";
import CampaignManage from "./pages/Admin/CampaignsAdmin";
import ManageCampaignLeader from "./pages/Leader/ManageCampaign";
import EmployeeProtectedRouter from "./routerConfig/EmployeeProtectedRouter";
import ManageTask from "./pages/Leader/ManageTask";
import CalendarEmployee from "./pages/Employee/CalendarEmployee";
import ManageCampaignEmployee from "./pages/Employee/CampaignEmployee";
import AIChatScreen from "./pages/ChatBot";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />

          <Route
            path="/signin"
            element={
              <RouterPrivate>
                <SignIn />
              </RouterPrivate>
            }
          />
          <Route
            path="/leader"
            element={
              <LeaderProtectedRouter>
                <AppLayout role="LEADER" />
              </LeaderProtectedRouter>
            }
          >
            <Route index element={<Home />} />

            {/* Others Page */}
            <Route path="profile" element={<UserProfiles />} />

            <Route path="blank" element={<Blank />} />

            <Route path="manage-tasks/:idCampaign" element={<ManageTask />} />

            {/* Tables */}
            <Route path="basic-tables" element={<BasicTables />} />

            {/* Create Campaign */}
            <Route path="create-campaign" element={<CreateCampaign />} />

            <Route path="list-campaign" element={<ManageCampaignLeader />} />

            <Route path="prompt" element={<AIChatScreen />} />

            {/* Charts */}
            {/* <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>

          <Route
            path="/admin"
            element={
              <AdminProtectedRouter>
                <AppLayout role="ADMIN" />
              </AdminProtectedRouter>
            }
          >
            <Route index element={<Home />} />

            {/* Others Page */}
            <Route path="profile" element={<UserProfiles />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="blank" element={<Blank />} />

            <Route path="accounts" element={<AccountManage />} />

            {/* Tables */}
            <Route path="basic-tables" element={<BasicTables />} />

            {/* Campaigns */}
            <Route
              path="campaigns-waiting"
              element={<CampaignManage key={"WAITING"} type="WAITING" />}
            />
            <Route
              path="campaigns-completed"
              element={<CampaignManage key={"COMPLETED"} type="COMPLETED" />}
            />
            <Route
              path="campaigns-in-progress"
              element={<CampaignManage key={"INPROGRESS"} type="INPROGRESS" />}
            />
            <Route
              path="campaigns-cancel"
              element={<CampaignManage key={"CANCELED"} type="CANCELED" />}
            />

            {/* Ui Elements */}
            <Route path="alerts" element={<Alerts />} />
            <Route path="avatars" element={<Avatars />} />
            <Route path="badge" element={<Badges />} />
            <Route path="buttons" element={<Buttons />} />
            <Route path="images" element={<Images />} />
            <Route path="videos" element={<Videos />} />

            {/* Charts */}
            {/* <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>
          <Route
            path="/employee"
            element={
              <EmployeeProtectedRouter>
                <AppLayout role="EMPLOYEE" />
              </EmployeeProtectedRouter>
            }
          >
            <Route index element={<CalendarEmployee />} />
            {/* Others Page */}
            <Route path="profile" element={<UserProfiles />} />

            <Route
              path="employee-campaigns"
              element={<ManageCampaignEmployee />}
            />

            <Route path="prompt" element={<AIChatScreen />} />

            <Route path="manage-tasks/:idCampaign" element={<ManageTask />} />

            {/* Tables */}
            <Route path="basic-tables" element={<BasicTables />} />

            <Route path="list-campaign" element={<ManageCampaignLeader />} />
          </Route>

          {/* Auth Layout */}

          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
