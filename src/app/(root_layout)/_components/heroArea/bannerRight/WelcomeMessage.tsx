"use client";
const WelcomeMessage = () => {
  const hour = new Date().getHours();
  return (
    <span className="card-bg px-4 py-2 bg-primary rounded-full shadow-md select-none cursor-pointer">
      {hour > 4 && hour < 13
        ? `🌄 Good Morning`
        : hour >= 13 && hour < 19
          ? `🌤️ Good Afternoon`
          : (hour >= 19 && hour <= 24) || (hour >= 1 && hour <= 4)
            ? `🌚 Good Evening`
            : "Some thing went wrong"}
    </span>
  );
};

export default WelcomeMessage;
