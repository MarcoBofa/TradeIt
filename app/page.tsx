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
          <div className="text-center text-orange-500 text-4xl mb-8">CIAO!</div>
          <h1 className="text-5xl font-bold text-orange-600 text-center mb-10">
            Discover the Website!
          </h1>

          <div className="bg-orange-100 rounded-lg p-8 shadow-lg space-y-6">
            <div className="text-orange-500 font-semibold text-2xl mb-4">
              Website Overview:
            </div>
            <div className="text-orange-400 text-xl">
              There are four primary sections:{" "}
              <Link className=" hover:text-orange-700 hover:underline" href="/">
                Home
              </Link>
              ,{" "}
              <Link
                className=" hover:text-orange-700 hover:underline"
                href="/Login"
              >
                Login
              </Link>
              ,{" "}
              <Link
                className=" hover:text-orange-700 hover:underline"
                href="/Register"
              >
                Register
              </Link>
              , and{" "}
              <Link
                className=" hover:text-orange-700 hover:underline"
                href="/dashboard"
              >
                Dashboard
              </Link>
              .
            </div>
            <div className="text-gray-700 text-lg">
              The homepage &#40; this &#41; just to explain the how the website
              works. Login and Register page are pretty self-explanatory.
            </div>
            <div className="text-gray-700 text-lg">
              Dashboard is the core of the website, is divided into 3 &#40; +1
              sadly not implemented, now &#41; subparts, the{" "}
              <span className="text-orange-400">whatchlist</span> where the user
              can select and remove stocks to monitor, provide real-time data of
              the stocks selected.{" "}
              <span className="text-orange-400">MyCompetition</span>, where the
              users can participate in currently ongoing competition by simply
              clicking on the button and selecting the 3 stocks that he/she
              wants use to win the competition. Below currently active
              competition the users can scroll and see the past competitions.
              Lastly there is the{" "}
              <span className="text-orange-400">Leaderbord</span>, where ranking
              of the users can be seen.
            </div>
            <div className="text-gray-700 text-lg"></div>
            <div className="text-gray-700 text-lg"></div>
            <div className="text-orange-400 text-2xl">
              <strong>How the website works:</strong>
            </div>

            <div className="text-gray-700 text-lg">
              Users can <span className="text-orange-400">register</span> and{" "}
              <span className="text-orange-400">login</span> either using google
              or github or simply by providing an email and a password. Once
              logged in the user can check the dashboard.
            </div>
            <div className="text-gray-700 text-lg">
              The <span className="text-orange-400">watchlist</span> makes
              request to the FinnHub API to retrieve real-time data &#40;
              unfortunately due to free tier limitation, if the user keeps
              refreshing quickly it can get a rate limit and have to wait like
              30 seconds before getting back the data. Plus many of the stocks
              are not available for detailed data retrieval. So to avoid errors
              a pop-up will appear to block a invalid selections &#41;
            </div>
            <div className="text-gray-700 text-lg">
              Users can then participate in{" "}
              <span className="text-orange-400">trading competition</span>, i
              had to make some simplifications because it was already hard
              enough to be done like it is now. For instance, having $100,000 to
              allocate does not make a significant difference if there's a
              maximum limit per stock. Therefore, performance is calculated
              based on the overall percentage change of the selected stocks,
              with the investment amount simulating being evenly distributed
              across three stocks. The competition end and start each day at
              4:00pm-4:10pm &#40;CST&#41;, besides the weekend that the market
              is closed. I changed the weekly timing to make it easier to test
              functionalities. To open and close competitions i set-up cron jobs
              that send request to my API every day at said time. when the
              competiton closes rankings are calculated, points assigned and
              Leaderbord updated. for the same reason explained in the watchlist
              it's possible that data of the stocks selected might not be
              immediately visible in the competition summaries.
            </div>
            <div className="text-gray-700 text-lg">
              In the <span className="text-orange-400">Leaderboard</span> is
              possible to see personal points and the ranking of the users.
            </div>
            <div className="text-gray-700 text-lg">
              The recover password is not implemented :c, but it shows a nice
              pop-up!
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
//         check the dashboard and add stocks to the watchlist.
//          The whatchlist makes real-time calls with the FinnHub API to retrieve real-time data
//         &#40; unfortunately due to free tier limitation, if the user keeps
//         refreshing quickly it can get a rate limit and have to wait like 30
//         seconds before getting back the data. Plus many of the stocks are not
//         available to a pop-up will appear to block a invalid selection &#41;

//       </div>

//       {/* Removed the Image component */}
//     </div>
//   );
// }
