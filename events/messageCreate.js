const fetch = require("node-fetch");
const Discord = require("discord.js")
require("dotenv").config();
const links = require("../links.json");

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const random_number = getRandomNumber(0, 5);
const number = getRandomNumber(0, 7);

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " -"+ data[0]["a"]
    })
}

function getAdvice() {
  return fetch("https://api.adviceslip.com/advice")
    .then((res) => {
      return res.json()
    }
  )
}

function getApod() {
  return fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
    .then((res) => {
      return res.json();
    })
}

function getMars() {
  return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=0&api_key=${process.env.NASA_API_KEY}`)
    .then((res) => {
      return res.json();
    })
}

function getSpaceX() {
  return fetch("https://api.spacexdata.com/v5/launches/latest")
    .then((res) => {
      return res.json();
    }
  )
}

function getNews() {
  return fetch("https://api.spaceflightnewsapi.net/v3/articles")
    .then((res) => {
      return res.json();
    }
  )
}

function getActivity() {
  return fetch("https://www.boredapi.com/api/activity?participants=1")
    .then(res => {
      return res.json()
    }
  )
}

const getUniversity = (univ) => {
  return fetch(`http://universities.hipolabs.com/search?name=${univ}`)
    .then(res => {
      return res.json()
    }
  )
}

function truncate(str, n){
  return str?.length > n ? str.substr(0, n - 1) + " ...": str;
}


module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (message.content.startsWith('!')) {
      if (message.content.substring(1) === 'inspire') {
        getQuote().then(quote => message.channel.send(quote))
      } else if (message.content.substring(1) === 'bored') {
        getActivity().then((data) => {
          const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(data.activity)
            .setDescription(`Type - ${data.type}`)
            .setURL(data.link)
            .setFooter(new Date())
          message.channel.send({embeds: [newMemberEmbed]})
        })
      } else if (message.content.substring(1)=== 'help'){
        const helpEmbed = new Discord.MessageEmbed()
          .setColor("#558aff")
          .setTitle('Help')
          .addFields(
            { name: 'A list of my commands', value: '\n !inspire - Get a Random Quote\n !advice - Get a Random Advice \n!bored - Get a Random Activity\n \n s?apod - To get Astronomy Picture of the Day\n s?mars - To get random image taken by the rover of Mars \n s?news - Get latest News about Space \n s?latest - Get the latest Launch by SpaceX \n \n univ?"Name of the university" - To get the website of the University you are searching' },
          );
        message.channel.send({embeds: [helpEmbed]}) 
      } else if (message.content.substring(1) === 'advice') {
        getAdvice().then((advice) => {
          const adviceEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setDescription(`${advice.slip.advice}`)
          message.channel.send({embeds: [adviceEmbed]})
        })
      } else if (message.content.substring(1) === 'about'){
        const helpEmbed = new Discord.MessageEmbed()
          .setColor("#558aff")
          .setTitle('About')
          .addFields(
            { name: 'Owner', value: '@Sameem#3048' },
          )
          .setImage("");
        message.channel.send({embeds: [helpEmbed]})}
    }

    if (message.content.startsWith('s?')) {
      if (message.content.substring(2) === 'apod') {
        getApod().then(data => {
          const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(data.title)
            .setDescription(truncate(data.explanation, 250))
            .setImage(data.hdurl)
            .setTimestamp(new Date())
          message.channel.send({embeds: [newMemberEmbed]})
        })
      } else if (message.content.substring(2) === 'mars') {
        getMars().then((data) => {
          const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle('An Image of Mars By Curosity Rover')
            .setDescription(data.photos[number]?.earth_date)
            .setImage(data.photos[number]?.img_src)
            .setTimestamp(new Date())
          message.channel.send({embeds: [newMemberEmbed]})
        })
      } else if (message.content.substring(2) === 'latest') {
        getSpaceX().then((data) => {
          const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(data.name)
            .setDescription(`${data?.details}`)
            .setImage(data.links.patch.large)
            .setTimestamp(new Date())
            .setURL(data.links.webcast)
          message.channel.send({embeds: [newMemberEmbed]})
        })
      } else if (message.content.substring(2) === 'news') {
        getNews().then((data) => {
          const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(data[random_number].title)
            .setDescription(`${data[random_number].summary}`)
            .setImage(data[random_number].imageUrl)
            .setTimestamp(new Date())
            .setURL(data[random_number].url)
          message.channel.send({embeds: [newMemberEmbed]})
        })
      }
    }

    if (message.content.startsWith('univ?')) {
      const university = message.content.substring(5);
      await getUniversity(university).then((data) => {
        if (data.length > 0) {   
          const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(`${data?.[0]?.name}`)
            .setDescription(`Country - ${data?.[0]?.country} \n \n Domain - ${data?.[0].domains?.[0]}`)
            .setURL(data?.[0]?.web_pages?.[0])
            .setTimestamp(new Date())
            .setFooter('21consequences', 'https://instagram.fixj2-1.fna.fbcdn.net/v/t51.2885-19/s320x320/121002505_191567832412190_2484127239596695619_n.jpg?_nc_ht=instagram.fixj2-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=C0_EeYh7lvEAX9T0Nax&edm=ABfd0MgBAAAA&ccb=7-4&oh=6082d55e3a50a30894dc08768334ce77&oe=61B024EE&_nc_sid=7bff83');
          message.channel.send({ embeds: [newMemberEmbed] })
        } else {
          message.channel.send({content: 'There is no such university in our database', empheral: true})
        }
      })
    }

    if (message.content.startsWith('pdf?')) {
      const pdf = message.content.substring(4);
      const index = links.findIndex(function (todo, index) {
        return todo.command === pdf.toLowerCase();
      })
      const data = links[index];
      
      if (data) {
        const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#558aff")
            .setTitle(`${data?.name}`)
            .setDescription(`${data?.description}`)
            .setURL(data?.link)
            .setTimestamp(new Date())
            .setFooter('21consequences', 'https://instagram.fixj2-1.fna.fbcdn.net/v/t51.2885-19/s320x320/121002505_191567832412190_2484127239596695619_n.jpg?_nc_ht=instagram.fixj2-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=C0_EeYh7lvEAX9T0Nax&edm=ABfd0MgBAAAA&ccb=7-4&oh=6082d55e3a50a30894dc08768334ce77&oe=61B024EE&_nc_sid=7bff83');
          message.channel.send({ embeds: [newMemberEmbed] })
      } else {
        message.channel.send({content: 'There is no such PDF in our database', empheral: true})
      }
      
    }



    /*if (sadWords.some(word => message.content.includes(word))) {
      const encouragement = encouragments[Math.floor(Math.random() * encouragments.length)];
      message.reply(encouragement);
    }*/
  }
}