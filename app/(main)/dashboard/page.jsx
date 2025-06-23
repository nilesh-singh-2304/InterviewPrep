import React from "react";
import Features from "./_components/Features";
import History from "./_components/History";
import Feedback from "./_components/Feedback";

const Dashboard = () => {
  return (
    <div>
      <Features />

      <div className="flex w-screen justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="border border-gray-400 p-5 rounded-xl shadow-lg hover:shadow-xl transition ease-in">
            <History />
          </div>
          <div className="border border-gray-400 p-5 rounded-xl shadow-lg hover:shadow-xl transition ease-in">
            <Feedback />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
