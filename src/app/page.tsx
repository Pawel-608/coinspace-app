'use client';

import Actions from "@/components/Actions";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";


export default function LaunchParamsPage() {
//   const lp = useLaunchParams();
    
//     useEffect(
//         () => {
//             console.log(
//                 [
//                     { title: 'tgWebAppPlatform', value: lp.platform },
//                     { title: 'tgWebAppShowSettings', value: lp.showSettings },
//                     { title: 'tgWebAppVersion', value: lp.version },
//                     { title: 'tgWebAppBotInline', value: lp.botInline },
//                     { title: 'tgWebAppStartParam', value: lp.startParam },
//                     { title: 'tgWebAppData', type: 'link', value: '/init-data' },
//                     { title: 'tgWebAppThemeParams', type: 'link', value: '/theme-params' }
//                 ]
//                 )
//         }
//     )
    
  return (
    <div className="w-100 pt-10 flex flex-col gap-10">
        <Balance />
        <Actions />
        <Transactions />
    </div>
  );
};