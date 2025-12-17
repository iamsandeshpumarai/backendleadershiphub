// models/HomeData.js
const  mongoose = require( 'mongoose')

const AchievementSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true }
});

const ExperienceCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization:{type:String,required:true},
  period: { type: String },
icon:{type:String,enum:["building","heart","users","award"],default:"users"},
  description: { type: String },
  keyAchievements: [AchievementSchema], // Array of strings
  order: { type: Number, default: 0 },
badge:{type:String,default:null}
});

const TimelineItemSchema = new mongoose.Schema({
  year: { type: String, required: true },
  label: { type: String, required: true }
});

const HomeDataSchema = new mongoose.Schema({
  // HERO SECTION
  hero: {
    tag: { type: String, default: 'Nepalese Politician' },
    firstName: { type: String, default: 'Giriraj Mani' },
    nameHighlight: { type: String, default: 'Pokharel' },
    position: { type: String, default: 'Former Minister & Constitutional Assembly Member' },
    description: { type: String },
    stats: [{

      years: { type: String, default: '15+' },
      terms: { type: String, default: '3' },
      roles: { type: String, default: 'Multiple' }
    }
  ],
  buttonData:[{
    text:{
      type:String,
      default:"Learn More"
    },
    url:{
      type:String,
      default:"https://google.com"
    }
  }

  ],
    imageUrl: { type: String, }, // You paste the to Cloudinary link
    captionName: { type: String, default: 'Giriraj Mani Pokharel' },
    imageDesc:{type:String, default :"Former Minister of Education, Science, Technology, Health, PopulationMember of Constituent Assembly and Founding chairman Adharshila"}
  },

  // EXPERIENCE SECTION
  experience: {
    headerTag: { type: String, default: 'EXPERIENCE & LEADERSHIP' },
    headerHalfTitle: { type: String, default: 'A Legacy of' },
    headerHighlight: { type: String, default: 'Public Service' },
    headerDescription: { type: String },
cards: [ExperienceCardSchema],
//political journey section
politicalFirstTitle :{
  type:String,
  default:"Political Journey &"
},
politicalHighlihtTitle:{
  type:String,
  default:"Party Leadership"
},
politicalJourney:{type: String, default:` Giriraj Mani Pokharel's political career reflects Nepal's democratic 
            evolution. From his early role as Vice-Chairman of Janamorcha Nepal 
            to his ministerial appointments and eventual leadership in the Unified 
            Communist Party of Nepal (Maoist), his journey embodies dedication to 
            healthcare reform, constitutional development, and party unification 
            efforts that have shaped modern Nepal.`},


    timeline: [TimelineItemSchema]
  }
}, { timestamps: true });

module.exports = mongoose.models.HomeData || mongoose.model('HomeData', HomeDataSchema);