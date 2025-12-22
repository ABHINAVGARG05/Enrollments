// Console commands registry
interface ConsoleFunctions {
  secretFox: () => void;
  foxDance: () => void;
  foxJoke: () => void;
  foxWisdom: () => void;
  foxQuiz: () => Promise<void>;
  foxRainbow: () => void;
  foxHelp: () => void;
  foxHack: () => void;
  mfcHistory: () => void;
  clearConsole: () => void;
}

declare global {
  interface Window extends ConsoleFunctions {}
}

export const initConsoleEasterEgg = () => {
  console.clear();

  const foxArt = `
%c
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                              ║
    ║      ███╗   ███╗ ██████╗ ███████╗██╗██╗     ██╗      █████╗    🦊            ║
    ║      ████╗ ████║██╔═══██╗╚══███╔╝██║██║     ██║     ██╔══██╗                 ║
    ║      ██╔████╔██║██║   ██║  ███╔╝ ██║██║     ██║     ███████║   🔥            ║
    ║      ██║╚██╔╝██║██║   ██║ ███╔╝  ██║██║     ██║     ██╔══██║                 ║
    ║      ██║ ╚═╝ ██║╚██████╔╝███████╗██║███████╗███████╗██║  ██║   🚀            ║
    ║      ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝╚══════╝╚══════╝╚═╝  ╚═╝                 ║
    ║                                                                              ║
    ║      ███████╗██╗██████╗ ███████╗███████╗ ██████╗ ██╗  ██╗                    ║
    ║      ██╔════╝██║██╔══██╗██╔════╝██╔════╝██╔═══██╗╚██╗██╔╝                    ║
    ║      █████╗  ██║██████╔╝█████╗  █████╗  ██║   ██║ ╚███╔╝                     ║
    ║      ██╔══╝  ██║██╔══██╗██╔══╝  ██╔══╝  ██║   ██║ ██╔██╗                     ║
    ║      ██║     ██║██║  ██║███████╗██║     ╚██████╔╝██╔╝ ██╗                    ║
    ║      ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝                    ║
    ║                                                                              ║
    ║                    🦊  CLUB RECRUITMENT PORTAL  🦊                           ║
    ║                         VIT CHENNAI CHAPTER                                  ║
    ║                                                                              ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
  `;

  const welcomeStyle = `
    color: #fc7a00;
    font-size: 7px;
    font-family: monospace;
    font-weight: bold;
    line-height: 1.1;
  `;

  console.log(foxArt, welcomeStyle);

  // Animated welcome message
  const welcomeText = "🎮 Welcome, curious developer! You've unlocked the SECRET CONSOLE! 🎮";
  console.log(
    `%c${welcomeText}`,
    `
      color: #fc7a00; 
      font-size: 18px; 
      font-weight: bold; 
      font-family: 'Press Start 2P', monospace;
      text-shadow: 0 0 10px #fc7a00, 0 0 20px #ff9500;
      padding: 10px;
    `
  );

  // Animated box
  console.log(
    `%c
    ╭────────────────────────────────────────────────────╮
    │  🕹️  KONAMI CODE: ↑ ↑ ↓ ↓ ← → ← → B A  🕹️         │
    │                                                    │
    │  Type it on the main page for EPIC surprises!     │
    ╰────────────────────────────────────────────────────╯
    `,
    "color: #ff6b6b; font-size: 11px; font-family: monospace; background: linear-gradient(90deg, #1a1a2e, #16213e); border-radius: 8px;"
  );

  // Stats table
  console.log("\n%c📊 ════════ FUN STATS ════════ 📊", "color: #fc7a00; font-size: 14px; font-weight: bold;");
  console.table({
    "Lines of Code": "10,000+ 💻",
    "Coffee Consumed": "∞ ☕",
    "Easter Eggs": "🤫 Find them all!",
    "Fox Fluffiness": "MAXIMUM 🦊",
    "Bugs Squashed": "Too many 🐛",
    "Sleep Sacrificed": "What is sleep? 😴",
  });

  // Warning section
  console.log(
    "\n%c⚠️ SECURITY NOTICE ⚠️",
    "color: #ff6b6b; font-size: 14px; font-weight: bold; background: #2a1a1a; padding: 4px 8px; border-radius: 4px;"
  );
  console.log(
    "%c┌─────────────────────────────────────────────────────────┐\n" +
    "│ Self-XSS Warning: Don't paste code from strangers here!│\n" +
    "│ This console is for developers only.                   │\n" +
    "└─────────────────────────────────────────────────────────┘",
    "color: #ff6b6b; font-size: 10px; font-family: monospace;"
  );

  // Social links
  console.log(
    "\n%c🔗 ════════ CONNECT WITH MFC ════════ 🔗",
    "color: #fc7a00; font-size: 14px; font-weight: bold;"
  );
  console.log("%c  🌐 Instagram: %c@mfcvit", "color: #aaa;", "color: #4ecdc4; font-weight: bold;");
  console.log("%c  🚀 Join the Firefox movement!", "color: #aaa;");
  console.log("%c  🔥 Ignite your passion for web!", "color: #aaa;");

  // Available commands
  console.log(
    "\n%c🎯 ════════ SECRET COMMANDS ════════ 🎯",
    "color: #fc7a00; font-size: 14px; font-weight: bold;"
  );
  console.log("%c  📌 %csecretFox()    %c- Meet the fox!", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");
  console.log("%c  📌 %cfoxDance()     %c- Watch the fox dance!", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");
  console.log("%c  📌 %cfoxJoke()      %c- Hear a programmer joke!", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");
  console.log("%c  📌 %cfoxWisdom()    %c- Receive fox wisdom!", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");
  console.log("%c  📌 %cfoxQuiz()      %c- Take the fox quiz!", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");
  console.log("%c  📌 %cfoxRainbow()   %c- Rainbow mode!", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");
  console.log("%c  📌 %cfoxHack()      %c- Hacker mode! 👀", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");
  console.log("%c  📌 %cmfcHistory()   %c- Learn about MFC!", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");
  console.log("%c  📌 %cfoxHelp()      %c- Show all commands!", "color: #888;", "color: #4ecdc4; font-weight: bold;", "color: #666;");

  // Secret Fox
  window.secretFox = () => {
    const foxFrames = [
      `
      %c    /\\___/\\
       (  o o  )
       (  =^=  ) 
        (---)
       _/|   |\\_ 
      🦊 Hi there!`,
      `
      %c    /\\___/\\
       (  ^ ^  )
       (  =v=  ) 
        (---)
       _/|   |\\_ 
      🦊 *blinks*`,
      `
      %c    /\\___/\\
       (  o o  )
       (  =^=  )~♪
        (---)
       _/|   |\\_ 
      🦊 *sings*`,
    ];

    foxFrames.forEach((frame, i) => {
      setTimeout(() => {
        console.log(frame, "color: #fc7a00; font-size: 14px; font-weight: bold; line-height: 1.4;");
      }, i * 500);
    });

    setTimeout(() => {
      const messages = [
        "May your code compile on the first try! ✨",
        "Remember: Every bug is just an undocumented feature! 🐛",
        "The fox believes in your debugging skills! 🔧",
        "You're not stuck, you're just building suspense! 🎬",
        "Code today, innovate tomorrow! 🚀",
        "Git commit, git push, git sleep! 😴",
        "Your stack overflow search skills are legendary! 📚",
        "Console.log('You are awesome!'); 💪",
      ];
      console.log(
        `%c\n🦊 The Fox says: "${messages[Math.floor(Math.random() * messages.length)]}"`,
        "color: #4ecdc4; font-size: 14px; font-weight: bold;"
      );
    }, 1500);
  };

  // Fox Dance
  window.foxDance = () => {
    console.log("%c🎵 FOX DANCE PARTY! 🎵", "color: #fc7a00; font-size: 20px; font-weight: bold;");
    
    const danceFrames = [
      "🦊 ┏(°.°)┛",
      "🦊 ┗(°.°)┓",
      "🦊 ┏(°.°)┓",
      "🦊 ┗(°.°)┛",
      "🦊 ┏(°.°)┛ 💃",
      "🦊 ┗(°.°)┓ 🕺",
      "🦊 ♪┏(°.°)┛♪",
      "🦊 ♪┗(°.°)┓♪",
    ];

    let i = 0;
    const interval = setInterval(() => {
      console.log(`%c${danceFrames[i % danceFrames.length]}`, "font-size: 24px;");
      i++;
      if (i >= 16) {
        clearInterval(interval);
        console.log("%c🎉 That was fun! Type foxDance() again! 🎉", "color: #4ecdc4; font-size: 12px;");
      }
    }, 200);
  };

  // Fox Joke
  window.foxJoke = () => {
    const jokes = [
      { q: "Why do programmers prefer dark mode?", a: "Because light attracts bugs! 🐛" },
      { q: "Why did the developer go broke?", a: "Because he used up all his cache! 💸" },
      { q: "Why do Java developers wear glasses?", a: "Because they can't C#! 👓" },
      { q: "What's a programmer's favorite hangout place?", a: "Foo Bar! 🍺" },
      { q: "Why did the fox cross the road?", a: "To push to production on Friday! 🦊" },
      { q: "How many programmers does it take to change a light bulb?", a: "None, that's a hardware problem! 💡" },
      { q: "Why was the JavaScript developer sad?", a: "Because he didn't Node how to Express himself! 😢" },
      { q: "What's a bug's favorite language?", a: "JavaScript - it has plenty of places to hide! 🕷️" },
      { q: "Why did the SQL query go to therapy?", a: "It had too many inner joins to deal with! 🤯" },
      { q: "What does a fox say when code works?", a: "console.log('YIPPEE!'); 🦊" },
    ];

    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    console.log(`%c🦊 ${joke.q}`, "color: #fc7a00; font-size: 14px; font-weight: bold;");
    setTimeout(() => {
      console.log(`%c   → ${joke.a}`, "color: #4ecdc4; font-size: 14px;");
    }, 1500);
  };

  // Fox Wisdom
  window.foxWisdom = () => {
    const wisdom = [
      "🦊 \"The best error message is the one that never shows up.\"",
      "🦊 \"First, solve the problem. Then, write the code.\"",
      "🦊 \"Code is like humor. When you have to explain it, it's bad.\"",
      "🦊 \"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\"",
      "🦊 \"The fox who chases two rabbits catches neither. Focus on one bug at a time.\"",
      "🦊 \"It's not a bug; it's an undocumented feature.\"",
      "🦊 \"A clever fox knows when to refactor and when to ship.\"",
      "🦊 \"Talk is cheap. Show me the code.\" - Linus Torvalds",
      "🦊 \"The only way to go fast is to go well.\" - Robert C. Martin",
      "🦊 \"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.\"",
    ];

    console.log("%c═══════════════════════════════════════════", "color: #fc7a00;");
    console.log(`%c${wisdom[Math.floor(Math.random() * wisdom.length)]}`, "color: #fcd34d; font-size: 14px; font-style: italic;");
    console.log("%c═══════════════════════════════════════════", "color: #fc7a00;");
  };

  // Fox Quiz
  window.foxQuiz = async () => {
    console.log("%c🧠 FOX QUIZ TIME! 🧠", "color: #fc7a00; font-size: 20px; font-weight: bold;");
    
    const questions = [
      { q: "What does MFC stand for?", a: "Mozilla Firefox Club", hint: "It's in the name! 🦊" },
      { q: "What year was Firefox first released?", a: "2004", hint: "Think early 2000s!" },
      { q: "What animal is the Firefox logo based on?", a: "Red panda", hint: "Not actually a fox! 🐼" },
      { q: "What is the Konami Code sequence?", a: "Up Up Down Down Left Right Left Right B A", hint: "Classic cheat code!" },
    ];

    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    console.log(`%c❓ ${randomQ.q}`, "color: #4ecdc4; font-size: 14px;");
    console.log(`%c💡 Hint: ${randomQ.hint}`, "color: #888; font-size: 11px;");
    console.log(`%c📝 Type your answer and check below in 5 seconds...`, "color: #aaa; font-size: 10px;");
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(`%c✅ Answer: ${randomQ.a}`, "color: #10b981; font-size: 14px; font-weight: bold;");
    console.log(`%c🦊 Run foxQuiz() again for another question!`, "color: #fc7a00; font-size: 11px;");
  };

  // Fox Rainbow
  window.foxRainbow = () => {
    const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"];
    const foxLine = "🦊 FIREFOX IS AWESOME! ";
    
    console.log("%c🌈 RAINBOW MODE ACTIVATED! 🌈", "font-size: 20px; font-weight: bold; background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet); color: white; padding: 10px; border-radius: 10px;");
    
    foxLine.split("").forEach((char, i) => {
      setTimeout(() => {
        console.log(`%c${char}`, `color: ${colors[i % colors.length]}; font-size: 30px; font-weight: bold;`);
      }, i * 100);
    });
  };

  // Fox Hack (Fake hacker mode)
  window.foxHack = () => {
    console.log("%c🔓 INITIATING FOX HACK SEQUENCE... 🔓", "color: #00ff00; font-size: 16px; font-family: monospace; background: #000; padding: 5px;");
    
    const hackLines = [
      "Accessing mainframe...",
      "Bypassing firewall...",
      "Decrypting fox algorithms...",
      "Downloading secret_fox_files.zip...",
      "Injecting 🦊 into system...",
      "Overriding cuteness protocols...",
      "Establishing secure tunnel...",
      "Deploying fox army...",
      "SUCCESS! You are now a certified Fox Hacker! 🦊💻",
    ];

    hackLines.forEach((line, i) => {
      setTimeout(() => {
        console.log(`%c> ${line}`, "color: #00ff00; font-size: 12px; font-family: 'Courier New', monospace; background: #000; padding: 2px 5px;");
        if (i === hackLines.length - 1) {
          console.log("%c\n🎉 Just kidding! But you're still awesome! 🎉", "color: #fc7a00; font-size: 14px;");
        }
      }, i * 500);
    });
  };

  // MFC History
  window.mfcHistory = () => {
    console.log(`
%c╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🦊 MOZILLA FIREFOX CLUB - VIT CHENNAI 🦊                    ║
║                                                                ║
║   📅 Established: Part of the global Mozilla community         ║
║                                                                ║
║   🎯 Mission: Spread awareness about open source, web         ║
║      technologies, and the open internet.                      ║
║                                                                ║
║   🔥 What we do:                                               ║
║      • Workshops on web development                            ║
║      • Open source contribution drives                         ║
║      • Tech talks and seminars                                 ║
║      • Hackathons and coding competitions                      ║
║      • Community building events                               ║
║                                                                ║
║   🌐 Part of the Mozilla Student Ambassador program           ║
║                                                                ║
║   💡 Fun fact: Firefox's logo is actually a red panda,        ║
║      not a fox! Red pandas are also called "firefoxes"        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `, "color: #fc7a00; font-size: 10px; font-family: monospace; line-height: 1.4;");
  };

  // Help command
  window.foxHelp = () => {
    console.log(`
%c╔═══════════════════════════════════════════════════════════════╗
║                    🦊 FOX COMMAND CENTER 🦊                    ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  secretFox()    → Meet the friendly fox mascot                ║
║  foxDance()     → Watch an ASCII fox dance party              ║
║  foxJoke()      → Hear a random programmer joke               ║
║  foxWisdom()    → Receive inspirational fox wisdom            ║
║  foxQuiz()      → Test your knowledge with a quiz             ║
║  foxRainbow()   → Activate rainbow mode!                      ║
║  foxHack()      → Pretend to be a hacker (for fun!)          ║
║  mfcHistory()   → Learn about Mozilla Firefox Club            ║
║  clearConsole() → Clear the console                           ║
║  foxHelp()      → Show this help menu                         ║
║                                                               ║
║  🎮 BONUS: Try the Konami Code on the main page!              ║
║     ↑ ↑ ↓ ↓ ← → ← → B A                                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `, "color: #4ecdc4; font-size: 10px; font-family: monospace;");
  };

  // Clear console
  window.clearConsole = () => {
    console.clear();
    console.log("%c🦊 Console cleared! Type foxHelp() to see available commands.", "color: #fc7a00; font-size: 12px;");
  };
};

export default initConsoleEasterEgg;
