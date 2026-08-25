const CORE_TEMPLATES = [
["Student","📚","Middle Class Student","Har middle-class student is feeling ko samjhega…","Sapne bade hain, budget chhota hai. Lekin consistency free hai. Roz thoda improve karo.","Books close-up\nStudy table\nGoal screen\nFinal reaction","#studentlife #hindireels #relatable"],
["Student","😂","Exam Tomorrow","Exam kal hai aur syllabus bol raha hai: pehchana mujhe?","Kal se padhunga bolte-bolte exam aa gaya. Ab notes, coffee aur dua teenon saath chalenge.","Calendar\nPhone scrolling\nBooks\nPanic reaction","#exam #studentcomedy #reelsindia"],
["Student","🎯","Study Focus","Padhai mein focus nahi lag raha? Ye try karo.","Phone door rakho. 25 minute sirf ek task. 5 minute break. Repeat.","Phone silent\nTimer\nStudy shot\nChecklist","#study #focus #students"],
["Motivation","🔥","Nobody Is Coming","Tumhe bachane koi nahi aa raha.","Motivation ka wait mat karo. Chhota step lo. Result consistency se aata hai.","Alarm\nShoes\nWork shot\nWalking","#motivation #discipline #growth"],
["Motivation","🚀","One Percent Better","Roz perfect nahi, bas 1% better.","Aaj kal se thoda better. Small improvements boring lagte hain, par compound hote hain.","Checklist\nReading\nWorkout\nCalendar","#habits #growth #motivation"],
["Motivation","💪","Bad Day","Ek bad day, bad life nahi hoti.","Aaj slow ho sakte ho. Bas rukna permanent mat banana.","Window shot\nWalk\nWork\nSmile","#mindset #selfgrowth #hindireels"],
["Comedy","😂","Mummy vs Parcel","Parcel aaya aur mummy ne gate khol diya…","Mummy: phir parcel? Main: purane parcel ka update hai. Mummy: box ke andar update?","Doorbell\nParcel\nReaction\nFreeze frame","#desicomedy #mummy #relatable"],
["Comedy","📱","5 Minute Break","Bas 5 minute phone chalaunga…","Ek reel, phir doosri. Phone rakha to ek ghanta gayab.","Clock\nScrolling\nTime lapse\nShock","#comedy #phone #relatable"],
["Comedy","💸","Salary Day","Salary aayi… aur 10 minute baad gayab.","Rent, recharge, bills aur EMI ne group attack kar diya.","Notification\nHappy face\nBills\nSad face","#salary #comedyreels #relatable"],
["Facts","🧠","Phone Battery","Battery ka sabse bada dushman sirf charging nahi…","Extreme heat battery health ko affect kar sakti hai. Phone ko unnecessary heat se bachao.","Battery\nHeat visual\nPhone\nTip text","#techfacts #phonefacts #hindifacts"],
["Facts","🌙","Sleep Fact","Late-night scrolling ka ek hidden cost hai.","Screen time bedtime ko delay kar sakta hai. Sleep routine ko consistent rakhna useful hai.","Clock\nPhone\nLights off\nMorning","#facts #sleep #healthytips"],
["Facts","💡","Memory Trick","Jo padhte ho woh bhool jaate ho?","Active recall try karo: book band karke khud se answer yaad karo.","Book\nClose book\nQuestion\nAnswer","#studyfacts #memory #learning"],
["Business","💸","₹0 Skill","Paise nahi? Pehle earning skill banao.","Editing, design, coding ya sales. Roz seekho aur samples banao.","Phone learning\nPractice\nPortfolio\nResult","#skills #earning #businessindia"],
["Business","📈","First Customer","Logo se pehle customer dhoondo.","Real problem choose karo aur validate karo ki koi solution ke liye pay karega.","Logo\nCross\nCustomer chat\nResult","#startupindia #business #marketing"],
["Business","🧾","Sell Result","Log feature nahi, result kharidte hain.","Apne offer ko simple result language mein explain karo.","Product\nFeature\nResult text\nCTA","#sales #marketing #business"],
["Attitude","😎","Silent Moves","Har plan duniya ko batana zaroori nahi.","Private work. Public results. Noise se zyada execution important hai.","Close-up\nWork\nSilent phone\nWalk","#attitude #mindset #confidence"],
["Attitude","👑","Self Respect","Har jagah fit hona zaroori nahi.","Jahan respect nahi, wahan distance bhi answer hota hai.","Mirror\nWalk\nPhone off\nFinal look","#selfrespect #attitude #hindireels"],
["Attitude","⚡","No Comparison","Race tumhari hai.","Dusron ki highlight reel se apni daily life compare mat karo.","Scrolling\nStop\nWork\nSmile","#confidence #mindset #growth"],
["Fitness","💪","No Gym Excuse","Gym nahi? Movement phir bhi possible hai.","Walk, push-ups, squats. Start simple and progress gradually.","Shoes\nWalk\nWorkout\nWater","#fitness #workout #reels"],
["Fitness","🥗","Consistency","Perfect diet se pehle consistent habits.","Simple meals, movement aur sleep routine par focus karo.","Meal\nWalk\nWater\nSleep","#fitnessindia #habits #health"],
["Relationship","❤️","Small Things","Love hamesha expensive nahi hota.","Time, attention aur respect chhoti cheezein lagti hain, impact bada hota hai.","Message\nCoffee\nWalk\nSmile","#love #relationship #reels"],
["Relationship","💔","Moving On","Closure har baar saamne wale se nahi milta.","Kabhi-kabhi closure khud decide karna padta hai: bas, ab aage.","Old chat\nDelete\nWalk\nSunrise","#movingon #heartbreak #growth"],
["Creator","🎬","First 3 Seconds","Reel ka first 3 seconds waste mat karo.","Viewer ko immediately reason do rukne ka: question, surprise ya clear promise.","Camera\nHook text\nCut\nCTA","#contentcreator #reeltips #creator"],
["Creator","🎣","Better Hook","Ye mat bolo: hello guys, aaj hum…","Seedha problem bolo: agar tumhari reels par views nahi aa rahe, ye dekho.","Bad hook\nCross\nGood hook\nExample","#reelgrowth #hooks #contenttips"],
["Creator","📹","B-Roll Idea","Face dikhana nahi chahte?","Hands, desk, walking, phone aur environment shots se faceless reel banao.","Hands\nDesk\nWalk\nPhone","#faceless #reelideas #creator"],
["Tech","🤖","AI Reality","AI tumhari job lega ya nahi?","Better question: kya AI use karne wala insaan tumse faster kaam karega?","Laptop\nAI screen\nWork\nQuestion","#ai #technology #future"],
["Tech","📲","Phone Tip","Ye simple phone habit try karo.","Unnecessary notifications off karke distraction kam ki ja sakti hai.","Settings\nNotifications\nOff\nFocus","#techtips #phone #productivity"],
["Life","🌱","Start Again","Dobara start karna failure nahi.","Experience ke saath restart karna zero se start karna nahi hota.","Old page\nNew page\nWork\nSunrise","#life #motivation #newstart"],
["Life","⌛","Time","Time milta nahi, allocate hota hai.","Har cheez priority nahi ban sakti. Decide karo abhi important kya hai.","Clock\nList\nCross\nFocus","#time #productivity #life"],
["Life","🧘","Peace","Har argument jeetna zaroori nahi.","Kuch jagah peace prove karne se zyada valuable hoti hai.","Message\nPause\nWalk\nSky","#peace #mindset #life"]
];

const endings = [
"Isko apne style mein shoot karo.",
"Last mein ek strong reaction add karo.",
"End par audience se question poochho.",
"Fast cuts ke saath try karo."
];

window.REEL_IDEAS = [];

let id = 1;

for(let round=0; round<4; round++){
  CORE_TEMPLATES.forEach((x,index)=>{
    window.REEL_IDEAS.push({
      id:id++,
      category:x[0],
      emoji:x[1],
      title:round===0 ? x[2] : x[2]+" • V"+(round+1),
      hook:round===0 ? x[3] : x[3]+" "+endings[(index+round)%endings.length],
      script:x[4],
      shots:x[5],
      caption:x[3],
      hashtags:x[6],
      duration:[15,20,30][(index+round)%3]+" sec"
    });
  });
}
