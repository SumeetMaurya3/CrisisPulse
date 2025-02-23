import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  CloudIcon,
  RectangleStackIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Chat from "./pages/dashboard/Chat";
import FileBox from "./pages/dashboard/Prediction";
import Fil from "./pages/dashboard/damageassessment";
import TweetCard from "./widgets/common/Tweet";
import Allocation from "./pages/dashboard/Allocation";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <CloudIcon {...icon} />,
        name: "Predict Weather",
        path: "/Predictweather",
        element: <Notifications />,
      },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      {
        icon: <UserCircleIcon {...icon} />,
        name: " Reinforce Structures",
        path: "/reinforce",
        element: <FileBox />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Damage Assessment",
        path: "/DamageAssessment",
        element: <Fil />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Allocation",
        path: "/allocation",
        element: <Allocation />,
      },
      {
        icon: <ChatBubbleBottomCenterIcon {...icon} />,
        name: "Chat",
        path: "/chat",
        element: <Chat/>,
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tables",
      //   path: "/tables",
      //   element: <Tables />,
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "News",
        path: "/news",
        element: <TweetCard />,
      },
      
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
