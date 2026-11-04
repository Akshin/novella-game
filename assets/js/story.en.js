/* StoryVeil: фрагмент главы 1 «Интерференции» для веб-плеера (English).
   Текст — из content/stories/interference/ch1/ink/ch1.ink. */
(() => {
  const CH = {
    hero:   { name: "Mira",   color: "#8fb8d8" },
    viktor: { name: "Viktor", color: "#c9a66b" },
    samira: { name: "Samira", color: "#d98a5c" },
    elias:  { name: "Elias",  color: "#7fa3c7" },
  };

  const SCRIPT = [
    ["bg", "balcony_night", "black"],
    ["n", "I'm eight years old. The night is warm, and nobody is sending me to bed tonight."],
    ["n", "An old desk lamp glows on the balcony. Grandpa is fussing with his telescope — adjusting, squinting, adjusting again."],
    ["show", "viktor", "center", "thoughtful", "fade"],
    ["say", "viktor", "thoughtful", "Right. Jupiter won't wait for us tonight. Come here, Mira."],
    ["n", "I press my eye to the cold eyepiece. A tiny striped pea hangs in the black circle, trembling as if under water."],
    ["n", "“Why is it shaking?” I ask."],
    ["say", "viktor", "neutral", "Because there's always something between you and a star. Air, glass, the instrument, your own eyes."],
    ["say", "viktor", "thoughtful", "Science begins when you ask: what exactly am I seeing right now? The world, or what my way of looking has done to it?"],
    ["n", "Next to Grandpa's notebook lies a coin. Ordinary, worn. I turn it over in my fingers."],
    ["say", "viktor", "smile", "Want to play a game?"],
    ["n", "He flips the coin, catches it and covers it with his palm without looking."],
    ["say", "viktor", "thoughtful", "If after the toss you could learn not one result, but both — would you look?"],
    ["choice", [
      { text: "Of course. Otherwise why toss it at all?", set: { risk: 1 }, then: [
        ["n", "“Of course,” I say. “Otherwise why toss it at all?”"],
        ["say", "viktor", "smile", "That's exactly why you can't be left alone in the kitchen."],
      ] },
      { text: "First I'd check that the coin isn't cheating us.", set: { evidence: 1 }, then: [
        ["n", "“First I'd check that the coin isn't cheating us.”"],
        ["say", "viktor", "smile", "Go ahead. It's mine, and I haven't trusted it in forty years."],
      ] },
      { text: "And if the second answer turns out worse?", set: { acceptance: 1 }, then: [
        ["n", "“And if the second answer turns out worse?”"],
        ["say", "viktor", "thoughtful", "Then you'll know that too. Knowing is sometimes hard. Not knowing is harder."],
      ] },
    ]],
    ["n", "He still doesn't lift his hand."],
    ["say", "viktor", "smile", "Remember this. The most interesting questions are the ones after which you can't go back to your old answer."],
    ["hide", "viktor", "fade"],
    ["title", "INTERFERENCE", "lift"],
    ["n", "CERN. Twenty-six years later."],
    ["n", "The express lift plunges down. Two hundred meters of rock in ninety seconds."],
    ["n", "Level markings glow on the cabin glass. Three lines on the panel: FIRST PHYSICS RUN. ASTERION. 06.42."],
    ["show", "samira", "right", "amused", "from_right"],
    ["say", "samira", "amused", "You look like we're not about to launch the biggest scientific machine in Europe, but going to break some bad news to it."],
    ["t", "neutral", "Samira Rahal. Quantum metrology, the best engineer on Q-Lattice, and the only person you can tell “I didn't sleep” without getting a lecture back."],
    ["choice", [
      { text: "If it works, the news will be good.", set: { evidence: 1 }, then: [
        ["say", "hero", "neutral", "If it works, the news will be good."],
        ["say", "samira", "amused", "“If.” I love it when physicists cheer each other up."],
      ] },
      { text: "If it doesn't blow up, that's already great.", set: { risk: 1 }, then: [
        ["say", "hero", "amused", "If it doesn't blow up, that's already great."],
        ["say", "samira", "amused", "It doesn't blow up. It breaks very expensively and very quietly."],
      ] },
      { text: "I've waited for this half my life.", set: { legacy: 1 }, then: [
        ["say", "hero", "neutral", "I've waited for this half my life."],
        ["say", "samira", "neutral", "I know. That's why I'm asking."],
        ["t", "neutral", "Not half. Longer. Since that balcony."],
      ] },
    ]],
    ["bg", "detector_cavern", "fade"],
    ["n", "The doors open straight onto the technical gallery. And behind the glass — there it is."],
    ["n", "ASTERION. Detector rings as tall as a cathedral, cable trusses, catwalks, and somewhere far below, people as tiny as dots on a graph."],
    ["t", "surprised", "I've seen it in blueprints so many times. No blueprint warns you that you'll want to whisper in front of it."],
    ["say", "samira", "neutral", "Every time, the same thing. I look at it and think: did we really build this?"],
    ["say", "samira", "amused", "Then I remember how many of my sleepless nights went into it, and it passes. Come on. Hartmann hates it when people are late for his jokes."],
    ["hide", "samira", "to_right"],
    ["bg", "control_room", "fade"],
    ["n", "ASTERION control room. A semicircle of screens, dimmed lights, twenty people, and not one of them speaks louder than necessary."],
    ["show", "elias", "center", "neutral", "fade"],
    ["n", "Elias Hartmann runs a briefing the way he writes papers: without a single wasted word."],
    ["say", "elias", "neutral", "Beams are on schedule. First-physics window in eleven minutes. The invisible-signatures group..."],
    ["n", "His eyes find me."],
    ["say", "elias", "amused", "Koval, if the Universe decides to break the Standard Model today, try to get it written up before lunch. I have a committee at four."],
    ["say", "hero", "amused", "I'll give it a deadline."],
    ["n", "A chuckle runs through the room. Six years in the same group, and I still don't know if he ever jokes off-topic."],
    ["n", "The briefing is over and people head to their consoles. Elias lingers at mine."],
    ["choice", [
      { text: "Answer just as dryly", set: { elias: 2 }, then: [
        ["say", "hero", "neutral", "I'm tracking residual correlations between subsystems myself. If anything shows up, you'll be the first to know."],
        ["say", "elias", "neutral", "That's what I'm counting on."],
      ] },
      { text: "Needle him in front of the team", set: { elias: 1, risk: 1 }, then: [
        ["say", "hero", "amused", "And if the Universe runs past four, will the committee wait, or should I cancel it?"],
        ["say", "elias", "amused", "The committee has waited twenty years. The Universe will manage faster."],
      ] },
      { text: "“You didn't sleep either?”", premium: 20, set: { elias: 3 }, then: [
        ["n", "I say it quietly, so only he can hear."],
        ["say", "hero", "neutral", "You didn't sleep either?"],
        ["say", "elias", "surprised", "..."],
        ["say", "elias", "neutral", "Since three. Rereading your noise model. For the fourth time."],
        ["say", "hero", "amused", "Find a mistake?"],
        ["say", "elias", "amused", "No. That's what worries me."],
        ["t", "neutral", "For the first time he said “your model,” not “the group's model.”"],
      ] },
    ]],
    ["n", "A door opens behind him, and the whole room quietly straightens up."],
    ["say", "elias", "serious", "Voss is on site. Officially he's a guest. In reality his company built the Q-Lattice core, and half the committee is here because of him."],
    ["say", "elias", "neutral", "Be yourself with him. Just at half strength."],
    ["end"],
  ];

  const MEMORY = {
    risk: "Risk",
    evidence: "Evidence",
    acceptance: "Openness to the “second answer”",
    legacy: "Opened up to Samira",
    elias: "Relationship with Elias",
  };

  const UI = {
    screenLabel: "The game Interference. Tap the screen or press Space to continue.",
    chapter: "Chapter 1",
    meta: ["Sci-fi", "16+", "Chapter 1"],
    title: "Interference",
    synopsis: "CERN, 2046. The collider receives data from experiments that haven't happened yet, and footage of people who are already gone.",
    play: "Play",
    length: "Chapter 1 excerpt · about three minutes",
    endTitle: "End of excerpt",
    endMemory: "The game remembered your decisions:",
    endNote: "They shape the scenes that follow. The full chapter arrives with the game.",
    replay: "Play again",
    thoughts: "Thoughts",
    paidLabel: (text, n) => `${text}. Special choice: ${n} gems`,
    paidMemory: (n) => `Special choice for ${n} gems`,
  };

  window.STORYVEIL_DEMO = { ui: UI, chars: CH, script: SCRIPT, memory: MEMORY };
})();
