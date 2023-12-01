import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center  min-h-screen bg-gray-100">
      <div className="flex flex-row items-center justify-around w-full px-10 mt-[50px] mb-[50px]">
        <Link href="/Register">
          <div className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 px-4 rounded-full">
            Want to try the Sign up?
          </div>
        </Link>
        <Link href="/dashboard">
          <div className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 px-4 rounded-full">
            Check the Dashboard?
          </div>
        </Link>
        <Link href="/Login">
          <div className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 px-4 rounded-full">
            Or prefer to Login? c:
          </div>
        </Link>
      </div>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-orange-600 text-center mb-10">
            Discover the Website!
          </h1>
          <div className="text-center text-orange-500 text-4xl mb-8">CIAO!</div>
          <div className="bg-orange-100 rounded-lg p-8 shadow-lg space-y-6">
            <div className="text-orange-500 font-semibold text-2xl mb-4">
              Website Overview:
            </div>
            <div className="text-orange-400 text-xl">
              There are four primary sections: Home, Login, Register, and
              Dashboard.
            </div>
            <div className="text-gray-700 text-lg">
              Home provides an introduction to the site. Login and Register are
              straightforward. The Dashboard is the heart of the platform, with
              features like the Watchlist for stock tracking and MyCompetition
              for participating in trading contests. The Leaderboard showcases
              user rankings.
            </div>
            <div className="text-gray-700 text-lg">
              Registration is simple via Google, GitHub, or email. Once inside,
              the Dashboard awaits with a Watchlist that uses FinnHub API for
              real-time stock data. Note: rapid refreshing may lead to a
              temporary rate limit due to API constraints.
            </div>
            <div className="text-gray-700 text-lg">
              The competition aspect is simplified for user-friendliness.
              Performance is measured by the percentage change of selected
              stocks, distributed evenly across three choices. Competitions open
              and close daily at specified times, managed by cron jobs that
              trigger the necessary API calls.
            </div>
            <div className="text-gray-700 text-lg">
              As competitions conclude, rankings are determined, points awarded,
              and the Leaderboard updated. There may be a short delay before
              stock data becomes visible due to the same rate limits mentioned
              earlier.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//       <div className="flex flex-col items-center justify-center text-orange-500 text-3xl mb-4">
//         CIAO!
//         <div className="flex items-center justify-center text-orange-300 text-1xl mt-1">
//           How the website is organized:
//         </div>
//         <div className="flex items-center justify-center text-orange-300 text-1xl mt-1">
//           There are 4 main pages: Home, Login, Register, and Dashboard.
//         </div>
//         <div className="flex items-center justify-center text-orange-300 text-1xl mt-1">
//           The homepage &#40; this &#41; that is just to explain the how the
//           website works.
//         </div>
//         <div className="flex items-center justify-center text-orange-300 text-1xl mt-1">
//           Login and Register page are pretty self-explanatory.
//         </div>
//         <div className="flex items-center justify-center text-orange-300 text-1xl w-[1500px] mt-1">
//           Dashboard that is the core of the website, is divided into 3 &#40; +1
//           sadly not implemented, now &#41; subparts, the whatchlist where the
//           user can select and remove stocks to monitor, provide real-time data
//           of the stocks selected. Then there is the MyCompetition page, where
//           the users can participate in currently ongoing competition by simply
//           clicking on the button and selecting the 3 stocks that he/she wants
//           use to win the competition. below currently active competition the
//           users can scroll and see the past competitions. Then there is the
//           Leaderbord page, where the users can see the ranking of the users.
//         </div>
//         <div className="flex items-center justify-center text-orange-300 text-1xl w-[1500px] mt-1">
//           How the website works:
//         </div>
//         <div className="flex items-center justify-center text-orange-300 text-1xl w-[1500px] mt-1"></div>
//         users can obviously register and login either using google or github or
//         simply by providing an email and a password. Once logged in the user can
//         check the dashboard and add stocks to the watchlist. The whatchlist
//         makes real-time calls with the FinnHub API to retrieve real-time data
//         &#40; unfortunately due to free tier limitation, if the user keeps
//         refreshing quickly it can get a rate limit and have to wait like 30
//         seconds before getting back the data. Plus many of the stocks are not
//         available to a pop-up will appear to block a invalid selection &#41;
//         Users can then participate in ongoing competition, i had to make some
//         sismplifications because it was already hard enough like that, for
//         example it doesn't make a huge difference to have 100.000$ to allocate
//         if there is a max allocation. Simply the performance are based on the
//         overall percentage change of the stocks selected as the amount is evenly
//         spread across the 3 stocks. The competition start and end each day at
//         00:00-00:10 &#40;CST&#41;. To open the competition and close them i
//         set-up cron jobs that send request to my API each time at said time.
//         when the competiton closes rankings are calculated, points assigned and
//         Leaderbord updated. for the same reason explained in the watchlist it's
//         possible that data of the stocks selected might not be immediately
//         visible.
//       </div>

//       {/* Removed the Image component */}
//     </div>
//   );
// }
