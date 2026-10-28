let sign = "Aries";
let month = "April";
let day = 4;
let luckYNumber = 13.0;//Why are we doing this. JS only has 1 numerical data type, number, a 64 bit float.
let horoscopeDescription = "You want to go home and re-think your life.";
let believeInAstrology = false;

let mySignHeading = document.getElementById("sign");
mySignHeading.textContent = sign;

let birthdayHeading = document.querySelector(".birthday");
birthdayHeading.textContent += ` ${month} ${day}`;

let luckyNumHeading = document.querySelector(".luckyNum");
luckyNumHeading.textContent += ` ${luckYNumber}`;

let paragraphs = document.getElementsByTagName("p");
paragraphs[0].textContent = horoscopeDescription;
paragraphs[1].innerHTML += `<strong>${believeInAstrology ? "Yes" : "No"}</strong>`;

let myMoodRating = 3;

let angusName = "Angus";
let angusSign = "Capricorn";
let angusMoodRating = 3;

let enmanuelName = "Enmanuel";
let enmanuelSign = "Capricorn";
let enmanuelMoodRating = 3;

let avgMoodRating = (myMoodRating + angusMoodRating + enmanuelMoodRating) / 3;
paragraphs[2].textContent = `Today's mood rating for ${sign}: ${myMoodRating} out of 5. The average mood rating of ${sign}, ${angusSign}, and ${enmanuelSign} is: ${avgMoodRating.toFixed(1)}.`;

let signs = [ "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
let myArraySign = signs[3];
let angusArraySign = signs[0];
let enmanuelArraySign = signs[0];

let horoscopes = [
    { name: "Isaac", sign: myArraySign },
    { name: "Angus", sign: angusArraySign },
    { name: "Enmanuel", sign: enmanuelArraySign }
];

let startOfSignsPar = 3;
for (let i = 0; i < horoscopes.length; i++) {
    paragraphs[i + startOfSignsPar].textContent = `${horoscopes[i].name}'s zodiac sign is: ${horoscopes[i].sign}.`;
}

let horoscopeDescriptions = [
    "Today is a day for new beginnings. Embrace change and seize opportunities.",
    "Your determination will lead to success today. Stay focused on your goals.",
    "Communication is key today. Express yourself clearly and listen to others.",
    "Trust your intuition. It will guide you in making the right decisions.",
    "Your creativity shines today. Use it to inspire and lead others.",
    "Pay attention to the details. Your meticulous work will pay off.",
    "Balance is essential. Find harmony in all aspects of your life.",
    "Embrace transformation. Let go of what no longer serves you.",
    "Adventure awaits. Explore new horizons and expand your horizons.",
    "Hard work leads to success. Keep pushing toward your goals.",
    "Your unique perspective is an asset. Share your ideas with others.",
    "Trust your emotions. They will guide you in making the right choices."
];

horoscopeDescriptions[10] = "If at first you do not succeed, try, try, try, try, try try, try... The definition of insanity is doing the same thing over and over again and expecting different results. Keep trying, but maybe try something different this time.";

let getRandomHoroscope = () => {
    return horoscopeDescriptions[Math.floor(Math.random() * horoscopeDescriptions.length)];
}

horoscopes[0].horoscope = horoscopeDescriptions[10];
for (let i = 1; i < horoscopes.length; i++) {
    horoscopes[i].horoscope = getRandomHoroscope();
}

let startOfHoroscopesPar = 6;
for (let i = 0; i < horoscopes.length; i++) {
    paragraphs[i + startOfHoroscopesPar].textContent = `${horoscopes[i].name}'s horoscope: ${horoscopes[i].horoscope}`;
}

