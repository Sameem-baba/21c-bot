const fetch = require("node-fetch");
const Discord = require("discord.js");
require("dotenv").config();
const links = require("../links.json");

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const random_number = getRandomNumber(0, 5);
const number = getRandomNumber(0, 7);

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
}

function getAdvice() {
  return fetch("https://api.adviceslip.com/advice").then((res) => {
    return res.json();
  });
}

function getApod() {
  return fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
  ).then((res) => {
    return res.json();
  });
}

function getMars() {
  return fetch(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=0&api_key=${process.env.NASA_API_KEY}`
  ).then((res) => {
    return res.json();
  });
}

function getSpaceX() {
  return fetch("https://api.spacexdata.com/v5/launches/latest").then((res) => {
    return res.json();
  });
}

function getNews() {
  return fetch("https://api.spaceflightnewsapi.net/v3/articles").then((res) => {
    return res.json();
  });
}

function getActivity() {
  return fetch("https://www.boredapi.com/api/activity?participants=1").then(
    (res) => {
      return res.json();
    }
  );
}

const getUniversity = (univ) => {
  return fetch(`http://universities.hipolabs.com/search?name=${univ}`).then(
    (res) => {
      return res.json();
    }
  );
};

function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + " ..." : str;
}

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (message.content.startsWith("!")) {
      if (message.content.substring(1) === "inspire") {
        getQuote().then((quote) => message.channel.send(quote));
      } else if (message.content.substring(1) === "bored") {
        getActivity().then((data) => {
          const boredEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(data.activity)
            .setDescription(`Type - ${data.type}`)
            .setURL(data.link);
          message.channel.send({ embeds: [boredEmbed] });
        });
      } else if (message.content.substring(1) === "help") {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor("#558aff")
          .setTitle("Help")
          .addFields({
            name: "A list of my commands",
            value:
              '\n !inspire - Get a Random Quote\n !advice - Get a Random Advice \n!bored - Get a Random Activity\n \n s?apod - To get Astronomy Picture of the Day\n s?mars - To get random image taken by the rover of Mars \n s?news - Get latest News about Space \n s?latest - Get the latest Launch by SpaceX \n \n univ?"Name of the university" - To get the website of the University you are searching',
          });
        message.channel.send({ embeds: [helpEmbed] });
      } else if (message.content.substring(1) === "advice") {
        getAdvice().then((advice) => {
          const adviceEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setDescription(`${advice.slip.advice}`);
          message.channel.send({ embeds: [adviceEmbed] });
        });
      }
    }

    if (message.content.startsWith("s?")) {
      if (message.content.substring(2) === "apod") {
        getApod().then((data) => {
          const apodEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(data.title)
            .setDescription(truncate(data.explanation, 250))
            .setImage(data.hdurl);
          message.channel.send({ embeds: [apodEmbed] });
        });
      } else if (message.content.substring(2) === "mars") {
        getMars().then((data) => {
          const marsEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle("An Image of Mars By Curosity Rover")
            .setDescription(data.photos[number]?.earth_date)
            .setImage(data.photos[number]?.img_src);
          message.channel.send({ embeds: [marsEmbed] });
        });
      } else if (message.content.substring(2) === "latest") {
        getSpaceX().then((data) => {
          const latestEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(data.name)
            .setDescription(`${data?.details}`)
            .setImage(data.links.patch.large)
            .setURL(data.links.webcast);
          message.channel.send({ embeds: [latestEmbed] });
        });
      } else if (message.content.substring(2) === "news") {
        getNews().then((data) => {
          const newsEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(data[random_number].title)
            .setDescription(`${data[random_number].summary}`)
            .setImage(data[random_number].imageUrl)
            .setURL(data[random_number].url);
          message.channel.send({ embeds: [newsEmbed] });
        });
      }
    }

    if (message.content.startsWith("univ?")) {
      const university = message.content.substring(5);
      await getUniversity(university).then((data) => {
        if (data.length > 0) {
          const univEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(`${data?.[0]?.name}`)
            .setDescription(
              `Country - ${data?.[0]?.country} \n \n Domain - ${data?.[0].domains?.[0]}`
            )
            .setURL(data?.[0]?.web_pages?.[0])
            .setTimestamp(new Date())
            .setFooter(`${message.guild.name}`, `${message.guild.iconURL()}`);
          message.channel.send({ embeds: [univEmbed] });
        } else {
          message.channel.send({
            content: "There is no such university in our database",
            empheral: true,
          });
        }
      });
    }

    if (message.content.startsWith("pdf?")) {
      const pdf = message.content.substring(4);
      const index = links.findIndex(function (todo, index) {
        return todo.command === pdf.toLowerCase();
      });
      const data = links[index];

      if (data) {
        const pdfEmbed = new Discord.MessageEmbed()
          .setColor("#558aff")
          .setTitle(`${data?.name}`)
          .setDescription(`${data?.description}`)
          .setURL(data?.link)
          .setTimestamp(new Date())
          .setFooter(`${message.guild.name}`, `${message.guild.iconURL()}`);
        message.channel.send({ embeds: [pdfEmbed] });
      } else {
        message.channel.send({
          content: "There is no such PDF in our database",
          empheral: true,
        });
      }
    }

    /*if (sadWords.some(word => message.content.includes(word))) {
      const encouragement = encouragments[Math.floor(Math.random() * encouragments.length)];
      message.reply(encouragement);
    }*/
  },
};
